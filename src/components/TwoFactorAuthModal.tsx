import React, { useState, useRef, useEffect } from 'react';
import { X, ShieldCheck, Smartphone, KeyRound, AlertCircle, CheckCircle2, RotateCw } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getAccentStyles } from '../utils/theme';

export const TwoFactorAuthModal: React.FC = () => {
  const { is2FAModalOpen, setIs2FAModalOpen, verify2FACode, member, themeAccent, t, showToast } = useApp();
  const [digits, setDigits] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(30);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const accent = getAccentStyles(themeAccent);

  useEffect(() => {
    if (is2FAModalOpen) {
      setDigits(['', '', '', '', '', '']);
      setError(null);
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    }
  }, [is2FAModalOpen]);

  useEffect(() => {
    let timer: any;
    if (resendCooldown > 0 && is2FAModalOpen) {
      timer = setTimeout(() => setResendCooldown(prev => prev - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendCooldown, is2FAModalOpen]);

  if (!is2FAModalOpen) return null;

  const handleDigitChange = (index: number, value: string) => {
    setError(null);
    if (!/^\d*$/.test(value)) return;

    const newDigits = [...digits];
    newDigits[index] = value.slice(-1);
    setDigits(newDigits);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-verify if all 6 digits entered
    const fullCode = newDigits.join('');
    if (fullCode.length === 6) {
      handleSubmit(fullCode);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted) {
      const newDigits = [...digits];
      for (let i = 0; i < 6; i++) {
        newDigits[i] = pasted[i] || '';
      }
      setDigits(newDigits);
      if (pasted.length === 6) {
        handleSubmit(pasted);
      }
    }
  };

  const handleSubmit = (codeToVerify?: string) => {
    const code = codeToVerify || digits.join('');
    if (code.length < 6) {
      setError('Veuillez saisir les 6 chiffres du code de vérification.');
      return;
    }

    setIsVerifying(true);
    setTimeout(() => {
      const success = verify2FACode(code);
      setIsVerifying(false);
      if (!success) {
        setError('Code de vérification invalide ou expiré. Essayez 750160 ou vos codes de secours.');
      }
    }, 600);
  };

  const handleQuickDemoFill = () => {
    const demoCode = '750160';
    setDigits(demoCode.split(''));
    handleSubmit(demoCode);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Authentification à Deux Facteurs (2FA)
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Sécurisation du compte membre Académie Future Pro
              </p>
            </div>
          </div>
          <button
            onClick={() => setIs2FAModalOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Instructions */}
        <div className="mt-4 text-center">
          <p className="text-xs text-slate-600 dark:text-slate-300">
            {t('code_sent_sms')}
          </p>
          <p className="text-[11px] text-amber-600 dark:text-amber-400 font-mono mt-1 font-semibold">
            {member.phone}
          </p>
        </div>

        {/* 6 Digit Input Slots */}
        <div className="mt-6 flex items-center justify-center gap-2 sm:gap-2.5" onPaste={handlePaste}>
          {digits.map((digit, idx) => (
            <input
              key={idx}
              ref={el => { inputRefs.current[idx] = el; }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={e => handleDigitChange(idx, e.target.value)}
              onKeyDown={e => handleKeyDown(idx, e)}
              className={`w-11 h-13 text-center text-xl font-bold rounded-xl border-2 transition-all outline-none bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white ${
                error
                  ? 'border-rose-500'
                  : digit
                  ? 'border-amber-500 bg-amber-500/5'
                  : 'border-slate-200 dark:border-slate-700 focus:border-amber-500'
              }`}
            />
          ))}
        </div>

        {/* Error message */}
        {error && (
          <div className="mt-3 flex items-center gap-1.5 text-xs text-rose-500 justify-center">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Submit Button */}
        <button
          id="btn-confirm-2fa"
          onClick={() => handleSubmit()}
          disabled={isVerifying}
          className={`mt-6 w-full py-3 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-md ${accent.bg} ${
            isVerifying ? 'opacity-70 cursor-not-allowed' : ''
          }`}
        >
          {isVerifying ? (
            <>
              <RotateCw className="w-4 h-4 animate-spin" />
              <span>Vérification sécurisée...</span>
            </>
          ) : (
            <>
              <ShieldCheck className="w-4 h-4" />
              <span>{t('verify_code')}</span>
            </>
          )}
        </button>

        {/* Demo Fast Fill & Resend */}
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2">
          <button
            onClick={handleQuickDemoFill}
            className="text-xs text-amber-500 hover:text-amber-400 font-semibold text-center transition"
          >
            ⚡ Saisie automatique code test : 750160
          </button>

          <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            <button
              disabled={resendCooldown > 0}
              onClick={() => {
                setResendCooldown(30);
                showToast('2FA', 'Nouveau code envoyé par SMS (simulé).', 'info');
              }}
              className={`hover:text-slate-800 dark:hover:text-slate-200 transition ${
                resendCooldown > 0 ? 'opacity-50 cursor-not-allowed' : 'font-semibold text-amber-500'
              }`}
            >
              Renvoyer le code {resendCooldown > 0 ? `(${resendCooldown}s)` : ''}
            </button>

            <span className="font-mono text-slate-400">
              Secours : {member.twoFactorBackupCodes[0]}
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};
