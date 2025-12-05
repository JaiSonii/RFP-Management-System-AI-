import { RFPModel, IRFP } from '../models/RFP';
import { VendorModel } from '../models/Vendor';
import { ProposalModel } from '../models/Proposal';
import { AIService } from './AIService';
import { EmailService } from './EmailService';

export class RfpService {
    private aiService: AIService;
    private emailService: EmailService;

    constructor() {
        this.aiService = new AIService();
        this.emailService = new EmailService();
    }

    async createRFP(naturalLanguage: string): Promise<IRFP> {
        const structuredData = await this.aiService.parseRFPRequest(naturalLanguage);

        const newRFP = new RFPModel({
            ...structuredData,
            description: naturalLanguage,
            status: 'DRAFT'
        });

        return await newRFP.save();
    }

    async sendToVendors(rfpId: string, vendorIds: string[]) {
        const rfp = await RFPModel.findById(rfpId);
        if (!rfp) throw new Error("RFP not found");

        const vendors = await VendorModel.find({ _id: { $in: vendorIds } });

        const emailPromises = vendors.map(vendor => {
            const body = `Hello ${vendor.name},\n\nWe have a new request: ${rfp.title}.\n\nRequirements:\n${rfp.description}\n\nPlease reply to this email with your quote.`;

            const subject = `RFP: ${rfp.title} [Ref:${rfp._id}]`;

            return this.emailService.sendRFP(vendor.email, subject, body);
        });

        await Promise.all(emailPromises);

        rfp.status = 'OPEN';
        await rfp.save();
        return { message: `Sent to ${vendors.length} vendors` };
    }

    async processIncomingEmail(vendorEmail: string, emailBody: string, rfpId: string) {
        const vendor = await VendorModel.findOne({ email: vendorEmail });
        if (!vendor) throw new Error("Vendor unknown");

        const analysis = await this.aiService.parseVendorResponse(emailBody);

        const proposal = new ProposalModel({
            rfpId,
            vendorId: vendor._id,
            rawEmailContent: emailBody,
            extractedPrice: analysis.price,
            extractedTimeline: analysis.timeline,
            extractedWarranty: analysis.warranty,
            aiSummary: analysis.summary
        });

        return await proposal.save();
    }

    async compareProposalsForRFP(rfpId: string) {
        const rfp = await RFPModel.findById(rfpId);
        const proposals = await ProposalModel.find({ rfpId }).populate('vendorId', 'name');

        if (proposals.length === 0) return [];

        const comparisonData = proposals.map(p => ({
            id: p._id,
            vendor: (p.vendorId as any).name,
            price: p.extractedPrice,
            terms: `${p.extractedTimeline}, ${p.extractedWarranty}`
        }));

        const aiRanking = await this.aiService.compareProposals(rfp?.description || "", comparisonData);

        return {
            rfp,
            proposals,
            aiAnalysis: aiRanking
        };

    }

    async getAllRFPs() {
        return await RFPModel.find().sort({ createdAt: -1 });
    }
}