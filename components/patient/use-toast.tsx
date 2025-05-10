import React from "react";
import { createRoot } from "react-dom/client";

type ToastOptions = {
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
  duration?: number;
};

// Global toast container
let toastContainer: HTMLDivElement | null = null;
let toastRoot: any = null;

function createToastContainer() {
  if (typeof document === 'undefined') return;
  
  if (!toastContainer) {
    toastContainer = document.createElement("div");
    toastContainer.className = "fixed top-4 right-4 z-50 flex flex-col gap-2";
    document.body.appendChild(toastContainer);
    toastRoot = createRoot(toastContainer);
  }
}

// Toast component
function ToastComponent({ 
  title, 
  description, 
  variant = "default", 
  onClose 
}: ToastOptions & { onClose: () => void }) {
  React.useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = variant === "destructive" ? "bg-red-500" : "bg-green-500";
  
  return (
    <div className={`${bgColor} text-white p-4 rounded shadow-md min-w-[300px] animate-in fade-in slide-in-from-right`}>
      {title && <h3 className="font-semibold">{title}</h3>}
      {description && <p className="text-sm">{description}</p>}
      <button 
        onClick={onClose} 
        className="absolute top-2 right-2 text-white"
        aria-label="Close"
      >
        ×
      </button>
    </div>
  );
}

// Function to render toasts
function renderToasts(toasts: React.ReactNode[]) {
  createToastContainer();
  if (toastRoot) {
    toastRoot.render(
      <React.StrictMode>
        {toasts}
      </React.StrictMode>
    );
  }
}

// Toast array to manage multiple toasts
let toasts: { id: string; component: React.ReactNode }[] = [];

// Direct toast function
export function toast({ title, description, variant = "default", duration = 5000 }: ToastOptions) {
  const id = Math.random().toString(36).substring(2, 9);

  const removeToast = () => {
    toasts = toasts.filter(t => t.id !== id);
    renderToasts(toasts.map(t => t.component));
  };

  const toastComponent = (
    <ToastComponent
      key={id}
      title={title}
      description={description}
      variant={variant}
      onClose={removeToast}
    />
  );

  toasts.push({ id, component: toastComponent });
  renderToasts(toasts.map(t => t.component));

  return id;
}

// For compatibility with components using a hook pattern
export function useToast() {
  return {
    toast,
    dismiss: (id: string) => {
      toasts = toasts.filter(t => t.id !== id);
      renderToasts(toasts.map(t => t.component));
    },
    toasts
  };
}
