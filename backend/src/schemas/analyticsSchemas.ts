import { z } from "zod";

export const AnalyticsQuerySchema = z.object({
  linkId: z.string().uuid().optional()
});
export type AnalyticsQuery = z.infer<typeof AnalyticsQuerySchema>;
