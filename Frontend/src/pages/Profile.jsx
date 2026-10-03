import React, { useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../services/api";
import { useToast } from "../components/Toast";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Lock,
  ShieldCheck,
  Package,
  Heart,
  ShoppingBag,
  Eye,
  EyeOff,
  CheckCircle2,
} from "lucide-react";

export default function Profile({ user, onUpdate }) {
  const { push } = useToast();

  const [form, setForm] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    address: user?.address || "",
  });

  const [password, setPassword] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  // Save Personal & Address details
  const saveProfile = async (event) => {
    event.preventDefault();
    try {
      setSavingProfile(true);
      const data = await api("/auth/profile", {
        method: "PATCH",
        body: JSON.stringify(form),
      });

      onUpdate(data.user);
      localStorage.setItem("fz_user", JSON.stringify(data.user));
      push({
        message: "Profile details updated successfully!",
        variant: "success",
      });
    } catch (error) {
      push({ message: error.message, variant: "error" });
    } finally {
      setSavingProfile(false);
    }
  };

  // Change password
  const savePassword = async (event) => {
    event.preventDefault();

    if (password.newPassword.length < 8) {
      push({
        message: "New password must be at least 8 characters long.",
        variant: "error",
      });
      return;
    }

    if (password.newPassword !== password.confirmPassword) {
      push({
        message: "New passwords do not match. Please verify.",
        variant: "error",
      });
      return;
    }

    try {
      setSavingPassword(true);
      await api("/auth/password", {
        method: "PATCH",
        body: JSON.stringify({
          currentPassword: password.currentPassword,
          newPassword: password.newPassword,
        }),
      });

      setPassword({ currentPassword: "", newPassword: "", confirmPassword: "" });
      push({
        message: "Password changed successfully! Keep it secure.",
        variant: "success",
      });
    } catch (error) {
      push({ message: error.message, variant: "error" });
    } finally {
      setSavingPassword(false);
    }
  };

  const initial = user?.name ? user.name.charAt(0).toUpperCase() : "U";

  return (
    <div className="profile-page-wrapper container">
      {/* =========================================
          PROFILE HEADER HERO BANNER
      ========================================= */}
      <div className="profile-hero-card">
        <div className="profile-avatar-circle">
          <span>{initial}</span>
        </div>

        <div className="profile-identity">
          <div className="profile-name-badge-row">
            <h1 className="profile-display-name">{user?.name || "Foodie Member"}</h1>
            <span className="profile-role-pill">
              <ShieldCheck size={14} />
              <span>{user?.role === "admin" ? "Administrator" : "Verified Customer"}</span>
            </span>
          </div>

          <div className="profile-meta-row">
            <span className="profile-email-meta">
              <Mail size={14} />
              <span>{user?.email}</span>
            </span>
            {user?.phone && (
              <span className="profile-phone-meta">
                <Phone size={14} />
                <span>{user.phone}</span>
              </span>
            )}
          </div>
        </div>

        {/* Quick shortcut navigation */}
        <div className="profile-quick-shortcuts">
          <Link to="/orders" className="shortcut-btn" title="View Orders">
            <Package size={18} />
            <span>Orders</span>
          </Link>
          <Link to="/favorites" className="shortcut-btn" title="View Wishlist">
            <Heart size={18} />
            <span>Favorites</span>
          </Link>
          <Link to="/cart" className="shortcut-btn" title="View Cart">
            <ShoppingBag size={18} />
            <span>Cart</span>
          </Link>
        </div>
      </div>

      {/* =========================================
          PROFILE FORMS GRID
      ========================================= */}
      <div className="profile-sections-grid">
        {/* LEFT COLUMN: Personal Info & Delivery Address */}
        <div className="profile-col-left">
          <div className="profile-card">
            <div className="card-header-with-icon">
              <div className="header-icon-box">
                <User size={20} />
              </div>
              <div>
                <h2>Personal Information</h2>
                <p className="muted">Manage your personal details and contact info</p>
              </div>
            </div>

            <form onSubmit={saveProfile} className="profile-form">
              <div className="form-group">
                <label className="form-label">
                  <User size={15} />
                  <span>Full Name</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Enter your full name"
                  className="modern-input"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  <Mail size={15} />
                  <span>Email Address (Primary)</span>
                </label>
                <input
                  type="email"
                  disabled
                  value={user?.email || ""}
                  className="modern-input disabled-input"
                  title="Email cannot be changed"
                />
                <span className="input-hint">Your email is verified and permanently linked to your account.</span>
              </div>

              <div className="form-group">
                <label className="form-label">
                  <Phone size={15} />
                  <span>Mobile Phone Number</span>
                </label>
                <input
                  type="tel"
                  placeholder="e.g. +91 98765 43210"
                  className="modern-input"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  <MapPin size={15} />
                  <span>Default Delivery Address</span>
                </label>
                <textarea
                  rows="3"
                  placeholder="Flat/House No, Building, Street, Landmark, City, Pincode"
                  className="modern-textarea"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                />
                <span className="input-hint">This address will auto-populate during fast checkout.</span>
              </div>

              <div className="form-actions">
                <button
                  type="submit"
                  className="btn btn-primary btn-save-profile"
                  disabled={savingProfile}
                >
                  <CheckCircle2 size={16} />
                  <span>{savingProfile ? "Saving Changes..." : "Save Profile Details"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* RIGHT COLUMN: Password & Security */}
        <div className="profile-col-right">
          <div className="profile-card">
            <div className="card-header-with-icon">
              <div className="header-icon-box security-icon-box">
                <Lock size={20} />
              </div>
              <div>
                <h2>Security & Password</h2>
                <p className="muted">Ensure your account is using a strong, unique password</p>
              </div>
            </div>

            <form onSubmit={savePassword} className="profile-form">
              <div className="form-group">
                <label className="form-label">
                  <Lock size={15} />
                  <span>Current Password</span>
                </label>
                <div className="password-input-wrapper">
                  <input
                    type={showCurrentPass ? "text" : "password"}
                    required
                    placeholder="Enter current password"
                    className="modern-input"
                    value={password.currentPassword}
                    onChange={(e) =>
                      setPassword({ ...password, currentPassword: e.target.value })
                    }
                  />
                  <button
                    type="button"
                    className="toggle-pass-visibility"
                    onClick={() => setShowCurrentPass(!showCurrentPass)}
                    tabIndex="-1"
                  >
                    {showCurrentPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">
                  <Lock size={15} />
                  <span>New Password</span>
                </label>
                <div className="password-input-wrapper">
                  <input
                    type={showNewPass ? "text" : "password"}
                    required
                    minLength={8}
                    placeholder="Minimum 8 characters"
                    className="modern-input"
                    value={password.newPassword}
                    onChange={(e) =>
                      setPassword({ ...password, newPassword: e.target.value })
                    }
                  />
                  <button
                    type="button"
                    className="toggle-pass-visibility"
                    onClick={() => setShowNewPass(!showNewPass)}
                    tabIndex="-1"
                  >
                    {showNewPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">
                  <Lock size={15} />
                  <span>Confirm New Password</span>
                </label>
                <input
                  type="password"
                  required
                  placeholder="Re-enter new password"
                  className="modern-input"
                  value={password.confirmPassword}
                  onChange={(e) =>
                    setPassword({ ...password, confirmPassword: e.target.value })
                  }
                />
              </div>

              <div className="form-actions">
                <button
                  type="submit"
                  className="btn btn-ghost btn-update-pass"
                  disabled={savingPassword}
                >
                  <Lock size={16} />
                  <span>{savingPassword ? "Updating..." : "Update Password"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
