"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { X, CheckCircle, AlertCircle, Info } from "lucide-react";
import { cn } from "@/lib/utils/cn";

type ToastVariant = "success" | "error" | "info";

interface Toast {
  id: string;
  message: string;
  variant: ToastVariant;
}

interface ToastContextValue {
  toast: (message: string, variant?: ToastVariant) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const icons: Record<ToastVariant, React.ReactNode> = {
  success: <CheckCircle className="h-4 w-4 shrink-0 text-teal-600" />,
  error: <AlertCircle className="h-4 w-4 shrink-0 text-red-500" />,
  info: <Info className="h-4 w-4 shrink-0 text-blue-500" />
};

const styles: Record<ToastVariant, string> = {
  success: "border-teal-200 bg-teal-50 text-teal-900",
  error: "border-red-200 bg-red-50 text-red-900",
  info: "border-blue-200 bg-blue-50 text-blue-900"
};

function ToastItem({ toast: t, onDismiss }: { toast: Toast; onDismiss: (id: string) => void }) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    timerRef.current = setTimeout(() => onDismiss(t.id), 4500);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [t.id, onDismiss]);

  return (
    <div
      role="alert"
      className={cn(
        "flex w-full max-w-sm items-start gap-3 rounded-md border px-4 py-3 shadow-md animate-in slide-in-from-right-4 fade-in duration-200",
        styles[t.variant]
      )}
    >
      {icons[t.variant]}
      <p className="flex-1 text-sm font-medium">{t.message}</p>
      <button
        onClick={() => onDismiss(t.id)}
        className="shrink-0 rounded p-0.5 opacity-60 hover:opacity-100"
        aria-label="Dismiss"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback((message: string, variant: ToastVariant = "info") => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev.slice(-4), { id, message, variant }]);
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div
        aria-live="polite"
        className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-2"
      >
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onDismiss={dismiss} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside ToastProvider");
  return ctx.toast;
}
