import { z } from "zod";

export const ProfileParamsSchema = z.object({
  username: z.string().min(3)
});
export type ProfileParams = z.infer<typeof ProfileParamsSchema>;
