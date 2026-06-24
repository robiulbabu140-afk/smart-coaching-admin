import { create } from 'zustand';
import { api } from '../api/client';

interface User { id: string; fullName: string; role: string; phone: string; }
interface AuthStore {
  user: User | null;
  loading: boolean;
  login: (phone: string, password: string) => Promise<void>;
  logout: () => void;
  fetchMe: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  loading: false,

  login: async (phone, password) => {
    set({ loading: true });
    try {
      const { data } = await api.post('/auth/login', { phone, password });
      if (data.data.user.role !== 'admin') throw new Error('শুধুমাত্র Admin লগইন করতে পারবেন।');
      localStorage.setItem('access_token', data.data.tokens.accessToken);
      localStorage.setItem('refresh_token', data.data.tokens.refreshToken);
      set({ user: data.data.user });
    } finally {
      set({ loading: false });
    }
  },

  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    set({ user: null });
    window.location.href = '/login';
  },

  fetchMe: async () => {
    const token = localStorage.getItem('access_token');
    if (!token) return;
    try {
      const { data } = await api.get('/auth/me');
      set({ user: data.data });
    } catch {
      localStorage.removeItem('access_token');
    }
  },
}));
