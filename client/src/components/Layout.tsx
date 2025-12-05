import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FileText, Users, PlusCircle } from 'lucide-react';

export const Layout = ({ children }: { children: React.ReactNode }) => {
    const location = useLocation();
    
    const navClass = (path: string) => 
        `flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
            location.pathname === path ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
        }`;

    return (
        <div className="min-h-screen bg-gray-50 flex">
            <aside className="w-64 bg-white border-r border-gray-200 p-6">
                <h1 className="text-xl font-bold text-blue-800 mb-8">ProcureAI</h1>
                <nav className="space-y-2">
                    <Link to="/" className={navClass('/')}>
                        <FileText size={20} /> <span>Dashboard</span>
                    </Link>
                    <Link to="/create" className={navClass('/create')}>
                        <PlusCircle size={20} /> <span>New RFP</span>
                    </Link>
                    <Link to="/vendors" className={navClass('/vendors')}>
                        <Users size={20} /> <span>Vendors</span>
                    </Link>
                </nav>
            </aside>
            <main className="flex-1 p-8 overflow-y-auto">
                {children}
            </main>
        </div>
    );
};