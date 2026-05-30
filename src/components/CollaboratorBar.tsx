import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Users, Bell, ChevronDown, Check, ShieldAlert, Award, UserCheck, MessageSquarePlus } from 'lucide-react';
import { Role, Collaborator, Notification } from '../types';

interface CollaboratorBarProps {
  currentCollaborator: Collaborator;
  allCollaborators: Collaborator[];
  onSwitchCollaborator: (id: string) => void;
  notifications: Notification[];
  onMarkNotificationRead: (id: string) => void;
  onClearAllNotifications: () => void;
  onSelectPostFromNotification: (postId: string) => void;
}

export const CollaboratorBar: React.FC<CollaboratorBarProps> = ({
  currentCollaborator,
  allCollaborators,
  onSwitchCollaborator,
  notifications,
  onMarkNotificationRead,
  onClearAllNotifications,
  onSelectPostFromNotification,
}) => {
  const [showRoleSelector, setShowRoleSelector] = useState(false);
  const [showNotificationPanel, setShowNotificationPanel] = useState(false);

  const unreadNotifications = notifications.filter((n) => !n.isRead);

  const getRoleBadgeColor = (role: Role) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-500/10 text-purple-300 border-purple-500/10';
      case 'approver':
        return 'bg-indigo-500/10 text-indigo-300 border-indigo-500/10';
      case 'client':
        return 'bg-pink-500/10 text-pink-300 border-pink-500/10';
      case 'creator':
        return 'bg-emerald-500/10 text-emerald-300 border-emerald-500/10';
      default:
        return 'bg-stone-500/10 text-stone-300 border-stone-500/10';
    }
  };

  const getRoleLabel = (role: Role) => {
    switch (role) {
      case 'admin': return 'Admin Lead';
      case 'approver': return 'Internal Director';
      case 'client': return 'Client Stakeholder';
      case 'creator': return 'Content Creator';
    }
  };

  return (
    <div id="collaborator-panel" className="flex items-center justify-between gap-4 p-4 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-xl relative z-40 text-white">
      {/* Current User Display & Selection */}
      <div className="relative">
        <label className="block text-[9px] font-bold font-mono tracking-widest uppercase text-white/40 mb-0.5">
          TEAM ACCESS EMULATOR
        </label>
        <button
          onClick={() => {
            setShowRoleSelector(!showRoleSelector);
            setShowNotificationPanel(false);
          }}
          className="cursor-pointer flex items-center gap-2.5 hover:bg-white/5 p-1.5 rounded-2xl transition-all border border-transparent hover:border-white/10"
        >
          <img
            src={currentCollaborator.avatarUrl}
            alt={currentCollaborator.name}
            referrerPolicy="no-referrer"
            className="w-8 h-8 rounded-full border border-indigo-500/30 object-cover"
          />
          <div className="text-left">
            <div className="flex items-center gap-1.5">
              <span className="font-sans font-semibold text-sm text-white leading-none">
                {currentCollaborator.name}
              </span>
              <ChevronDown size={13} className="text-white/40" />
            </div>
            <span className={`inline-block text-[9px] font-semibold border px-1.5 py-0.5 rounded-md mt-1 leading-none ${getRoleBadgeColor(currentCollaborator.role)}`}>
              {getRoleLabel(currentCollaborator.role)}
            </span>
          </div>
        </button>

        {/* Floating Switch Role Dropdown */}
        <AnimatePresence>
          {showRoleSelector && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowRoleSelector(false)} />
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute left-0 mt-2 w-72 bg-[#0d0d0d] border border-white/10 rounded-2xl shadow-2xl z-50 p-4 text-white"
              >
                <div className="px-1 pb-2 border-b border-white/5 mb-1.5">
                  <span className="text-[10px] font-bold font-mono tracking-widest text-white/40 uppercase">
                    SWITCH LOGIN EXPERIENCE
                  </span>
                  <p className="text-[11px] text-white/60 mt-0.5">
                    Toggle personas to test role-restricted content approvals.
                  </p>
                </div>
                <div className="space-y-1 max-h-64 overflow-y-auto">
                  {allCollaborators.map((collab) => {
                    const isSelected = collab.id === currentCollaborator.id;
                    return (
                      <button
                        key={collab.id}
                        onClick={() => {
                          onSwitchCollaborator(collab.id);
                          setShowRoleSelector(false);
                        }}
                        className={`cursor-pointer w-full flex items-center justify-between p-2 rounded-xl text-left transition-colors ${
                          isSelected
                            ? 'bg-indigo-650/40 text-indigo-200 border border-indigo-500/20'
                            : 'hover:bg-white/5 text-white/80'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <img
                            src={collab.avatarUrl}
                            alt={collab.name}
                            referrerPolicy="no-referrer"
                            className="w-7 h-7 rounded-full border border-white/10 object-cover"
                          />
                          <div>
                            <p className="text-xs font-semibold text-white leading-tight">
                              {collab.name}
                            </p>
                            <span className={`inline-block text-[8px] font-medium border px-1 rounded mt-0.5 leading-none ${getRoleBadgeColor(collab.role)}`}>
                              {getRoleLabel(collab.role)}
                            </span>
                          </div>
                        </div>
                        {isSelected && (
                          <div className="h-5 w-5 bg-indigo-600 rounded-full flex items-center justify-center text-white">
                            <Check size={11} className="stroke-[3]" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      {/* Notifications Hub Bell */}
      <div className="relative">
        <button
          onClick={() => {
            setShowNotificationPanel(!showNotificationPanel);
            setShowRoleSelector(false);
          }}
          className="cursor-pointer relative p-2.5 bg-white/5 hover:bg-white/10 rounded-full text-white/80 hover:text-white transition-all border border-white/10"
        >
          <Bell size={18} className={unreadNotifications.length > 0 ? "animate-wiggle" : ""} />
          {unreadNotifications.length > 0 && (
            <span className="absolute top-0 right-0 h-4 min-w-4 px-1 flex items-center justify-center text-[9px] font-bold text-white bg-indigo-600 rounded-full border border-[#0d0d0d] shadow-sm leading-none">
              {unreadNotifications.length}
            </span>
          )}
        </button>

        {/* Notifications Dropdown Panel (Task Approvals Notifications) */}
        <AnimatePresence>
          {showNotificationPanel && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowNotificationPanel(false)} />
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-2 w-80 bg-[#0d0d0d] border border-white/10 rounded-2xl shadow-xl z-50 p-4 text-white"
              >
                <div className="flex items-center justify-between border-b border-white/5 pb-2 mb-2">
                  <div>
                    <span className="text-[10px] font-bold font-mono tracking-widest text-white/40 uppercase">
                      PENDING TASK ALERTS
                    </span>
                    <p className="text-[11px] text-white/60 mt-0.5">
                      Automated team signaling
                    </p>
                  </div>
                  {notifications.length > 0 && (
                    <button
                      onClick={onClearAllNotifications}
                      className="text-[10px] text-indigo-400 hover:underline cursor-pointer font-medium"
                    >
                      Clear all
                    </button>
                  )}
                </div>

                <div className="space-y-1.5 max-h-72 overflow-y-auto pr-0.5 scrollbar-thin">
                  {notifications.length === 0 ? (
                    <div className="text-center py-6 text-white/40 flex flex-col items-center gap-1.5">
                      <Bell size={24} className="opacity-40" />
                      <p className="text-xs">No pending tasks or workflow alerts.</p>
                    </div>
                  ) : (
                    notifications.map((notif) => (
                      <div
                        key={notif.id}
                        onClick={() => {
                          if (notif.postId) {
                            onSelectPostFromNotification(notif.postId);
                          }
                          onMarkNotificationRead(notif.id);
                          setShowNotificationPanel(false);
                        }}
                        className={`group p-2.5 rounded-xl border transition-colors cursor-pointer text-left relative ${
                          notif.isRead
                            ? 'bg-transparent border-transparent text-white/40 hover:bg-white/5'
                            : 'bg-indigo-500/[0.04] border-indigo-500/10 hover:bg-indigo-500/[0.08]'
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          <span className={`mt-0.5 h-2 w-2 rounded-full flex-shrink-0 ${
                            notif.isRead ? 'bg-transparent' : 'bg-indigo-400'
                          }`} />
                          <div className="flex-1 pr-1">
                            <p className="text-xs font-semibold leading-tight text-white/90">
                              {notif.text}
                            </p>
                            <span className="text-[9px] font-mono text-white/40 mt-1 block">
                              {notif.createdAt}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
