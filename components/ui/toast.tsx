import { CheckCircle, AlertCircle, X } from "lucide-react";

export interface ToastProps {
  id: string;
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
  onDismiss?: (id: string) => void;
}

export function Toast({ id, title, description, variant = "default", onDismiss }: ToastProps) {
  const handleDismiss = () => {
    onDismiss?.(id);
  };

  return (
    <div
      className={`fixed bottom-4 right-4 max-w-sm w-full rounded-lg shadow-lg p-4 flex items-start gap-3 text-white animate-slide-up ${
        variant === "destructive" ? "bg-red-600" : "bg-green-600"
      }`}
    >
      {variant === "destructive" ? (
        <AlertCircle className="h-5 w-5 flex-shrink-0" />
      ) : (
        <CheckCircle className="h-5 w-5 flex-shrink-0" />
      )}
      <div className="flex-1">
        {title && <h5 className="font-medium">{title}</h5>}
        {description && <p className="text-sm opacity-90">{description}</p>}
      </div>
      <button 
        onClick={handleDismiss}
        className="flex-shrink-0 rounded-full hover:bg-white/20 p-1"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

export function ToastContainer({ toasts, onDismiss }: { toasts: ToastProps[], onDismiss: (id: string) => void }) {
  return (
    <div className="fixed bottom-0 right-0 z-50 p-4 space-y-3">
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
}
