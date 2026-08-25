import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useToast } from "../components/Toast";

export default function Login({ onLogin }) {
  const { push } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectTo = location.state?.from || "/";

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [remember, setRemember] = React.useState(true);
  const [loading, setLoading] = React.useState(false);

  // Prefill email after password reset
  React.useEffect(() => {
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

      // =========================
      // LOGIN API
      // =========================
      const response = await fetch(
        "http://localhost:5000/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim(),
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Login failed"
        );
      }

      // =========================
      // SAVE JWT TOKEN
      // =========================
      localStorage.setItem(
        "fz_token",
        data.token
      );

      // =========================
      // SAVE USER
      // =========================
      onLogin(data.user, data.token, { remember });

      push({
        message: "Welcome back! 🎉",
        variant: "success",
      });

      navigate(redirectTo, {
        replace: true,
      });
    } catch (error) {
      console.error("Login Error:", error);

      push({
        message:
          error.message || "Login failed",
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page container">
      <div className="auth-card">
        <h2>Log in</h2>

        <p className="muted">
          Welcome back! Please enter your details.
        </p>

        <form
          onSubmit={submit}
          className="auth-form"
        >
          <label>Email</label>

          <input
            className="input"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
          />

          <label>Password</label>

          <input
            className="input"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
          />

          <div className="auth-row">
            <label className="checkbox">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) =>
                  setRemember(e.target.checked)
                }
              />

              Remember me
            </label>

            <Link
              to="/forgot"
              className="muted"
            >
              Forgot password?
            </Link>
          </div>

          <button
            className="btn btn-primary"
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Logging in..."
              : "Log in"}
          </button>

          <div className="auth-alt">
            New here?{" "}
            <Link to="/signup">
              Create an account
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
