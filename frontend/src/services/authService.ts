import { api } from "../lib/api";

export type AuthUser = {
  id: string;
  email: string;
  username: string;
  tenant_id: string;
};

export type LoginInput = { email: string; password: string };
export type SignupInput = { name: string; username: string; email: string; password: string };

export const authService = {
  async login(payload: LoginInput) {
    const res = await api.post<{ token: string; user: AuthUser }>("/auth/login", payload);
    return res.data;
  },
  async signup(payload: SignupInput) {
    const res = await api.post<{ token: string; user: AuthUser }>("/auth/signup", payload);
    return res.data;
  },
  async me() {
    const res = await api.get<{ user: AuthUser | null }>("/auth/me");
    return res.data.user;
  }
};
