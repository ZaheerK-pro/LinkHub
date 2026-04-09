import { useMutation } from "@tanstack/react-query";
import { authService, LoginInput, SignupInput } from "../services/authService";

export function useLoginMutation() {
  return useMutation({
    mutationFn: (payload: LoginInput) => authService.login(payload)
  });
}

export function useSignupMutation() {
  return useMutation({
    mutationFn: (payload: SignupInput) => authService.signup(payload)
  });
}
