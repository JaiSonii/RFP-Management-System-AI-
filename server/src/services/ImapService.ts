import imaps from 'imap-simple';
import { simpleParser } from 'mailparser';
import { RfpService } from './RfpService';

export class ImapService {
    private rfpService: RfpService;
    private config: any;

    constructor() {
        this.rfpService = new RfpService();
        this.config = {
            imap: {
                user: process.env.SMTP_USER,
                password: process.env.SMTP_PASS,
                host: 'imap.gmail.com',
                port: 993,
                tls: true,
                authTimeout: 15000,
                tlsOptions: {
                    rejectUnauthorized: false,
                    servername: 'imap.gmail.com'
                }
            }
        };
    }

    async connectAndListen() {
        console.log("Starting IMAP Email Listener...");

        // Poll every 30 seconds
        setInterval(async () => {
            try {
                await this.checkEmails();
            } catch (err: any) {
                console.error("IMAP Error:", err.message);
            }
        }, 30000);
    }

    private async checkEmails() {
        try {
            const connection = await imaps.connect(this.config);

            try {
                await connection.openBox('INBOX');

                const searchCriteria = ['UNSEEN'];
                const fetchOptions = {
                    bodies: [''],
                    markSeen: true
                };

                const messages = await connection.search(searchCriteria, fetchOptions);

                if (messages.length > 0) {
                    console.log(`📧 Found ${messages.length} new emails. Processing...`);
                }

                for (const item of messages) {
                    const all = item.parts.find((part: any) => part.which === '');

                    if (!all) continue;

                    const mail = await simpleParser(all.body);

                    const fromAddress = mail.from?.value[0]?.address;
                    const subject = mail.subject || "";
                    const textBody = mail.text || "";

                    console.log(`From: ${fromAddress}, Subject: ${subject}`);

                    if (!fromAddress) continue;

                    const match = subject.match(/\[Ref:([a-fA-F0-9]{24})\]/);

                    if (match && match[1]) {
                        const rfpId = match[1];
                        console.log(`Detected Response for RFP: ${rfpId} from ${fromAddress}`);
                        await this.rfpService.processIncomingEmail(fromAddress, textBody, rfpId);
                        console.log(`Successfully processed proposal from ${fromAddress}`);
                    } else {
                        console.log(`Email from ${fromAddress} ignored (No Ref in subject)`);
                    }
                }
            } finally {
                connection.end();
            }
        } catch (err: any) {
            if (err.code !== 'ETIMEDOUT') {
                console.error("IMAP Connection Failed:", err.message);
            }
        }
    }
}