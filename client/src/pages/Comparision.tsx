import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { rfpApi } from '../api';
import type { IComparisonReport } from '../types';

export const Comparison = () => {
    const { id } = useParams<{ id: string }>();
    const [report, setReport] = useState<IComparisonReport | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;
        rfpApi.compare(id)
            .then(res => setReport(res.data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) return <div>Loading AI Analysis...</div>;
    if (!report || !report.proposals?.length) return <div className="p-8 text-center text-gray-500">No proposals received yet.</div>;

    return (
        <div>
            <div className="mb-6">
                <h2 className="text-2xl font-bold">Proposal Comparison</h2>
                <p className="text-gray-500">RFP: {report.rfp.title}</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* AI Ranking Column */}
                <div className="lg:col-span-1 space-y-4">
                    <h3 className="font-bold text-lg text-indigo-900">AI Recommendations</h3>
                    {report.aiAnalysis.map((analysis, idx) => {
                         // Find matching vendor name from proposals
                        const vendorName = report.proposals.find(p => p._id === analysis.vendor_id)?.vendorId?.name || "Unknown";
                        
                        return (
                            <div key={idx} className="bg-gradient-to-br from-white to-indigo-50 p-4 rounded-lg border border-indigo-100 shadow-sm relative overflow-hidden">
                                <div className="absolute top-0 right-0 bg-indigo-600 text-white text-xs font-bold px-2 py-1 rounded-bl">
                                    Score: {analysis.score}
                                </div>
                                <h4 className="font-bold text-lg mb-1">{vendorName}</h4>
                                <p className="text-sm text-gray-600 italic">"{analysis.reason}"</p>
                            </div>
                        )
                    })}
                </div>

                {/* Proposals Table Column */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-lg shadow border overflow-hidden">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-50 border-b">
                                <tr>
                                    <th className="p-4">Vendor</th>
                                    <th className="p-4">Price</th>
                                    <th className="p-4">Timeline</th>
                                    <th className="p-4">Warranty</th>
                                    <th className="p-4">AI Summary</th>
                                </tr>
                            </thead>
                            <tbody>
                                {report.proposals.map((p: any) => (
                                    <tr key={p._id} className="border-b last:border-0 hover:bg-gray-50">
                                        <td className="p-4 font-medium">{p.vendorId.name}</td>
                                        <td className="p-4 text-green-700 font-bold">${p.extractedPrice?.toLocaleString()}</td>
                                        <td className="p-4">{p.extractedTimeline}</td>
                                        <td className="p-4">{p.extractedWarranty}</td>
                                        <td className="p-4 text-gray-500 text-xs">{p.aiSummary}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};