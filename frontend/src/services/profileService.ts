import { api } from "../lib/api";
import { LinkItem, ThemeConfig } from "../types";

export type ProfileResponse = {
  username: string;
  tenant: { theme: ThemeConfig; name: string };
  links: LinkItem[];
};

export const profileService = {
  async get(username: string) {
    const res = await api.get<ProfileResponse>(`/profile/${username}`);
    return res.data;
  }
};
