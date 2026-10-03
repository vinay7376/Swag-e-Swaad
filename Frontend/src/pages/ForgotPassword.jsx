import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../components/Toast";
import { api } from "../services/api";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { push } = useToast();
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      push({ message: "Please enter your email", variant: "error" });
      return;
    }
    try {
      setLoading(true);
      const data = await api("/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email: email.trim() }),
      });
      push({ message: data.message || "Reset request verified! Set your new password.", variant: "success" });
      navigate(`/reset?email=${encodeURIComponent(email.trim())}`, { replace: true });
    } catch (err) {
      push({ message: err.message || "Email not found", variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page container">
      <div className="auth-card">
        <h2>Forgot Password</h2>
        <p className="muted">Enter your email to receive a reset link.</p>
        <form onSubmit={submit} className="auth-form">
          <label>Email</label>
          <input
            type="email"
            className="input"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>
      </div>
    </div>
  );
}
