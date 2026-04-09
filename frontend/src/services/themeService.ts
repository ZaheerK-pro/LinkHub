import { api } from "../lib/api";
import { ThemeConfig } from "../types";

export const themeService = {
  async get() {
    const res = await api.get<ThemeConfig>("/theme");
    return res.data;
  },
  async update(payload: ThemeConfig) {
    const res = await api.put<ThemeConfig>("/theme", payload);
    return res.data;
  }
};
