import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useToast } from "../components/Toast";
import { api } from "../services/api";
import { Lock, Eye, EyeOff, ArrowRight } from "lucide-react";

export default function ResetPassword() {
  const { push } = useToast();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const email = params.get("email") || "";

  const [pass, setPass] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!pass || !confirm) {
      push({ message: "Please enter and confirm your new password.", variant: "error" });
      return;
    }
    if (pass.length < 8) {
      push({ message: "Password must be at least 8 characters.", variant: "error" });
      return;
    }
    if (pass !== confirm) {
      push({ message: "Passwords do not match.", variant: "error" });
      return;
    }
    try {
      setLoading(true);
      const data = await api("/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({ email: email.trim(), password: pass }),
      });
      push({ message: data.message || "Password updated. Please log in.", variant: "success" });
      navigate("/login", { replace: true, state: { emailPrefill: email } });
    } catch (err) {
      push({ message: err.message || "Failed to update password", variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page container">
      <div className="modern-auth-card">
        <div className="auth-brand-header">
          <div className="auth-logo-badge">
            <span>🔐</span>
          </div>
          <h1 className="auth-title">Set New Password</h1>
          <p className="auth-subtitle">
            {email ? `Updating credentials for ${email}` : "Enter your new password below."}
          </p>
        </div>

        <form onSubmit={submit} className="modern-auth-form">
          <div className="auth-field-group">
            <label className="auth-label">
              <Lock size={15} color="var(--brand)" />
              <span>New Password (8+ characters)</span>
            </label>
            <div className="auth-input-wrap">
              <input
                type={showPassword ? "text" : "password"}
                className="auth-input has-eye"
                required
                minLength={8}
                placeholder="Enter new password"
                value={pass}
                onChange={(e) => setPass(e.target.value)}
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

          <div className="auth-field-group">
            <label className="auth-label">
              <Lock size={15} color="var(--brand)" />
              <span>Confirm New Password</span>
            </label>
            <div className="auth-input-wrap">
              <input
                type={showConfirm ? "text" : "password"}
                className="auth-input has-eye"
                required
                placeholder="Re-enter new password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
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

          <button type="submit" className="btn btn-primary auth-submit-btn" disabled={loading}>
            <span>{loading ? "Updating..." : "Update Password & Login"}</span>
            <ArrowRight size={16} />
          </button>
        </form>
      </div>
    </div>
  );
}
