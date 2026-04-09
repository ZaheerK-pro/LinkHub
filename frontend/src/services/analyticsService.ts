import { api } from "../lib/api";
import { AnalyticsResponse } from "../types";

export const analyticsService = {
  async get(linkId?: string) {
    const res = await api.get<AnalyticsResponse>("/analytics", {
      params: linkId && linkId !== "all" ? { linkId } : undefined
    });
    return res.data;
  }
};
