import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useToast } from "../components/Toast";
import { api } from "../services/api";
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";

export default function Login({ onLogin }) {
  const { push } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectTo = location.state?.from || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);

  // Prefill email after password reset if redirected
  useEffect(() => {
    if (location.state?.emailPrefill) {
      setEmail(location.state.emailPrefill);
    }
  }, [location.state]);

  const submit = async (e) => {
    e.preventDefault();

    if (!email.trim() || !password) {
      push({
        message: "Email and password are required",
        variant: "error",
      });
      return;
    }

    try {
      setLoading(true);

      const data = await api("/auth/login", {
        method: "POST",
        body: JSON.stringify({
          email: email.trim(),
          password,
        }),
      });

      localStorage.setItem("fz_token", data.token);
      onLogin(data.user, data.token, { remember });

      push({
        message: `Welcome back, ${data.user.name}! 🎉`,
        variant: "success",
      });

      navigate(redirectTo, { replace: true });
    } catch (error) {
      console.error("Login Error:", error);
      push({
        message: error.message || "Invalid email or password",
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page container">
      <div className="modern-auth-card">
        {/* Brand Header */}
        <div className="auth-brand-header">
          <div className="auth-logo-badge">
            <span>🍽️</span>
          </div>
          <h1 className="auth-title">Welcome Back</h1>
          <p className="auth-subtitle">
            Log in to your Swag-e-Swaad account to track orders & enjoy exclusive foodie perks.
          </p>
        </div>

        <form onSubmit={submit} className="modern-auth-form">
          {/* Email Field */}
          <div className="auth-field-group">
            <label className="auth-label">
              <Mail size={15} />
              <span>Email Address</span>
            </label>
            <div className="auth-input-wrap">
              <input
                className="auth-input"
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>
          </div>

          {/* Password Field with Visibility Toggle */}
          <div className="auth-field-group">
            <div className="auth-label-between">
              <label className="auth-label">
                <Lock size={15} />
                <span>Password</span>
              </label>
              <Link to="/forgot" className="auth-forgot-link">
                Forgot password?
              </Link>
            </div>
            <div className="auth-input-wrap">
              <input
                className="auth-input"
                type={showPassword ? "text" : "password"}
                required
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
              <button
                type="button"
                className="auth-eye-btn"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                tabIndex="-1"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Remember Me Checkbox */}
          <div className="auth-row-options">
            <label className="auth-checkbox-label">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />
              <span>Remember me on this device</span>
            </label>
          </div>

          {/* Submit Button */}
          <button
            className="btn btn-primary auth-submit-btn"
            type="submit"
            disabled={loading}
          >
            <span>{loading ? "Signing in..." : "Sign In to Account"}</span>
            <ArrowRight size={16} />
          </button>

          {/* Switch to Signup */}
          <div className="auth-footer-prompt">
            Don't have an account yet?{" "}
            <Link to="/signup" className="auth-link-highlight">
              Sign Up Free
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
