import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useToast } from "../components/Toast";
import { api } from "../services/api";

export default function ResetPassword() {
  const { push } = useToast();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const email = params.get("email") || "";

  const [pass, setPass] = useState("");
  const [confirm, setConfirm] = useState("");
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
      <div className="auth-card">
        <h2>Set new password</h2>
        <p className="muted">{email ? `for ${email}` : "Enter your new password below."}</p>
        <form onSubmit={submit} className="auth-form">
          <label>New Password</label>
          <input
            type="password"
            className="input"
            placeholder="••••••••"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
          />

          <label>Confirm Password</label>
          <input
            type="password"
            className="input"
            placeholder="••••••••"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Saving..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
