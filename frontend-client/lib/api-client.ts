import axios, {
    AxiosError,
    AxiosInstance,
    AxiosRequestConfig,
    InternalAxiosRequestConfig,
} from 'axios';
import { useAuthStore } from '@/stores/use-auth-store';
import { API_BASE_URL } from '@/lib/config';

function getValidBaseURL(): string {
    if (!API_BASE_URL || API_BASE_URL === 'undefined') {
        const fallback = 'http://localhost:8080';
        if (typeof window !== 'undefined') {
            console.error(
                `[API Client] API_BASE_URL не определён! Используется fallback: ${fallback}`,
            );
        }
        return `${fallback}/api/v1`;
    }

    const normalizedURL = API_BASE_URL.replace(/\/+$/, '');

    return `${normalizedURL}/api/v1`;
}

const axiosOptions: AxiosRequestConfig = {
    baseURL: getValidBaseURL(),
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
    timeout: 30000,
};

export const api: AxiosInstance = axios.create(axiosOptions);

interface FailedRequest {
    resolve: (token: string) => void;
    reject: (error: unknown) => void;
}

let isRefreshing = false;
let failedQueue: FailedRequest[] = [];

const processQueue = (error: unknown, token: string | null = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token!);
        }
    });
    failedQueue = [];
};

api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const accessToken = useAuthStore.getState().accessToken;

        if (accessToken && config.headers) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }

        if (process.env.NODE_ENV === 'development') {
            console.log(
                `[API] ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`,
            );
        }

        return config;
    },
    (error) => Promise.reject(error),
);

api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & {
            _retry?: boolean;
        };

        const status = error.response?.status;

        if (process.env.NODE_ENV === 'development') {
            console.error(`[API Error] ${status}: ${error.message}`, {
                url: originalRequest?.url,
                baseURL: originalRequest?.baseURL,
            });
        }

        if (status === 401 && !originalRequest._retry) {
            if (originalRequest.url?.includes('/auth/refresh')) {
                useAuthStore.getState().logout();
                if (typeof window !== 'undefined') {
                    window.location.href = '/login';
                }
                return Promise.reject(error);
            }

            if (isRefreshing) {
                return new Promise<string>((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then((token) => {
                        if (originalRequest.headers) {
                            originalRequest.headers.Authorization = `Bearer ${token}`;
                        }
                        return api(originalRequest);
                    })
                    .catch((err) => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const { data } = await api.post<{ access_token: string }>(
                    '/auth/refresh',
                );
                const newAccessToken = data.access_token;

                useAuthStore.getState().setAccessToken(newAccessToken);
                processQueue(null, newAccessToken);

                if (originalRequest.headers) {
                    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                }
                return api(originalRequest);
            } catch (refreshError) {
                processQueue(refreshError, null);
                useAuthStore.getState().logout();
                if (typeof window !== 'undefined') {
                    window.location.href = '/login';
                }
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    },
);

export const apiClient = {
    get: <T>(url: string, config?: AxiosRequestConfig) =>
        api.get<T>(url, config).then((res) => res.data),

    post: <T>(url: string, body?: unknown, config?: AxiosRequestConfig) =>
        api.post<T>(url, body, config).then((res) => res.data),

    put: <T>(url: string, body?: unknown, config?: AxiosRequestConfig) =>
        api.put<T>(url, body, config).then((res) => res.data),

    delete: <T>(url: string, config?: AxiosRequestConfig) =>
        api.delete<T>(url, config).then((res) => res.data),

    patch: <T>(url: string, body?: unknown, config?: AxiosRequestConfig) =>
        api.patch<T>(url, body, config).then((res) => res.data),
};
