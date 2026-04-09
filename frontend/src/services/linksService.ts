import { api } from "../lib/api";
import { LinkItem } from "../types";

export const linksService = {
  async list() {
    const res = await api.get<LinkItem[]>("/links");
    return res.data;
  },
  async create(payload: { title: string; url: string }) {
    const res = await api.post<LinkItem>("/links", payload);
    return res.data;
  },
  async update(id: string, payload: { title?: string; url?: string }) {
    const res = await api.put<LinkItem>(`/links/${id}`, payload);
    return res.data;
  },
  async remove(id: string) {
    await api.delete(`/links/${id}`);
  },
  async reorder(ids: string[]) {
    const res = await api.put<LinkItem[]>("/links/reorder/all", { ids });
    return res.data;
  }
};
