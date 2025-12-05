import { useEffect, useState } from 'react';
import { rfpApi, vendorApi } from '../api';
import type { IRFP, IVendor } from '../types';
import { Link } from 'react-router-dom';

export const Dashboard = () => {
    const [rfps, setRfps] = useState<IRFP[]>([]);
    const [vendors, setVendors] = useState<IVendor[]>([]);
    const [selectedRfp, setSelectedRfp] = useState<string | null>(null);
    const [selectedVendors, setSelectedVendors] = useState<string[]>([]);
    const [sending, setSending] = useState(false);

    useEffect(() => {
        rfpApi.getAll().then(res => setRfps(res.data));
        vendorApi.getAll().then(res => setVendors(res.data));
    }, []);

    const handleSend = async () => {
        if (!selectedRfp || selectedVendors.length === 0) return;
        setSending(true);
        try {
            await rfpApi.send(selectedRfp, selectedVendors);
            alert('Emails sent successfully!');
            setSelectedRfp(null);
            // Refresh list
            const res = await rfpApi.getAll();
            setRfps(res.data);
        } catch (err) {
            alert('Error sending emails');
        } finally {
            setSending(false);
        }
    };

    const toggleVendor = (id: string) => {
        setSelectedVendors(prev => 
            prev.includes(id) ? prev.filter(v => v !== id) : [...prev, id]
        );
    };

    return (
        <div>
            <h2 className="text-2xl font-bold mb-6">RFP Dashboard</h2>
            <div className="grid gap-4">
                {rfps.map(rfp => (
                    <div key={rfp._id} className="bg-white p-6 rounded-lg shadow-sm border">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-lg font-bold">{rfp.title}</h3>
                                <p className="text-gray-500 text-sm mb-2">Created: {new Date(rfp.createdAt).toLocaleDateString()}</p>
                                <p className="text-gray-700">{rfp.description.substring(0, 100)}...</p>
                            </div>
                            <div className="text-right">
                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                    rfp.status === 'OPEN' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                                }`}>
                                    {rfp.status}
                                </span>
                                <div className="mt-4 space-x-2">
                                    {rfp.status === 'DRAFT' && (
                                        <button 
                                            onClick={() => setSelectedRfp(rfp._id)}
                                            className="text-sm bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700"
                                        >
                                            Send to Vendors
                                        </button>
                                    )}
                                    <Link 
                                        to={`/compare/${rfp._id}`}
                                        className="text-sm border border-gray-300 px-3 py-1 rounded hover:bg-gray-50"
                                    >
                                        View Proposals
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Vendor Selection Modal / Inline Area */}
                        {selectedRfp === rfp._id && (
                            <div className="mt-4 p-4 bg-gray-50 rounded border border-indigo-100">
                                <h4 className="font-bold text-sm mb-2">Select Vendors to Email:</h4>
                                <div className="space-y-2 mb-4">
                                    {vendors.map(v => (
                                        <label key={v._id} className="flex items-center space-x-2">
                                            <input 
                                                type="checkbox" 
                                                checked={selectedVendors.includes(v._id)}
                                                onChange={() => toggleVendor(v._id)}
                                            />
                                            <span>{v.name} ({v.email})</span>
                                        </label>
                                    ))}
                                </div>
                                <div className="flex space-x-2">
                                    <button 
                                        onClick={handleSend}
                                        disabled={sending || selectedVendors.length === 0}
                                        className="bg-green-600 text-white px-4 py-1 rounded text-sm hover:bg-green-700 disabled:opacity-50"
                                    >
                                        {sending ? 'Sending...' : 'Confirm & Send'}
                                    </button>
                                    <button onClick={() => setSelectedRfp(null)} className="text-gray-500 text-sm">Cancel</button>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};