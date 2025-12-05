import React, { useState } from 'react';
import { rfpApi } from '../api';
import type { IRFP } from '../types';
import { useNavigate } from 'react-router-dom';

export const CreateRFP = () => {
    const [prompt, setPrompt] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<IRFP | null>(null);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await rfpApi.create(prompt);
            setResult(data);
        } catch (err) {
            console.error(err);
            alert("Failed to create RFP");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Create New RFP with AI</h2>
            
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm border mb-8">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Describe your procurement needs
                </label>
                <textarea 
                    className="w-full p-4 border rounded-lg h-40 focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="E.g., I need 20 Macbook Pros and 15 Dell Monitors for the new office. Budget is $50k..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                />
                <button 
                    disabled={loading || !prompt}
                    className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center"
                >
                    {loading ? 'Processing...' : 'Generate Structured RFP'}
                </button>
            </form>

            {result && (
                <div className="bg-white p-6 rounded-lg shadow-sm border animate-fade-in">
                    <div className="flex justify-between items-start mb-4">
                        <h3 className="text-xl font-bold text-gray-900">{result.title}</h3>
                        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                            {result.status}
                        </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div>
                            <span className="text-gray-500 text-sm">Budget</span>
                            <p className="font-medium">${result.budget?.toLocaleString()}</p>
                        </div>
                        <div>
                            <span className="text-gray-500 text-sm">Deadline</span>
                            <p className="font-medium">{new Date(result.deadline).toLocaleDateString()}</p>
                        </div>
                    </div>

                    <h4 className="font-medium mb-2">Line Items Extracted:</h4>
                    <table className="w-full text-sm text-left text-gray-500">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-2">Item</th>
                                <th className="px-4 py-2">Qty</th>
                                <th className="px-4 py-2">Specs</th>
                            </tr>
                        </thead>
                        <tbody>
                            {result.items.map((item, idx) => (
                                <tr key={idx} className="border-b">
                                    <td className="px-4 py-2 font-medium text-gray-900">{item.item_name}</td>
                                    <td className="px-4 py-2">{item.quantity}</td>
                                    <td className="px-4 py-2">{item.specs}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="mt-6 flex justify-end">
                        <button 
                            onClick={() => navigate('/')}
                            className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                            Save & Return to Dashboard &rarr;
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};