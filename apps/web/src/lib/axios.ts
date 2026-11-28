import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL as string,
  withCredentials: true, // sends httpOnly refresh_token cookie automatically
});

// Attach access token from in-memory store on every request
api.interceptors.request.use((config) => {
  const token = getInMemoryAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Silent refresh on 401 — queue concurrent requests, retry with new token
let isRefreshing = false;
let queue: Array<(token: string) => void> = [];

api.interceptors.response.use(
  (response) => response,
  async (error: unknown) => {
    if (!axios.isAxiosError(error)) return Promise.reject(error);

    const originalRequest = error.config;

    if (error.response?.status !== 401 || !originalRequest) {
      return Promise.reject(error);
    }

    // Prevent infinite loop if refresh itself 401s
    if (originalRequest.url?.includes('/auth/refresh')) {
      window.dispatchEvent(new Event('auth:logout'));
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise<string>((resolve) => {
        queue.push(resolve);
      }).then((token) => {
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return api(originalRequest);
      });
    }

    isRefreshing = true;

    try {
      // POST /auth/refresh — browser sends httpOnly cookie automatically
      const { data } = await api.post<{ accessToken: string }>('/auth/refresh');
      setInMemoryAccessToken(data.accessToken);

      queue.forEach((cb) => {
        cb(data.accessToken);
      });
      queue = [];

      originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
      return api(originalRequest);
    } catch {
      queue = [];
      window.dispatchEvent(new Event('auth:logout'));
      return Promise.reject(error);
    } finally {
      isRefreshing = false;
    }
  },
);

// In-memory access token — never persisted to storage
let _accessToken: string | null = null;

export function getInMemoryAccessToken(): string | null {
  return _accessToken;
}

export function setInMemoryAccessToken(token: string | null): void {
  _accessToken = token;
}
