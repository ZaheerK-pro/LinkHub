import { FormEvent, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { useSignupMutation } from "../hooks/useAuthMutations";

export function SignupPage() {
  const [form, setForm] = useState({ name: "", username: "", email: "", password: "" });
  const navigate = useNavigate();
  const signupMutation = useSignupMutation();

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (Object.values(form).some((v) => !v)) return toast.error("All fields are required");
    if (!/^[a-z0-9_]+$/.test(form.username)) {
      return toast.error("Username can only contain lowercase letters, numbers, and underscore");
    }
    if (form.password.length < 6) return toast.error("Password must be at least 6 characters");
    try {
      await signupMutation.mutateAsync(form);
      toast.success("Account created. Please login.");
      navigate("/login");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Signup failed");
      } else {
        toast.error("Signup failed");
      }
    }
  }

  return (
    <div className="auth-shell min-h-screen">
      <div className="grid min-h-screen md:grid-cols-2">
        <aside className="flex flex-col justify-center bg-gradient-to-br from-blue-600 to-indigo-600 p-8 text-white md:p-14">
          <p className="text-sm font-semibold text-blue-100">Create your LinkHub account</p>
          <h1 className="mt-2 text-3xl font-black">Your online identity starts here</h1>
          <p className="mt-4 text-sm text-blue-100">
            Set up your account, share all links in one place, and customize your page for your audience.
          </p>
          <div className="mt-6 space-y-3 text-sm">
            <div className="rounded-xl bg-white/15 p-3">Secure account with unique username</div>
            <div className="rounded-xl bg-white/15 p-3">Theme presets and visual personalization</div>
            <div className="rounded-xl bg-white/15 p-3">Built-in analytics for link performance</div>
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
            <h2 className="text-3xl font-black text-slate-900">Sign up</h2>
            <p className="mt-1 text-sm text-slate-500">Create your account to launch your LinkHub workspace.</p>
          </div>
          <input
            className="max-w-md rounded-xl border border-slate-200 bg-white p-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            placeholder="Display name"
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <input
            className="max-w-md rounded-xl border border-slate-200 bg-white p-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            placeholder="Username (lowercase)"
            onChange={(e) => setForm({ ...form, username: e.target.value.toLowerCase() })}
          />
          <input
            className="max-w-md rounded-xl border border-slate-200 bg-white p-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            placeholder="Email address"
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <input
            className="max-w-md rounded-xl border border-slate-200 bg-white p-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            type="password"
            placeholder="Password (min 6)"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <button className="max-w-md rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 p-3 font-semibold text-white shadow-lg shadow-blue-200 transition hover:scale-[1.01]">
            {signupMutation.isPending ? "Creating..." : "Create account"}
          </button>
          <p className="max-w-md text-sm text-slate-600">
            Already have an account?{" "}
            <Link className="font-medium text-blue-600 hover:underline" to="/login">
              Login
            </Link>
          </p>
          <p className="max-w-md text-xs text-slate-400">You can update theme and links from your dashboard anytime.</p>
        </form>
      </div>
    </div>
  );
}
