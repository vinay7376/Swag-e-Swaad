import React, { createContext, useContext, useState, useCallback } from "react";
import { createPortal } from "react-dom";

// Types: "success" | "error" | "info"
const ToastCtx = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const push = useCallback((opts) => {
    const payload = typeof opts === "string" ? { message: opts } : opts;
    const { message, variant = "info", duration = 2600 } = payload || {};
    if (!message) return;
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, message, variant }]);
    setTimeout(() => {
      setToasts((t) => t.filter((x) => x.id !== id));
    }, duration);
  }, []);

  const dismiss = useCallback((id) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);

  return (
    <ToastCtx.Provider value={{ push }}>
      {children}

      {/* SR-only live region for a11y */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {toasts.length > 0 ? toasts[toasts.length - 1].message : ""}
      </div>

      {createPortal(
        <div className="toast-stack" role="region" aria-label="Notifications">
          {toasts.map((t) => (
            <div key={t.id} className={`toast toast-${t.variant}`} role="status">
              <span className="toast-icon">
                {t.variant === "success" ? "✅" : t.variant === "error" ? "⚠️" : "ℹ️"}
              </span>
              <span className="toast-msg">{t.message}</span>
              <button className="toast-x" onClick={() => dismiss(t.id)} aria-label="Close">✕</button>
            </div>
          ))}
        </div>,
        document.body
      )}
    </ToastCtx.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastCtx);
  if (!ctx) return { push: () => {} }; // safety fallback so UI kabhi crash na ho
  return ctx;
}
