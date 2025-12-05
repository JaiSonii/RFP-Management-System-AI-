export interface IRFPItem {
    item_name: string;
    quantity: number;
    specs: string;
}

export interface IRFP {
    _id: string;
    title: string;
    description: string;
    budget: number;
    currency: string;
    deadline: string;
    items: IRFPItem[];
    status: 'DRAFT' | 'OPEN' | 'CLOSED';
    createdAt: string;
}

export interface IVendor {
    _id: string;
    name: string;
    email: string;
    contactPerson: string;
}

export interface IProposal {
    _id: string;
    vendor: string; // Populated name
    price: number;
    terms: string;
}

export interface IComparisonReport {
    rfp: IRFP;
    proposals: any[]; // Full proposal objects
    aiAnalysis: Array<{
        vendor_id: string;
        score: number;
        reason: string;
    }>;
}