import mongoose, { Schema, Document } from 'mongoose';

export interface IVendor extends Document {
    name: string;
    email: string;
    contactPerson: string;
}

const VendorSchema: Schema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    contactPerson: { type: String }
});

export const VendorModel = mongoose.model<IVendor>('Vendor', VendorSchema);