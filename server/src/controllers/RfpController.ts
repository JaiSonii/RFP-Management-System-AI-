import type { Request, Response } from 'express';
import { RfpService } from '../services/RfpService';
import { VendorModel } from '../models/Vendor'; // Helper for quick vendor add

const rfpService = new RfpService();

export class RfpController {

    static async getAll(req: Request, res: Response) {
        try {
            const rfps = await rfpService.getAllRFPs();
            res.json(rfps);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    static async getVendors(req: Request, res: Response) {
        try {
            const vendors = await VendorModel.find().sort({ createdAt: -1 });
            res.json(vendors);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    static async create(req: Request, res: Response) {
        try {
            const { prompt } = req.body; // Natural language input
            const rfp = await rfpService.createRFP(prompt);
            res.status(201).json(rfp);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    static async send(req: Request, res: Response) {
        try {
            const { rfpId, vendorIds } = req.body;
            const result = await rfpService.sendToVendors(rfpId, vendorIds);
            res.json(result);
        } catch (error: any) {
            console.log(error)
            res.status(500).json({ error: error.message });
        }
    }

    static async receiveWebhook(req: Request, res: Response) {
        try {
            const { sender, body, subject } = req.body;
            const { rfpId } = req.body;

            const proposal = await rfpService.processIncomingEmail(sender, body, rfpId);
            res.status(201).json(proposal);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    static async compare(req: Request, res: Response) {
        try {
            const { rfpId } = req.params;
            const report = await rfpService.compareProposalsForRFP(rfpId);
            res.json(report);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    // Helper to seed a vendor for testing
    static async createVendor(req: Request, res: Response) {
        const vendor = await VendorModel.create(req.body);
        res.json(vendor);
    }
}