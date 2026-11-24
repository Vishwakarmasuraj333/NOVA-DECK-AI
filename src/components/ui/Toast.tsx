"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from "lucide-react";

export type ToastType = "success" | "error" | "warning" | "info";

export interface ToastItem {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

interface ToastContextValue {
  toasts: ToastItem[];
  showToast: (message: string, type?: ToastType, duration?: number) => void;
  success: (message: string, duration?: number) => void;
  error: (message: string, duration?: number) => void;
  warning: (message: string, duration?: number) => void;
  info: (message: string, duration?: number) => void;
  dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

// Global event bus for non-React contexts
type ToastListener = (toast: ToastItem) => void;
const listeners: Set<ToastListener> = new Set();

export const toast = {
  success: (message: string, duration?: number) => {
    listeners.forEach((l) => l({ id: `toast_${Date.now()}_${Math.random()}`, type: "success", message, duration }));
  },
  error: (message: string, duration?: number) => {
    listeners.forEach((l) => l({ id: `toast_${Date.now()}_${Math.random()}`, type: "error", message, duration }));
  },
  warning: (message: string, duration?: number) => {
    listeners.forEach((l) => l({ id: `toast_${Date.now()}_${Math.random()}`, type: "warning", message, duration }));
  },
  info: (message: string, duration?: number) => {
    listeners.forEach((l) => l({ id: `toast_${Date.now()}_${Math.random()}`, type: "info", message, duration }));
  },
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (message: string, type: ToastType = "info", duration = 4000) => {
      const id = `toast_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const newToast: ToastItem = { id, type, message, duration };
      setToasts((prev) => [...prev, newToast]);

      if (duration > 0) {
        setTimeout(() => {
          dismiss(id);
        }, duration);
      }
    },
    [dismiss]
  );

  useEffect(() => {
    const handleGlobalToast: ToastListener = (t) => {
      setToasts((prev) => [...prev, t]);
      const dur = t.duration || 4000;
      if (dur > 0) {
        setTimeout(() => {
          dismiss(t.id);
        }, dur);
      }
    };

    listeners.add(handleGlobalToast);
    return () => {
      listeners.delete(handleGlobalToast);
    };
  }, [dismiss]);

  const success = useCallback((msg: string, dur?: number) => showToast(msg, "success", dur), [showToast]);
  const error = useCallback((msg: string, dur?: number) => showToast(msg, "error", dur), [showToast]);
  const warning = useCallback((msg: string, dur?: number) => showToast(msg, "warning", dur), [showToast]);
  const info = useCallback((msg: string, dur?: number) => showToast(msg, "info", dur), [showToast]);

  return (
    <ToastContext.Provider value={{ toasts, showToast, success, error, warning, info, dismiss }}>
      {children}
      {/* Toast Render Portal / Container */}
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-2.5 max-w-md w-full pointer-events-none px-4 sm:px-0">
        {toasts.map((t) => {
          const styles = {
            success: {
              border: "border-emerald-500/40",
              bg: "bg-[#0b1b17]/95",
              glow: "shadow-[0_0_20px_rgba(16,185,129,0.25)]",
              icon: <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />,
              textColor: "text-emerald-100",
            },
            error: {
              border: "border-rose-500/40",
              bg: "bg-[#220d14]/95",
              glow: "shadow-[0_0_20px_rgba(244,63,94,0.25)]",
              icon: <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />,
              textColor: "text-rose-100",
            },
            warning: {
              border: "border-amber-500/40",
              bg: "bg-[#221708]/95",
              glow: "shadow-[0_0_20px_rgba(245,158,11,0.25)]",
              icon: <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0" />,
              textColor: "text-amber-100",
            },
            info: {
              border: "border-nova-cyan/40",
              bg: "bg-[#0a1526]/95",
              glow: "shadow-[0_0_20px_rgba(67,213,232,0.25)]",
              icon: <Info className="w-5 h-5 text-nova-cyan flex-shrink-0" />,
              textColor: "text-cyan-100",
            },
          }[t.type];

          return (
            <div
              key={t.id}
              className={`pointer-events-auto flex items-start gap-3 p-4 rounded-2xl border backdrop-blur-xl ${styles.border} ${styles.bg} ${styles.glow} transition-all duration-300 animate-in fade-in slide-in-from-bottom-3`}
            >
              {styles.icon}
              <div className="flex-1 text-sm font-medium leading-snug">
                <p className={styles.textColor}>{t.message}</p>
              </div>
              <button
                type="button"
                onClick={() => dismiss(t.id)}
                className="text-nova-muted hover:text-white p-1 rounded-lg transition-colors -mr-1 -mt-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    return {
      toasts: [],
      showToast: (m: string, t?: ToastType, d?: number) => toast[t || "info"](m, d),
      success: (m: string, d?: number) => toast.success(m, d),
      error: (m: string, d?: number) => toast.error(m, d),
      warning: (m: string, d?: number) => toast.warning(m, d),
      info: (m: string, d?: number) => toast.info(m, d),
      dismiss: () => {},
    };
  }
  return context;
}
