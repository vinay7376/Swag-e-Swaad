import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "../components/Toast";
import { api } from "../services/api";
import { User, Mail, Lock, Eye, EyeOff, ArrowRight, Zap } from "lucide-react";

export default function Signup({ onSignup }) {
  const { push } = useToast();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !pass || !confirm) {
      push({ message: "Please fill in all fields", variant: "error" });
      return;
    }

    if (pass.length < 8) {
      push({ message: "Password must be at least 8 characters", variant: "error" });
      return;
    }

    if (pass !== confirm) {
      push({ message: "Passwords do not match", variant: "error" });
      return;
    }

    try {
      setLoading(true);

      const data = await api("/auth/register", {
        method: "POST",
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          password: pass,
        }),
      });

      localStorage.setItem("fz_token", data.token);
      onSignup(data.user, data.token);

      push({
        message: `Welcome to Swag-e-Swaad, ${data.user.name}! 🎉`,
        variant: "success",
      });

      navigate("/", { replace: true });
    } catch (error) {
      push({ message: error.message || "Registration failed", variant: "error" });
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
          <h1 className="auth-title">Create Account</h1>
          <p className="auth-subtitle">
            Join Swag-e-Swaad to experience superfast food delivery & delicious deals.
          </p>
        </div>

        {/* Recruiter / Evaluator Hint */}
        <div className="demo-signup-hint">
          <Zap size={14} color="#f59e0b" />
          <span>Evaluating as recruiter? Use our <Link to="/login" className="auth-link-highlight">1-Click Demo Login</Link></span>
        </div>

        <form onSubmit={submit} className="modern-auth-form">
          {/* Full Name */}
          <div className="auth-field-group">
            <label className="auth-label">
              <User size={15} color="var(--brand)" />
              <span>Full Name</span>
            </label>
            <div className="auth-input-wrap">
              <input
                className="auth-input"
                type="text"
                required
                placeholder="e.g. Aman Sharma"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
              />
            </div>
          </div>

          {/* Email */}
          <div className="auth-field-group">
            <label className="auth-label">
              <Mail size={15} color="var(--brand)" />
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

          {/* Password with Eye Toggle */}
          <div className="auth-field-group">
            <label className="auth-label">
              <Lock size={15} color="var(--brand)" />
              <span>Create Password (8+ chars)</span>
            </label>
            <div className="auth-input-wrap">
              <input
                className="auth-input has-eye"
                type={showPassword ? "text" : "password"}
                required
                minLength={8}
                placeholder="At least 8 characters"
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                autoComplete="new-password"
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

          {/* Confirm Password with Eye Toggle */}
          <div className="auth-field-group">
            <label className="auth-label">
              <Lock size={15} color="var(--brand)" />
              <span>Confirm Password</span>
            </label>
            <div className="auth-input-wrap">
              <input
                className="auth-input has-eye"
                type={showConfirm ? "text" : "password"}
                required
                placeholder="Re-enter your password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                autoComplete="new-password"
              />
              <button
                type="button"
                className="auth-eye-btn"
                onClick={() => setShowConfirm(!showConfirm)}
                aria-label={showConfirm ? "Hide confirm password" : "Show confirm password"}
                tabIndex="-1"
              >
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            className="btn btn-primary auth-submit-btn"
            type="submit"
            disabled={loading}
          >
            <span>{loading ? "Creating Account..." : "Create Account"}</span>
            <ArrowRight size={16} />
          </button>

          {/* Switch to Login */}
          <div className="auth-footer-prompt">
            Already have an account?{" "}
            <Link to="/login" className="auth-link-highlight">
              Log In
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
