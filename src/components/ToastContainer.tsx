import React from 'react';
import { X, CheckCircle, AlertTriangle, Info, Flame } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-20 lg:bottom-6 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map(toast => {
        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-2xl shadow-2xl border backdrop-blur-md animate-in slide-in-from-bottom-3 transition-all ${
              toast.type === 'goal'
                ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold'
                : toast.type === 'success'
                ? 'bg-slate-900/95 text-white border-emerald-500/50'
                : toast.type === 'alert'
                ? 'bg-slate-900/95 text-white border-rose-500/50'
                : 'bg-slate-900/95 text-white border-slate-700'
            }`}
          >
            <div className="flex-shrink-0 mt-0.5">
              {toast.type === 'goal' && <Flame className="w-5 h-5 text-slate-950 animate-bounce" />}
              {toast.type === 'success' && <CheckCircle className="w-5 h-5 text-emerald-400" />}
              {toast.type === 'alert' && <AlertTriangle className="w-5 h-5 text-rose-400" />}
              {toast.type === 'info' && <Info className="w-5 h-5 text-amber-400" />}
            </div>

            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-black truncate">{toast.title}</h4>
              <p className={`text-[11px] mt-0.5 leading-relaxed ${toast.type === 'goal' ? 'text-slate-900' : 'text-slate-300'}`}>
                {toast.message}
              </p>
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="flex-shrink-0 p-1 rounded-lg opacity-70 hover:opacity-100 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
