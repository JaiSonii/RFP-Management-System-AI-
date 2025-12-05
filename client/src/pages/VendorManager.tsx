import React, { useEffect, useState } from 'react';
import { vendorApi } from '../api';
import type { IVendor } from '../types';
import { User, Mail, Plus, Briefcase } from 'lucide-react';

export const VendorManager = () => {
    const [vendors, setVendors] = useState<IVendor[]>([]);
    const [loading, setLoading] = useState(false);
    
    // Form State
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        contactPerson: ''
    });

    useEffect(() => {
        loadVendors();
    }, []);

    const loadVendors = async () => {
        try {
            const { data } = await vendorApi.getAll();
            setVendors(data);
        } catch (err) {
            console.error("Failed to load vendors", err);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.email) return;

        setLoading(true);
        try {
            await vendorApi.create(formData);
            setFormData({ name: '', email: '', contactPerson: '' }); // Reset form
            await loadVendors(); // Refresh list
        } catch (err) {
            alert("Failed to create vendor. Ensure email is unique.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Vendor Management</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* 1. Add Vendor Form */}
                <div className="md:col-span-1">
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 sticky top-4">
                        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                            <Plus size={20} className="text-blue-600" />
                            Add New Vendor
                        </h3>
                        
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                                <div className="relative">
                                    <Briefcase size={16} className="absolute left-3 top-3 text-gray-400" />
                                    <input 
                                        type="text"
                                        required
                                        className="w-full pl-10 pr-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                                        placeholder="Acme Corp"
                                        value={formData.name}
                                        onChange={e => setFormData({...formData, name: e.target.value})}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                <div className="relative">
                                    <Mail size={16} className="absolute left-3 top-3 text-gray-400" />
                                    <input 
                                        type="email"
                                        required
                                        className="w-full pl-10 pr-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                                        placeholder="sales@acme.com"
                                        value={formData.email}
                                        onChange={e => setFormData({...formData, email: e.target.value})}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Contact Person</label>
                                <div className="relative">
                                    <User size={16} className="absolute left-3 top-3 text-gray-400" />
                                    <input 
                                        type="text"
                                        className="w-full pl-10 pr-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                                        placeholder="John Doe"
                                        value={formData.contactPerson}
                                        onChange={e => setFormData({...formData, contactPerson: e.target.value})}
                                    />
                                </div>
                            </div>

                            <button 
                                type="submit" 
                                disabled={loading}
                                className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 font-medium"
                            >
                                {loading ? 'Adding...' : 'Add Vendor'}
                            </button>
                        </form>
                    </div>
                </div>

                {/* 2. Vendor List */}
                <div className="md:col-span-2">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                            <h3 className="font-bold text-gray-700">Registered Vendors</h3>
                            <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded text-xs font-bold">{vendors.length} Total</span>
                        </div>
                        
                        {vendors.length === 0 ? (
                            <div className="p-8 text-center text-gray-500">
                                No vendors found. Add one to get started.
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-100">
                                {vendors.map((vendor) => (
                                    <div key={vendor._id} className="p-4 hover:bg-gray-50 transition-colors flex items-center justify-between group">
                                        <div>
                                            <h4 className="font-bold text-gray-900">{vendor.name}</h4>
                                            <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                                                <span className="flex items-center gap-1">
                                                    <Mail size={14} /> {vendor.email}
                                                </span>
                                                {vendor.contactPerson && (
                                                    <span className="flex items-center gap-1">
                                                        <User size={14} /> {vendor.contactPerson}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                            {/* Placeholder for future actions like Edit/Delete */}
                                            <button className="text-gray-400 hover:text-blue-600">
                                                Edit
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};