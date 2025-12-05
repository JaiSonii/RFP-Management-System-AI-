import mongoose, { Schema, Document } from 'mongoose';

export interface IRFPItem {
    item_name: string;
    quantity: number;
    specs: string;
}

export interface IRFP extends Document {
    title: string;
    description: string;
    budget: number;
    currency: string;
    deadline: Date;
    items: IRFPItem[];
    status: 'DRAFT' | 'OPEN' | 'CLOSED';
    createdAt: Date;
}

const RFPSchema: Schema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    budget: { type: Number },
    currency: { type: String, default: 'USD' },
    deadline: { type: Date },
    items: [{
        item_name: String,
        quantity: Number,
        specs: String
    }],
    status: { type: String, enum: ['DRAFT', 'OPEN', 'CLOSED'], default: 'DRAFT' }
}, { timestamps: true });

export const RFPModel = mongoose.model<IRFP>('RFP', RFPSchema);