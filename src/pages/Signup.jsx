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

  const submit = (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !pass || !confirm) {
      push({ message: "All fields are required", variant: "error" });
      return;
    }
    if (pass.length < 6) {
      push({ message: "Password must be at least 6 characters", variant: "error" });
      return;
    }
    if (pass !== confirm) {
      push({ message: "Passwords do not match", variant: "error" });
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const user = { name, email };
      onSignup(user);
      push({ message: "Account created! 🎉 Logged in.", variant: "success" });
      navigate("/", { replace: true });
    }, 600);
  };

  return (
    <div className="auth-page container">
      <div className="auth-card">
        <h2>Create account</h2>
        <p className="muted">Join FoodieZone to order faster.</p>
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
