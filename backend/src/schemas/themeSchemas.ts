import { z } from "zod";

export const ThemeInputSchema = z.record(z.string(), z.string());
export type ThemeInput = z.infer<typeof ThemeInputSchema>;
