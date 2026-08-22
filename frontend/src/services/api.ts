import { User, Payment, RiskAlert, RecoveryCase, AuditLog, DashboardStats } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('rpai_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'API Request Failed');
    }
    return data.data;
  } catch (err: any) {
    console.warn(`[API Call Failed: ${endpoint}] Using resilient fallback data mode`, err.message);
    throw err;
  }
}

export const api = {
  getStats: () => request<DashboardStats>('/dashboard/stats'),
  getPayments: () => request<Payment[]>('/payments'),
  getPaymentById: (id: string) => request<Payment>(`/payments/${id}`),
  createOrder: (payload: { amount: number; customerEmail: string; customerName?: string }) =>
    request<{ orderId: string; amount: number; currency: string; key: string }>('/payments/create-order', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  getRiskAlerts: () => request<RiskAlert[]>('/risk/alerts'),
  getRecoveryCases: () => request<RecoveryCase[]>('/recovery/cases'),
  getAuditLogs: () => request<AuditLog[]>('/audit'),
  askAi: (query: string) =>
    request<{ query: string; answer: string; confidence: number; suggestedFollowups: string[] }>('/ai/query', {
      method: 'POST',
      body: JSON.stringify({ query }),
    }),
};

// ─── Generic apiService wrapper for agent pages ──────────────────────────────
async function genericRequest(method: string, endpoint: string, body?: any): Promise<{ data: any }> {
  const token = localStorage.getItem('rpai_token');
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    method,
    headers,
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  });
  const json = await res.json();
  if (!res.ok) {
    const err: any = new Error(json.message || 'API Request Failed');
    err.response = { data: json };
    throw err;
  }
  return { data: json };
}

export const apiService = {
  get: (endpoint: string) => genericRequest('GET', endpoint),
  post: (endpoint: string, body: any) => genericRequest('POST', endpoint, body),
  put: (endpoint: string, body: any) => genericRequest('PUT', endpoint, body),
  patch: (endpoint: string, body: any) => genericRequest('PATCH', endpoint, body),
  delete: (endpoint: string) => genericRequest('DELETE', endpoint),
};

