import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Fingerprint, Scan, ShieldAlert, CheckCircle2, AlertCircle, X, ShieldCheck } from 'lucide-react';

interface BiometricModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  actionName: string;
}

export const BiometricModal: React.FC<BiometricModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  actionName,
}) => {
  const [method, setMethod] = useState<'fingerprint' | 'faceid'>('fingerprint');
  const [scanState, setScanState] = useState<'idle' | 'scanning' | 'success' | 'failed'>('idle');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isOpen) {
      setScanState('idle');
      setProgress(0);
      return;
    }
  }, [isOpen]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (scanState === 'scanning') {
      setProgress(0);
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setScanState('success');
            // Complete authorization after 800ms success animation
            setTimeout(() => {
              onSuccess();
              onClose();
            }, 1000);
            return 100;
          }
          return prev + 4; // Scan speed
        });
      }, 80);
    }
    return () => clearInterval(interval);
  }, [scanState, onSuccess, onClose]);

  const handleStartScan = () => {
    if (scanState === 'scanning' || scanState === 'success') return;
    setScanState('scanning');
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div id="biometric-gate-overlay" className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-stone-900/60 dark:bg-black/80 backdrop-blur-md"
          onClick={onClose}
        />

        {/* Modal Window */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 15 }}
          transition={{ type: 'spring', duration: 0.5 }}
          className="relative w-full max-w-md overflow-hidden rounded-3xl bg-[#0a0a0a] border border-white/10 p-6 shadow-2xl text-white z-10"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-white/10 text-white/40 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>

          {/* Header */}
          <div className="flex items-center gap-3 border-b border-white/5 pb-4 mb-5">
            <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400">
              <ShieldAlert size={20} className="animate-pulse" />
            </div>
            <div>
              <h3 className="font-sans font-bold text-white text-sm">Secure Security Gate</h3>
              <p className="text-xs text-white/40">Authentication required for action</p>
            </div>
          </div>

          {/* Action indicator */}
          <div className="bg-indigo-500/5 border border-indigo-500/10 rounded-2xl p-3.5 mb-6 text-center">
            <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold font-mono">REQUESTED TASK</p>
            <p className="font-sans text-xs font-semibold text-indigo-300 mt-1">{actionName}</p>
          </div>

          {/* Switch tabs */}
          {scanState === 'idle' && (
            <div className="flex bg-white/5 p-1 rounded-xl mb-6 border border-white/10">
              <button
                onClick={() => setMethod('fingerprint')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                  method === 'fingerprint'
                    ? 'bg-indigo-600 shadow-md text-white font-bold'
                    : 'text-white/40 hover:text-white'
                }`}
              >
                <Fingerprint size={15} />
                Touch ID
              </button>
              <button
                onClick={() => setMethod('faceid')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                  method === 'faceid'
                    ? 'bg-indigo-600 shadow-md text-white font-bold'
                    : 'text-white/40 hover:text-white'
                }`}
              >
                <Scan size={15} />
                Face ID
              </button>
            </div>
          )}

          {/* Core Interactive Scanner */}
          <div className="flex flex-col items-center justify-center py-6">
            <div className="relative w-40 h-40 flex items-center justify-center mb-4">
              {/* Spinning Scanner Border Ring */}
              <svg className="absolute inset-0 w-full h-full rotate-[-90deg]">
                <circle
                  cx="80"
                  cy="80"
                  r="74"
                  className="stroke-white/5"
                  strokeWidth="4"
                  fill="none"
                />
                <motion.circle
                  cx="80"
                  cy="80"
                  r="74"
                  className="stroke-indigo-500"
                  strokeWidth="4"
                  fill="none"
                  strokeDasharray="465"
                  strokeDashoffset={465 - (465 * progress) / 100}
                  transition={{ ease: 'linear' }}
                />
              </svg>

              {/* Central Core Icon */}
              <AnimatePresence mode="wait">
                {scanState === 'idle' && (
                  <motion.div
                    key="idle"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    onClick={handleStartScan}
                    className="cursor-pointer group flex flex-col items-center justify-center text-indigo-400 hover:text-indigo-300"
                  >
                    {method === 'fingerprint' ? (
                      <Fingerprint size={56} className="transition-transform group-hover:scale-105" />
                    ) : (
                      <Scan size={56} className="transition-transform group-hover:scale-105" />
                    )}
                    <span className="text-[10px] font-bold font-mono text-white/45 uppercase mt-2 group-hover:text-indigo-400 transition-colors">
                      Tap to scan
                    </span>
                  </motion.div>
                )}

                {scanState === 'scanning' && (
                  <motion.div
                    key="scanning"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center text-indigo-400"
                  >
                    {method === 'fingerprint' ? (
                      <div className="relative">
                        <Fingerprint size={56} className="text-indigo-400" />
                        {/* Radial Scanning Laser Grid */}
                        <motion.div 
                          initial={{ top: '0%' }}
                          animate={{ top: '100%' }}
                          transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
                          className="absolute left-0 right-0 h-0.5 bg-indigo-500 shadow-[0_0_10px_#6366f1] pointer-events-none"
                        />
                      </div>
                    ) : (
                      <div className="relative">
                        <Scan size={56} className="text-indigo-400 animate-pulse" />
                        {/* Scanning frame corners */}
                        <motion.div 
                          initial={{ scale: 0.9 }}
                          animate={{ scale: 1.1 }}
                          transition={{ repeat: Infinity, duration: 1, repeatType: 'reverse' }}
                          className="absolute inset-[-4px] border border-indigo-500/60 rounded-md pointer-events-none"
                        />
                      </div>
                    )}
                    <span className="text-[11px] font-bold text-indigo-400 uppercase tracking-widest mt-2 animate-pulse font-mono">
                      {progress}% SCANNING...
                    </span>
                  </motion.div>
                )}

                {scanState === 'success' && (
                  <motion.div
                    key="success"
                    initial={{ scale: 0.7, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    className="flex flex-col items-center justify-center text-emerald-400"
                  >
                    <ShieldCheck size={52} className="stroke-[2.5]" />
                    <span className="text-xs font-bold uppercase tracking-wider mt-2 font-mono text-emerald-405 animate-pulse">
                      Access Granted
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Explanatory text */}
            {scanState === 'idle' && (
              <p className="text-xs text-center text-white/50 max-w-xs px-4">
                Verify identity via secure biometric key activation to approve this transaction and log to cloud ledger.
              </p>
            )}
            {scanState === 'scanning' && (
              <p className="text-xs text-center text-white/50 max-w-xs px-4 animate-pulse">
                Keep finger on scanner or look directly at camera. Do not close browser.
              </p>
            )}
            {scanState === 'success' && (
              <p className="text-xs text-center text-emerald-450 font-medium max-w-xs px-4">
                Signature successfully authorized. Performing automated task.
              </p>
            )}
          </div>

          {/* Fallback & Cancel buttons */}
          <div className="flex gap-3 justify-center border-t border-white/5 pt-4 mt-2">
            <button
              onClick={onClose}
              className="px-4 py-2 cursor-pointer text-xs font-medium bg-white/5 hover:bg-white/10 text-white/80 rounded-xl transition-all border border-white/10"
            >
              Cancel
            </button>
            {scanState === 'idle' && (
              <button
                onClick={() => {
                  setScanState('success');
                  setTimeout(() => {
                    onSuccess();
                    onClose();
                  }, 900);
                }}
                className="px-4 py-2 cursor-pointer text-xs font-bold bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 rounded-xl transition-all border border-indigo-500/20"
              >
                Skip (Lock Pin)
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
