import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "../components/Toast";

export default function Signup({ onSignup }) {
  const { push } = useToast();
  const navigate = useNavigate();

  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [pass, setPass] = React.useState("");
  const [confirm, setConfirm] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !pass || !confirm) {
      push({ message: "All fields are required", variant: "error" });
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
      const response = await fetch("http://localhost:5000/api/auth/register", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: name.trim(), email: email.trim(), password: pass }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Unable to create account");
      onSignup(data.user, data.token);
      push({ message: "Account created! 🎉 Logged in.", variant: "success" });
      navigate("/", { replace: true });
    } catch (error) { push({ message: error.message, variant: "error" }); } finally { setLoading(false); }
  };

  return (
    <div className="auth-page container">
      <div className="auth-card">
        <h2>Create account</h2>
        <p className="muted">Join Swag-e-Swaad to order faster.</p>
        <form onSubmit={submit} className="auth-form">
          <label>Name</label>
          <input className="input" type="text" placeholder="Jane Doe" value={name} onChange={(e) => setName(e.target.value)} />

          <label>Email</label>
          <input className="input" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />

          <label>Password</label>
          <input className="input" type="password" placeholder="••••••••" value={pass} onChange={(e) => setPass(e.target.value)} />

          <label>Confirm Password</label>
          <input className="input" type="password" placeholder="••••••••" value={confirm} onChange={(e) => setConfirm(e.target.value)} />

          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? "Creating..." : "Sign up"}
          </button>

          <div className="auth-alt">
            Already have an account? <Link to="/login">Log in</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
