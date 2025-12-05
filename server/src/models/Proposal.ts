import mongoose, { Schema, Document } from 'mongoose';

export interface IProposal extends Document {
    rfpId: mongoose.Types.ObjectId;
    vendorId: mongoose.Types.ObjectId;
    rawEmailContent: string;
    extractedPrice: number;
    extractedTimeline: string;
    extractedWarranty: string;
    aiSummary: string;
    score: number;
    createdAt: Date;
}

const ProposalSchema: Schema = new Schema({
    rfpId: { type: Schema.Types.ObjectId, ref: 'RFP', required: true },
    vendorId: { type: Schema.Types.ObjectId, ref: 'Vendor', required: true },
    rawEmailContent: { type: String, required: true },
    extractedPrice: Number,
    extractedTimeline: String,
    extractedWarranty: String,
    aiSummary: String,
    score: Number
}, { timestamps: true });

export const ProposalModel = mongoose.model<IProposal>('Proposal', ProposalSchema);