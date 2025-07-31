import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../components/Toast";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { push } = useToast();
  const navigate = useNavigate();

  const submit = (e) => {
    e.preventDefault();
    if (!email.trim()) {
      push({ message: "Please enter your email", variant: "error" });
      return;
    }
    setLoading(true);
    setTimeout(() => {
      push({ message: "Reset link sent! Set your new password.", variant: "success" });
      navigate(`/reset?email=${encodeURIComponent(email)}`, { replace: true });
    }, 700);
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
