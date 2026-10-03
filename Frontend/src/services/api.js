const getApiBase = () => {
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL.replace(/\/+$/, "");
  }
  if (typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")) {
    return "http://localhost:5000/api";
  }
  return "https://swag-e-swaad.onrender.com/api";
};

export const API_BASE = getApiBase();

export async function api(path, options = {}) {
  const token = localStorage.getItem("fz_token");

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  const data = await response.json().catch(() => ({}));

  if (response.status === 401) {
    window.dispatchEvent(new Event("swag:unauthorized"));
  }

  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
}