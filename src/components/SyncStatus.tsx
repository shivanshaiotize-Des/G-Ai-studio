import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Wifi, WifiOff, CloudLightning, RefreshCw, Database, Server, Check, HelpCircle } from 'lucide-react';

interface SyncStatusProps {
  isOnline: boolean;
  onToggleConnection: () => void;
  pendingSyncCount: number;
  syncingLogs: string[];
  lastBackupTime: string | null;
  onManualSync: () => void;
}

export const SyncStatus: React.FC<SyncStatusProps> = ({
  isOnline,
  onToggleConnection,
  pendingSyncCount,
  syncingLogs = [],
  lastBackupTime,
  onManualSync,
}) => {
  const [showLogs, setShowLogs] = useState(false);
  const [justSynced, setJustSynced] = useState(false);

  useEffect(() => {
    if (isOnline && pendingSyncCount === 0 && syncingLogs.length > 0) {
      setJustSynced(true);
      const timer = setTimeout(() => {
        setJustSynced(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isOnline, pendingSyncCount, syncingLogs]);

  return (
    <div id="sync-status-card" className="bg-white/5 border border-white/10 rounded-3xl p-5 backdrop-blur-xl relative overflow-hidden text-white">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="relative">
            {isOnline ? (
              <div className="p-2 bg-emerald-500/10 rounded-xl text-emerald-400">
                <Wifi size={18} />
                <span className="absolute top-0.5 right-0.5 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
              </div>
            ) : (
              <div className="p-2 bg-amber-500/10 rounded-xl text-amber-500">
                <WifiOff size={18} className="animate-bounce" />
                <span className="absolute top-0.5 right-0.5 flex h-2 w-2">
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                </span>
              </div>
            )}
          </div>
          <div>
            <div className="flex items-center gap-1.5 font-sans">
              <span className="text-xs text-white/50">Connection Status</span>
              {pendingSyncCount > 0 && (
                <span className="px-1.5 py-0.5 text-[9px] font-bold bg-indigo-650 text-white rounded-full animate-pulse">
                  {pendingSyncCount} cached
                </span>
              )}
            </div>
            <h4 className="font-sans font-bold text-sm text-white">
              {isOnline ? (
                justSynced ? 'All Synced & Cloud Sec' : 'Active • Cloud Connection'
              ) : (
                'Offline • Local Cache Mode'
              )}
            </h4>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Quick Connection Toggle (To help user test offline caching) */}
          <button
            onClick={onToggleConnection}
            title={isOnline ? "Go Offline to test local cache scheduling" : "Re-connect to trigger auto core sync"}
            className={`cursor-pointer px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all flex items-center gap-1 select-none leading-none ${
              isOnline
                ? 'bg-white/5 hover:bg-white/10 text-white/80 border-white/10'
                : 'bg-indigo-600 text-white hover:bg-indigo-700 border-transparent shadow-lg shadow-indigo-500/20'
            }`}
          >
            {isOnline ? <WifiOff size={13} /> : <Wifi size={13} />}
            {isOnline ? "Go Offline" : "Go Online"}
          </button>
        </div>
      </div>

      {/* Database sync parameters summary */}
      <div className="mt-4 pt-4 border-t border-white/5 grid grid-cols-2 gap-4 text-white">
        <div className="bg-white/5 p-3 rounded-2xl border border-white/5">
          <div className="flex items-center gap-1 text-[9px] text-white/40 font-bold font-mono uppercase tracking-widest">
            <Server size={10} />
            Cloud Database
          </div>
          <p className="text-xs font-bold text-white mt-1.5 flex items-center gap-1">
            {isOnline ? (
              <>
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Live Sync Active
              </>
            ) : (
              <>
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
                Standby Cache
              </>
            )}
          </p>
        </div>

        <div className="bg-white/5 p-3 rounded-2xl border border-white/5">
          <div className="flex items-center gap-1 text-[9px] text-white/40 font-bold font-mono uppercase tracking-widest">
            <RefreshCw size={10} />
            Last Backup
          </div>
          <p className="text-xs font-bold text-white mt-1.5 truncate" title={lastBackupTime || 'None yet'}>
            {lastBackupTime ? lastBackupTime : 'Waiting for sync'}
          </p>
        </div>
      </div>

      {/* Simulated Live Backup Status Stream Indicator */}
      <div className="mt-3">
        <button
          onClick={() => setShowLogs(!showLogs)}
          className="w-full flex items-center justify-between text-xs text-white/50 hover:text-white py-1 font-sans cursor-pointer transition-colors"
        >
          <span className="flex items-center gap-1">
            <Database size={11} className={isOnline ? "text-emerald-400" : "text-amber-400"} />
            Cloud Log Console
          </span>
          <span className="text-[10px] underline font-mono">
            {showLogs ? 'Hide Console' : 'View Core Logs'}
          </span>
        </button>

        <AnimatePresence>
          {showLogs && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mt-2 bg-[#090909] text-indigo-400 p-2.5 rounded-xl font-mono text-[10px] leading-relaxed border border-white/10"
            >
              <div className="flex justify-between items-center text-white/40 border-b border-white/5 pb-1 mb-1.5">
                <span>REPLICATION STATS</span>
                <span className="text-[9px] bg-indigo-500/10 text-indigo-300 px-1 rounded font-bold">SECURE REPLICA</span>
              </div>
              <div className="max-h-24 overflow-y-auto space-y-1 scrollbar-thin">
                {syncingLogs.length === 0 ? (
                  <div className="text-white/30 italic">No sync transactions logged yet.</div>
                ) : (
                  syncingLogs.map((log, index) => (
                    <div key={index} className="flex gap-1 text-white/80">
                      <span className="text-white/30">[{index + 1}]</span>
                      <span className="truncate">{log}</span>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
