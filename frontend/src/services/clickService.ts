import { api } from "../lib/api";

export const clickService = {
  async track(linkId: string) {
    const res = await api.post<{ success: boolean }>(`/click/${linkId}`);
    return res.data;
  }
};
