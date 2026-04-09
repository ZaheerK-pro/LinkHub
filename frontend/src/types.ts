export type LinkItem = {
  id: string;
  tenant_id: string;
  title: string;
  url: string;
  order_index: number;
};

export type ThemeConfig = Record<string, string>;

export type AnalyticsResponse = {
  totalClicks: number;
  topLinks: Array<{ id: string; clicks: string }>;
  chart: Array<{ day: string; clicks: string }>;
};
