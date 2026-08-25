export const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

export async function api(path, options = {}) {
  const token = localStorage.getItem("fz_token");
  const response = await fetch(`${API_BASE}${path}`, { ...options, headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}), ...(options.headers || {}) } });
  const data = await response.json().catch(() => ({}));
  if (response.status === 401) window.dispatchEvent(new Event("swag:unauthorized"));
  if (!response.ok) throw new Error(data.message || "Request failed");
  return data;
}
