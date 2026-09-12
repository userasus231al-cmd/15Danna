import React, { useState, useEffect, useRef } from 'react';
import { Lock, KeyRound, X, Sparkles, Check, AlertCircle } from 'lucide-react';

interface PasswordAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const CORRECT_PASSWORD = '90415';

export const PasswordAuthModal: React.FC<PasswordAuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setPassword('');
      setError(false);
      setIsShaking(false);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.trim() === CORRECT_PASSWORD) {
      setError(false);
      onSuccess();
      onClose();
    } else {
      setError(true);
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className={`relative w-full max-w-sm rounded-3xl bg-gradient-to-b from-[#35152d] via-[#240c1e] to-[#180614] border-2 border-rose-400/40 p-6 shadow-2xl text-stone-100 ${
          isShaking ? 'animate-bounce' : ''
        }`}
        style={{
          boxShadow: '0 25px 50px -12px rgba(216, 124, 152, 0.25), 0 0 30px rgba(0, 0, 0, 0.8)'
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-rose-300/60 hover:text-rose-100 hover:bg-white/10 transition-colors"
          title="Cerrar"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex flex-col items-center text-center mb-5">
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-rose-500/20 to-amber-500/20 border border-rose-300/40 flex items-center justify-center mb-3 text-rose-300 shadow-inner">
            <Lock className="w-5 h-5 text-rose-300" />
          </div>

          <h3 className="text-lg font-cinzel font-bold tracking-wider text-rose-100 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Acceso de Edición
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          </h3>
          <p className="text-xs font-serif text-rose-200/70 mt-1">
            Ingresa la clave de seguridad para personalizar la invitación
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-rose-300/60">
              <KeyRound className="w-4 h-4" />
            </div>
            <input
              ref={inputRef}
              type="password"
              inputMode="numeric"
              pattern="[0-9]*"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) setError(false);
              }}
              placeholder="Código de acceso"
              className={`w-full pl-10 pr-4 py-2.5 rounded-2xl bg-black/50 border text-center font-mono tracking-widest text-lg text-white placeholder:text-stone-500 placeholder:text-xs placeholder:font-sans focus:outline-none transition-all ${
                error
                  ? 'border-red-400 focus:border-red-400 focus:ring-1 focus:ring-red-400'
                  : 'border-rose-400/40 focus:border-rose-300 focus:ring-1 focus:ring-rose-300'
              }`}
              maxLength={10}
            />
          </div>

          {error && (
            <div className="flex items-center justify-center gap-1.5 text-red-400 text-xs font-medium">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Contraseña incorrecta. Inténtalo de nuevo.</span>
            </div>
          )}

          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 rounded-xl border border-rose-300/20 text-rose-200/80 hover:bg-white/5 text-xs font-semibold transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 py-2 rounded-xl bg-gradient-to-r from-[#d87c98] to-[#cc6886] hover:from-[#c96987] hover:to-[#b85474] text-white font-cinzel font-bold text-xs uppercase tracking-wider shadow-md hover:scale-[1.02] transition-all"
            >
              Desbloquear
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
