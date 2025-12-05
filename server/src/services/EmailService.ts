import nodemailer from 'nodemailer';

export class EmailService {

    async sendRFP(to: string, subject: string, body: string) {
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            auth: {
                user: process.env.SMTP_USER, 
                pass: process.env.SMTP_PASS, 
            },
        });

        const senderEmail = process.env.SMTP_USER; 

        const info = await transporter.sendMail({
            from: `"Procurement AI" <${senderEmail}>`, 
            to: to,
            subject: subject,
            text: body,
        });

        console.log(`Email sent: ${info.messageId}`);
        console.log(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
        return info;
    }
}