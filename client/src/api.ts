import axios from 'axios';
import type {IRFP, IComparisonReport, IVendor} from './types'

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
});

export const rfpApi = {
    getAll: () => api.get<IRFP[]>('/rfps'),
    create: (prompt: string) => api.post<IRFP>('/rfp', { prompt }),
    send: (rfpId: string, vendorIds: string[]) => api.post('/rfp/send', { rfpId, vendorIds }),
    compare: (rfpId: string) => api.get<IComparisonReport>(`/rfp/${rfpId}/compare`),
};

export const vendorApi = {
    getAll: () => api.get<IVendor[]>('/vendors'),
    create: (data: Omit<IVendor, '_id'>) => api.post<IVendor>('/vendor', data),
};