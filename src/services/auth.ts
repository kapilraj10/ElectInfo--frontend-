import axios from 'axios';

const API_URL = 'https://elect-info-backend-git-main-kapils-projects-1d91d99d.vercel.app/api/v1/auth';

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  userName: string;
  email: string;
  password: string;
  role?: string;
}

export interface AuthResponse {
  _id: string;
  userName: string;
  email: string;
  role: string;
  token: string;
  message: string;
}

export const login = async (data: LoginData): Promise<AuthResponse> => {
  const response = await axios.post(`${API_URL}/login`, data);
  return response.data;
};

export const register = async (data: RegisterData): Promise<AuthResponse> => {
  const response = await axios.post(`${API_URL}/register`, data);
  return response.data;
};
