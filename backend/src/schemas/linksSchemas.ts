import { z } from "zod";

export const LinkInputSchema = z.object({
  title: z.string().min(1),
  url: z.string().url()
});

export const ReorderInputSchema = z.object({
  ids: z.array(z.string().uuid())
});

export const LinkIdParamsSchema = z.object({
  id: z.string().uuid()
});

export type LinkInput = z.infer<typeof LinkInputSchema>;
export type ReorderInput = z.infer<typeof ReorderInputSchema>;
export type LinkIdParams = z.infer<typeof LinkIdParamsSchema>;
