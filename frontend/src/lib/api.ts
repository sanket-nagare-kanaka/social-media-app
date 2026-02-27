const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

interface ApiOptions {
    method?: string;
    body?: unknown;
    headers?: Record<string, string>;
    token?: string;
}

class ApiClient {
    private baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    private async request<T>(endpoint: string, options: ApiOptions = {}): Promise<T> {
        const { method = 'GET', body, headers = {}, token } = options;

        const config: RequestInit = {
            method,
            headers: {
                'Content-Type': 'application/json',
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
                ...headers,
            },
        };

        if (body) {
            config.body = JSON.stringify(body);
        }

        const response = await fetch(`${this.baseUrl}${endpoint}`, config);

        if (!response.ok) {
            const error = await response.json().catch(() => ({ detail: 'Unknown error' }));
            throw new Error(error.detail || `API Error: ${response.status}`);
        }

        return response.json();
    }

    // Convenience methods
    get<T>(endpoint: string, token?: string) {
        return this.request<T>(endpoint, { token });
    }

    post<T>(endpoint: string, body?: unknown, token?: string) {
        return this.request<T>(endpoint, { method: 'POST', body, token });
    }

    put<T>(endpoint: string, body?: unknown, token?: string) {
        return this.request<T>(endpoint, { method: 'PUT', body, token });
    }

    delete<T>(endpoint: string, token?: string) {
        return this.request<T>(endpoint, { method: 'DELETE', token });
    }
}

export const api = new ApiClient(API_BASE_URL);
