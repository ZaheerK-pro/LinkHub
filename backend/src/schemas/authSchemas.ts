import { z } from "zod";

export const SignupInputSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  username: z.string().min(3).max(30).regex(/^[a-z0-9_]+$/),
  name: z.string().min(2)
});

export const LoginInputSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

export type SignupInput = z.infer<typeof SignupInputSchema>;
export type LoginInput = z.infer<typeof LoginInputSchema>;
