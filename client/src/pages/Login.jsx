import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { ThemeToggle } from "../components/ui";
import StepsBackground3D from "../components/StepsBackground3D";
import logoLight from "../assets/logo-light.png";
import logoDark from "../assets/logo.dark.png";

// --- Small inline icons (no external icon lib required) ---
function MailIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <rect x="3" y="5" width="18" height="14" rx="2.5" />
      <path d="M3.5 6.5 12 13l8.5-6.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function LockIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <rect x="4.5" y="10.5" width="15" height="9.5" rx="2.2" />
      <path d="M7.5 10.5V7.8a4.5 4.5 0 0 1 9 0v2.7" strokeLinecap="round" />
    </svg>
  );
}

function EyeIcon({ open, ...props }) {
  return open ? (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="12" r="2.7" />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path d="M3 3l18 18" strokeLinecap="round" />
      <path d="M10.6 5.7A9.6 9.6 0 0 1 12 5.5c6 0 9.5 6.5 9.5 6.5a15.6 15.6 0 0 1-3.3 4.2M6.8 6.8C4.2 8.5 2.5 12 2.5 12S6 18.5 12 18.5a9.7 9.7 0 0 0 4.1-.9" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9.9 9.9a2.7 2.7 0 0 0 3.9 3.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ArrowRightIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function GoogleIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" {...props}>
      <path fill="#4285F4" d="M23.5 12.27c0-.79-.07-1.54-.2-2.27H12v4.51h6.47a5.6 5.6 0 0 1-2.42 3.67v3h3.9c2.28-2.1 3.55-5.2 3.55-8.91z" />
      <path fill="#34A853" d="M12 24c3.24 0 5.96-1.07 7.95-2.9l-3.9-3.03c-1.08.73-2.46 1.16-4.05 1.16-3.11 0-5.75-2.1-6.69-4.92H1.28v3.09A12 12 0 0 0 12 24z" />
      <path fill="#FBBC05" d="M5.31 14.31A7.2 7.2 0 0 1 4.93 12c0-.8.14-1.58.38-2.31V6.6H1.28A12 12 0 0 0 0 12c0 1.94.46 3.77 1.28 5.4z" />
      <path fill="#EA4335" d="M12 4.77c1.77 0 3.35.61 4.6 1.8l3.45-3.45C17.95 1.19 15.24 0 12 0A12 12 0 0 0 1.28 6.6l4.03 3.09C6.25 6.87 8.89 4.77 12 4.77z" />
    </svg>
  );
}

// Brand mark: rounded badge with ascending steps + flag, matching the
// light/dark app-icon reference (white badge in light mode, navy in dark).
// function BrandMark({ dark, className = "" }) {
//   return (
//     <div
//       className={`rounded-xl flex items-center justify-center flex-shrink-0 ${
//         dark ? "bg-[#0b1220]" : "bg-white"
//       } ${className}`}
//       style={{
//         boxShadow: dark
//           ? "0 4px 14px -4px rgba(0,0,0,0.55)"
//           : "0 4px 14px -6px rgba(76,29,149,0.22)",
//       }}
//     >
//       <svg viewBox="0 0 64 64" className="w-[72%] h-[72%]">
//         <rect x="4" y="42" width="22" height="10" rx="1.8" fill="#3B2172" />
//         <rect x="15" y="31" width="22" height="10" rx="1.8" fill="#7C3AED" />
//         <rect x="26" y="20" width="19" height="9" rx="1.8" fill="#818CF8" />
//         <rect x="36" y="10" width="19" height="9" rx="1.8" fill="#2DD4BF" />
//         <path d="M8 40 L34 14" stroke="#22B8C4" strokeWidth="2.1" strokeLinecap="round" fill="none" />
//         <path d="M27 19 L34 14 L38 9.5" stroke="#22B8C4" strokeWidth="2.1" strokeLinecap="round" fill="none" />
//         <line x1="47" y1="2" x2="47" y2="15" stroke="#22D3EE" strokeWidth="2.3" strokeLinecap="round" />
//         <path d="M47 2 L58 6.8 L47 11.5 Z" fill="#22D3EE" />
//       </svg>
//     </div>
//   );
// }
function BrandMark({ dark, className = "" }) {
  return (
    <img
      src={dark ? logoDark : logoLight}
      alt="Close Your Gaps"
      className={`${className} object-contain flex-shrink-0`}
    />
  );
}

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { theme } = useTheme();
  const dark = theme === "dark";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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

  function handleGoogleLogin() {
    // TODO: wire up real Google OAuth (e.g. redirect to your backend's
    // /auth/google endpoint, or use a library like @react-oauth/google).
    console.warn("Google login not yet implemented.");
  }

  const cardBase = dark
    ? "bg-slate-950/70 border-white/10 shadow-[0_30px_80px_-20px_rgba(34,211,238,0.25)]"
    : "bg-white/95 border-slate-100 shadow-[0_20px_60px_-15px_rgba(76,29,149,0.15)]";
  const inputBase = dark
    ? "border-white/10 bg-white/5 text-slate-100 placeholder:text-slate-500 focus:border-cyan-400"
    : "border-slate-200 bg-white text-slate-800 placeholder:text-slate-400 focus:border-indigo-400";
  const labelBase = dark ? "text-slate-200" : "text-slate-800";
  const mutedText = dark ? "text-slate-400" : "text-slate-500";
  const headingText = dark ? "text-white" : "text-slate-900";
  const dividerLine = dark ? "border-white/10" : "border-slate-200";
  const iconMuted = dark ? "text-slate-500" : "text-slate-400";
  const linkColor = dark ? "text-cyan-400" : "text-indigo-500";

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
          {/* Logo / brand header */}
          {/* <div className="flex items-center gap-2.5">
            <BrandMark dark={dark} className="w-10 h-10" />
            <h2 className={`text-lg font-extrabold tracking-tight ${headingText}`}>
              Close Your <span className="bg-gradient-to-r from-teal-400 to-indigo-600 bg-clip-text text-transparent">Gaps</span>
            </h2>
          </div> */}
          <div className="flex items-center gap-3">
  <BrandMark
    dark={dark}
    className="w-11 h-11"
  />

  <div>
    <h2
      className={`text-lg font-extrabold tracking-tight leading-tight ${headingText}`}
    >
      Close Your{" "}
      <span className="bg-gradient-to-r from-teal-400 to-indigo-600 bg-clip-text text-transparent">
        Gaps
      </span>
    </h2>

    <p className={`text-[11px] mt-0.5 ${mutedText}`}>
      Track your progress. Climb your career.
    </p>
  </div>
</div>
         
          <div className={`border-t my-5 ${dividerLine}`} />

          <h1 className={`text-2xl font-extrabold ${headingText}`}>Welcome back</h1>
          <p className={`text-[13px] mt-1 mb-6 ${mutedText}`}>Login to continue your journey</p>

          {error && (
            <div className="mb-4 text-[13px] text-rose-500 bg-rose-500/10 border border-rose-500/20 rounded-xl px-3.5 py-2.5">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className={`text-[13px] font-semibold ${labelBase}`}>Email address</label>
              <div className="relative mt-1.5">
                <MailIcon className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] ${iconMuted}`} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full border rounded-xl pl-10 pr-3.5 py-2.5 text-[13.5px] outline-none ${inputBase}`}
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label className={`text-[13px] font-semibold ${labelBase}`}>Password</label>
              <div className="relative mt-1.5">
                <LockIcon className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] ${iconMuted}`} />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full border rounded-xl pl-10 pr-10 py-2.5 text-[13.5px] outline-none ${inputBase}`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className={`absolute right-3.5 top-1/2 -translate-y-1/2 ${iconMuted}`}
                >
                  <EyeIcon open={showPassword} className="w-[18px] h-[18px]" />
                </button>
              </div>
            </div>

            {/* <div className="flex justify-end -mt-1">
              <Link to="/forgot-password" className={`text-[12.5px] font-medium ${linkColor}`}>
                Forgot password?
              </Link>
            </div> */}

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2.5 rounded-2xl bg-gradient-to-r from-teal-400 to-indigo-600 text-white text-[14px] font-semibold shadow-[0_10px_20px_-8px_rgba(79,70,229,0.5)] disabled:opacity-60 flex items-center justify-center gap-1.5"
            >
              {submitting ? "Logging in..." : (
                <>
                  Login <ArrowRightIcon className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="flex items-center gap-3 my-5">
            <div className={`flex-1 border-t ${dividerLine}`} />
            <span className={`text-[12px] ${mutedText}`}>or</span>
            <div className={`flex-1 border-t ${dividerLine}`} />
          </div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            className={`w-full py-2.5 rounded-xl border text-[13.5px] font-semibold flex items-center justify-center gap-2 ${
              dark ? "border-white/10 text-slate-100 hover:bg-white/5" : "border-slate-200 text-slate-800 hover:bg-slate-50"
            }`}
          >
            <GoogleIcon /> Continue with Google
          </button>

          <p className={`text-[12.5px] mt-6 text-center ${mutedText}`}>
            Don't have an account?{" "}
            <Link to="/signup" className={`font-semibold ${linkColor}`}>
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}