import type { User, LoginDto, RegisterDto } from '@forge/types';
import { api } from '../lib/axios.js';

export async function register(payload: RegisterDto): Promise<{ accessToken: string }> {
  const { data } = await api.post<{ accessToken: string }>('/auth/register', payload);
  return data;
}

export async function login(payload: LoginDto): Promise<{ accessToken: string }> {
  const { data } = await api.post<{ accessToken: string }>('/auth/login', payload);
  return data;
}

export async function refresh(): Promise<{ accessToken: string }> {
  const { data } = await api.post<{ accessToken: string }>('/auth/refresh');
  return data;
}

export async function logout(): Promise<void> {
  await api.post('/auth/logout');
}

export async function getMe(): Promise<User> {
  const { data } = await api.get<User>('/auth/me');
  return data;
}
