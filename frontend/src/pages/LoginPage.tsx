import { FormEvent, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { useLoginMutation } from "../hooks/useAuthMutations";
import { useAuth } from "../state/auth";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { setSession } = useAuth();
  const loginMutation = useLoginMutation();

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email || !password) return toast.error("All fields are required");
    try {
      const res = await loginMutation.mutateAsync({ email, password });
      await setSession(res.token);
      toast.success("Welcome back");
      navigate("/dashboard");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Invalid credentials");
      } else {
        toast.error("Invalid credentials");
      }
    }
  }

  return (
    <div className="auth-shell min-h-screen">
      <div className="grid min-h-screen md:grid-cols-2">
        <aside className="flex flex-col justify-center bg-gradient-to-br from-slate-900 to-slate-800 p-8 text-slate-100 md:p-14">
          <p className="text-sm font-semibold text-blue-300">Welcome back to LinkHub</p>
          <h1 className="mt-2 text-3xl font-black">Sign in and keep growing your audience</h1>
          <p className="mt-4 text-sm text-slate-300">
            Manage links, customize your theme, and track clicks from one simple dashboard.
          </p>
          <div className="mt-6 space-y-3 text-sm">
            <div className="rounded-xl bg-white/10 p-3">Drag-and-drop link organization</div>
            <div className="rounded-xl bg-white/10 p-3">Multi-tenant secure architecture</div>
            <div className="rounded-xl bg-white/10 p-3">Click analytics with trend chart</div>
          </div>
        </aside>

        <form onSubmit={onSubmit} className="flex flex-col justify-center space-y-4 bg-white/75 p-8 backdrop-blur md:p-14">
          <div className="max-w-md">
            <Link
              to="/"
              className="mb-3 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
            >
              <span>←</span>
              <span>Back</span>
            </Link>
            <h2 className="text-3xl font-black text-slate-900">Login</h2>
            <p className="mt-1 text-sm text-slate-500">Use your account credentials to continue.</p>
          </div>
          <input
            className="max-w-md rounded-xl border border-slate-200 bg-white p-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="max-w-md rounded-xl border border-slate-200 bg-white p-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="max-w-md rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 p-3 font-semibold text-white shadow-lg shadow-blue-200 transition hover:scale-[1.01]">
            {loginMutation.isPending ? "Signing in..." : "Login"}
          </button>
          <p className="max-w-md text-sm text-slate-600">
            New here?{" "}
            <Link className="font-medium text-blue-600 hover:underline" to="/signup">
              Create account
            </Link>
          </p>
          <p className="max-w-md text-xs text-slate-400">
            By continuing, you agree to use LinkHub responsibly and keep account credentials secure.
          </p>
        </form>
      </div>
    </div>
  );
}
