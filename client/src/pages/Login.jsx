import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { ThemeToggle } from "../components/ui";
import StepsBackground3D from "../components/StepsBackground3D";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { theme } = useTheme();
  const dark = theme === "dark";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const data = await loginUser({ email, password });
      login(data);
      navigate("/");
    } catch (err) {
      const message = err.response?.data?.message || "Login failed. Please try again.";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  }

  const cardBase = dark
    ? "bg-slate-950/70 border-white/10 shadow-[0_30px_80px_-20px_rgba(34,211,238,0.25)]"
    : "bg-white/95 border-slate-100 shadow-[0_10px_30px_-10px_rgba(76,29,149,0.12)]";
  const inputBase = dark
    ? "border-white/10 bg-white/5 text-slate-100 placeholder:text-slate-500 focus:border-cyan-400"
    : "border-slate-200 bg-white text-slate-800 placeholder:text-slate-400 focus:border-indigo-400";
  const labelBase = dark ? "text-slate-400" : "text-slate-400";
  const mutedText = dark ? "text-slate-400" : "text-slate-500";

  return (
    <div className={`relative min-h-screen w-full overflow-hidden ${dark ? "bg-[#050915]" : "bg-[#F4F3FA]"}`}>
      {/* animated 3D staircase background - fixed layout, gentle float + hover glow */}
      <StepsBackground3D dark={dark} className="absolute inset-0" />

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: dark
            ? "radial-gradient(circle at 30% 30%, rgba(99,102,241,0.12), transparent 55%)"
            : "radial-gradient(circle at 30% 20%, rgba(139,92,246,0.10), transparent 55%)",
        }}
      />

      <div className="absolute top-6 right-6 z-20">
        <ThemeToggle />
      </div>

      <div className="relative z-10 min-h-screen w-full flex items-center justify-center lg:justify-end p-4 lg:pr-20">
        <div className={`w-full max-w-sm rounded-[28px] border backdrop-blur-xl p-8 ${cardBase}`}>
          <h1 className={`text-xl font-bold ${dark ? "text-white" : "text-slate-800"}`}>Welcome back</h1>
          <p className={`text-[13px] mt-1 mb-6 ${mutedText}`}>Log in to your GetYourJob account</p>

          {error && (
            <div className="mb-4 text-[13px] text-rose-500 bg-rose-500/10 border border-rose-500/20 rounded-xl px-3.5 py-2.5">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className={`text-[10.5px] font-semibold tracking-wide ${labelBase}`}>EMAIL</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`mt-1.5 w-full border rounded-xl px-3.5 py-2.5 text-[13.5px] outline-none ${inputBase}`}
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className={`text-[10.5px] font-semibold tracking-wide ${labelBase}`}>PASSWORD</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`mt-1.5 w-full border rounded-xl px-3.5 py-2.5 text-[13.5px] outline-none ${inputBase}`}
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2.5 rounded-2xl bg-indigo-600 text-white text-[13px] font-semibold shadow-[0_10px_20px_-8px_rgba(79,70,229,0.5)] disabled:opacity-60"
            >
              {submitting ? "Logging in..." : "Log in"}
            </button>
          </form>

          <p className={`text-[12.5px] mt-6 text-center ${mutedText}`}>
            Don't have an account?{" "}
            <Link to="/signup" className="text-indigo-500 font-semibold">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}