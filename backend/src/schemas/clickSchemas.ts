import { z } from "zod";

export const ClickParamsSchema = z.object({
  linkId: z.string().uuid()
});
export type ClickParams = z.infer<typeof ClickParamsSchema>;
