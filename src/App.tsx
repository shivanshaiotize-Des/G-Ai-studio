import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  TrendingUp, Send, CheckSquare, ShieldCheck, MessageSquare, 
  Trash2, AlertTriangle, Cloud, CloudOff, FilePlus2, Play, Users, 
  Clock, Sun, Moon, LayoutDashboard, Database, HelpCircle, 
  Printer, X, ChevronRight, Sparkles, FileText, Download, Fingerprint, Scan, ShieldAlert
} from 'lucide-react';

import { SSLogo } from './components/SSLogo';
import { SyncStatus } from './components/SyncStatus';
import { CollaboratorBar } from './components/CollaboratorBar';
import { AnalyticsView } from './components/AnalyticsView';
import { PostComposer } from './components/PostComposer';
import { PostQueue } from './components/PostQueue';
import { BiometricModal } from './components/BiometricModal';
import { 
  Post, SocialPlatform, PostStatus, Role, Comment, 
  Collaborator, Notification, PlatformMetric 
} from './types';

// Preset mock collaborators
const MOCK_COLLABORATORS: Collaborator[] = [
  {
    id: 'c1',
    name: 'Sarah Jenkins',
    role: 'creator',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120',
  },
  {
    id: 'c2',
    name: 'David Chen',
    role: 'approver',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120',
  },
  {
    id: 'c3',
    name: 'Liam McDonald',
    role: 'client',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=120',
  },
  {
    id: 'c4',
    name: 'Emily Watson',
    role: 'admin',
    avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=120',
  },
];

const INITIAL_METRICS: PlatformMetric[] = [
  { platform: 'twitter', followers: 32400, followersGrowth: 4.8, engagementRate: 2.4, reach: 145000, postsCount: 14 },
  { platform: 'linkedin', followers: 15100, followersGrowth: 15.2, engagementRate: 5.8, reach: 62000, postsCount: 9 },
  { platform: 'instagram', followers: 54900, followersGrowth: 8.5, engagementRate: 4.1, reach: 250500, postsCount: 22 },
  { platform: 'facebook', followers: 22000, followersGrowth: 1.1, engagementRate: 1.8, reach: 88000, postsCount: 6 },
  { platform: 'tiktok', followers: 110500, followersGrowth: 22.1, engagementRate: 8.9, reach: 480000, postsCount: 15 },
];

const PRESET_POSTS: Post[] = [
  {
    id: 'p1',
    content: "We are thrilled to unveil our new strategic branding framework today. Built on geometric visual nodes representing multi-platform synergy, precision distribution, and micro-approval workflows. Excited to push the design boundaries! #DesignSystems #Innovation #Branding",
    platforms: ['twitter', 'linkedin', 'instagram'],
    scheduledDate: new Date(Date.now() + 86400000).toLocaleString(), // tomorrow
    status: 'pending',
    comments: [
      {
        id: 'co1',
        author: 'Sarah Jenkins',
        authorRole: 'creator',
        text: 'I optimized the copy spacing! Ready for Director sign-off.',
        createdAt: '5/30/2026, 2:10:14 PM'
      }
    ],
    approvalHistory: [
      {
        status: 'draft',
        user: 'Sarah Jenkins',
        role: 'creator',
        date: '5/30/2026, 2:05:00 PM'
      },
      {
        status: 'pending',
        user: 'Sarah Jenkins',
        role: 'creator',
        date: '5/30/2026, 2:10:14 PM'
      }
    ],
    createdAt: '5/30/2026, 2:05:00 PM',
    author: 'Sarah Jenkins',
    isSyncedToCloud: true
  },
  {
    id: 'p2',
    content: "Workflow automation shouldn't compromise artistic intent. Elevate your brand matrix with one-click multi-post mechanics and intuitive team feedback cycles. Explore the digital playground.",
    platforms: ['linkedin', 'facebook'],
    scheduledDate: new Date(Date.now() - 3600000 * 2).toLocaleString(), // 2 hours ago
    status: 'published',
    comments: [
      {
        id: 'co2',
        author: 'David Chen',
        authorRole: 'approver',
        text: 'This reads exceptionally well. Signed off.',
        createdAt: '5/30/2026, 11:30:11 AM'
      }
    ],
    approvalHistory: [
      {
        status: 'pending',
        user: 'Sarah Jenkins',
        role: 'creator',
        date: '5/30/2026, 11:15:22 AM'
      },
      {
        status: 'approved',
        user: 'David Chen',
        role: 'approver',
        date: '5/30/2026, 11:30:11 AM'
      },
      {
        status: 'published',
        user: 'Emily Watson',
        role: 'admin',
        date: '5/30/2026, 11:45:00 AM'
      }
    ],
    createdAt: '5/30/2026, 11:15:22 AM',
    author: 'Sarah Jenkins',
    isSyncedToCloud: true
  },
  {
    id: 'p3',
    content: "Micro-moments shape macro reputations. Make sure you optimize platform distribution. Double tap to support and comment below!",
    platforms: ['instagram', 'tiktok'],
    scheduledDate: new Date(Date.now() + 3600000 * 6).toLocaleString(), // 6 hours later
    status: 'approved',
    comments: [],
    approvalHistory: [
      {
        status: 'approved',
        user: 'Liam McDonald',
        role: 'client',
        date: '5/30/2026, 3:00:22 PM'
      }
    ],
    createdAt: '5/30/2026, 2:40:00 PM',
    author: 'Sarah Jenkins',
    isSyncedToCloud: true
  }
];

export default function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [currentCollaborator, setCurrentCollaborator] = useState<Collaborator>(MOCK_COLLABORATORS[0]);
  const [posts, setPosts] = useState<Post[]>(PRESET_POSTS);
  const [platformMetrics, setPlatformMetrics] = useState<PlatformMetric[]>(INITIAL_METRICS);
  
  // Backups and connection states
  const [isOnline, setIsOnline] = useState(true);
  const [syncLogs, setSyncLogs] = useState<string[]>([]);
  const [lastBackupTime, setLastBackupTime] = useState<string | null>("5/30/2026, 4:00:00 PM");

  // Authentication gate actions
  const [isBiometricOpen, setIsBiometricOpen] = useState(false);
  const [biometricActionName, setBiometricActionName] = useState('');
  const [biometricCallback, setBiometricCallback] = useState<(() => void) | null>(null);

  // PDF report export states
  const [isExportingPDF, setIsExportingPDF] = useState(false);
  const [pdfGenerationProgress, setPdfGenerationProgress] = useState(0);
  const [showPdfOverlay, setShowPdfOverlay] = useState(false);

  // Core notifications array
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 'n1',
      type: 'approval_request',
      text: 'Pending Task: "Strategic branding framework" submitted by Sarah Jenkins requires your approval.',
      isRead: false,
      postId: 'p1',
      createdAt: 'Today, 2:10 PM'
    },
    {
      id: 'n2',
      type: 'approved',
      text: 'Workflow Alert: "Micro-moments shape reputation" approved by Client Liam McDonald.',
      isRead: false,
      postId: 'p3',
      createdAt: 'Today, 3:00 PM'
    }
  ]);

  // Load cloud posts database backup on boot
  useEffect(() => {
    fetchCloudDatabase();
    logTransaction("Core system booted. Tracking multi-channel portfolios.");
  }, []);

  const fetchCloudDatabase = async () => {
    try {
      const response = await fetch("/api/posts");
      if (response.ok) {
        const data = await response.json();
        if (data.posts && data.posts.length > 0) {
          setPosts(data.posts);
          logTransaction("Cloud database master ledger restored successfully.");
        } else {
          // If server is clean, bake our preset posts directly into cloud data to start with style!
          saveToCloudDatabase(PRESET_POSTS);
        }
      }
    } catch (err) {
      logTransaction("Cloud database offline. Initializing local database cache fallback.");
    }
  };

  const saveToCloudDatabase = async (updatedPosts: Post[]) => {
    if (!isOnline) {
      logTransaction(`Connection offline. Buffered ${updatedPosts.filter(p => !p.isSyncedToCloud).length} writes to local storage cache.`);
      return;
    }

    try {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ posts: updatedPosts }),
      });
      if (response.ok) {
        const data = await response.json();
        setLastBackupTime(data.timestamp || new Date().toLocaleString());
        logTransaction(`Cloud backup reconciled successfully at ${data.timestamp || new Date().toLocaleTimeString()}`);
      }
    } catch (err) {
      logTransaction("Failed backing up master ledger to cloud host. Retrying in background.");
    }
  };

  const logTransaction = (text: string) => {
    setSyncLogs((prev) => [`[${new Date().toLocaleTimeString()}] ${text}`, ...prev.slice(0, 20)]);
  };

  const toggleConnectionStatus = () => {
    const nextOnlineStatus = !isOnline;
    setIsOnline(nextOnlineStatus);
    
    if (nextOnlineStatus) {
      logTransaction("Cloud connection re-established. Syncing buffered states...");
      // Re-sync posts
      const syncedPosts = posts.map(p => ({ ...p, isSyncedToCloud: true }));
      setPosts(syncedPosts);
      saveToCloudDatabase(syncedPosts);
    } else {
      logTransaction("DISCONNECT: Operating in secure offline buffer storage.");
    }
  };

  // Switch Teammate roles
  const handleSwitchCollaborator = (id: string) => {
    const collab = MOCK_COLLABORATORS.find((c) => c.id === id);
    if (collab) {
      setCurrentCollaborator(collab);
      logTransaction(`Persona altered to: ${collab.name} (Role: ${collab.role.toUpperCase()})`);
    }
  };

  // Add new post content to queue
  const handleAddPost = async (
    content: string, 
    platforms: SocialPlatform[], 
    scheduledDate: string, 
    mediaUrl?: string, 
    mediaName?: string
  ) => {
    const isCreator = currentCollaborator.role === 'creator';
    
    const newPost: Post = {
      id: `p-${Date.now()}`,
      content,
      platforms,
      scheduledDate,
      status: isCreator ? 'pending' : 'approved', // Creators submit for approval, other roles pre-approve
      mediaUrl,
      mediaName,
      comments: [],
      approvalHistory: [
        {
          status: 'draft',
          user: currentCollaborator.name,
          role: currentCollaborator.role,
          date: new Date().toLocaleString()
        },
        ...(isCreator ? [{
          status: 'pending' as PostStatus,
          user: currentCollaborator.name,
          role: currentCollaborator.role,
          date: new Date().toLocaleString(),
          note: 'Submitted for approvals queue.'
        }] : [])
      ],
      createdAt: new Date().toLocaleString(),
      author: currentCollaborator.name,
      isSyncedToCloud: isOnline
    };

    const nextPosts = [newPost, ...posts];
    setPosts(nextPosts);
    saveToCloudDatabase(nextPosts);

    // If submitted as creator, dispatch a team notification
    if (isCreator) {
      const newNotif: Notification = {
        id: `n-${Date.now()}`,
        type: 'approval_request',
        text: `Approval Task: New draft submitted by Sarah Jenkins targeted to [${platforms.join(', ').toUpperCase()}].`,
        isRead: false,
        postId: newPost.id,
        createdAt: 'Just now'
      };
      setNotifications([newNotif, ...notifications]);
    }

    logTransaction(`Draft posted to queue. Target slots: ${scheduledDate}`);
  };

  // Approve a post (Secure with biometrics)
  const handleApprovePost = (postId: string) => {
    const targetPost = posts.find(p => p.id === postId);
    if (!targetPost) return;

    setBiometricActionName(`Securing approval for post: "${targetPost.content.slice(0, 36)}..."`);
    setBiometricCallback(() => () => {
      const nextPosts = posts.map((post) => {
        if (post.id === postId) {
          const updatedHistory = [
            ...post.approvalHistory,
            {
              status: 'approved' as PostStatus,
              user: currentCollaborator.name,
              role: currentCollaborator.role,
              date: new Date().toLocaleString(),
              note: 'Signed off via Biometric Verification Gate.'
            }
          ];
          return {
            ...post,
            status: 'approved' as PostStatus,
            approvalHistory: updatedHistory
          };
        }
        return post;
      });

      setPosts(nextPosts);
      saveToCloudDatabase(nextPosts);

      // Create notification
      const newNotif: Notification = {
        id: `n-${Date.now()}`,
        type: 'approved',
        text: `Content approved: Director ${currentCollaborator.name} signed off on post draft.`,
        isRead: false,
        postId: postId,
        createdAt: 'Just now'
      };
      setNotifications([newNotif, ...notifications]);
      logTransaction(`Workflow approved for ID #${postId.slice(-4)}`);
    });

    setIsBiometricOpen(true);
  };

  // Reject / Request revision with comment notes
  const handleRejectPost = (postId: string, note: string) => {
    const nextPosts = posts.map((post) => {
      if (post.id === postId) {
        const updatedHistory = [
          ...post.approvalHistory,
          {
            status: 'draft' as PostStatus,
            user: currentCollaborator.name,
            role: currentCollaborator.role,
            date: new Date().toLocaleString(),
            note: `Revision Requested: "${note}"`
          }
        ];
        return {
          ...post,
          status: 'draft' as PostStatus,
          approvalHistory: updatedHistory
        };
      }
      return post;
    });

    setPosts(nextPosts);
    saveToCloudDatabase(nextPosts);

    // Create custom notification alert
    const newNotif: Notification = {
      id: `n-${Date.now()}`,
      type: 'comment',
      text: `Revision Required: "${note}" requested by ${currentCollaborator.name}`,
      isRead: false,
      postId: postId,
      createdAt: 'Just now'
    };
    setNotifications([newNotif, ...notifications]);
    logTransaction(`Revision requested on ID #: ${postId.slice(-4)}`);
  };

  // Single click Publish core live simulator
  const handlePublishPost = (postId: string) => {
    const nextPosts = posts.map((post) => {
      if (post.id === postId) {
        const updatedHistory = [
          ...post.approvalHistory,
          {
            status: 'published' as PostStatus,
            user: currentCollaborator.name,
            role: currentCollaborator.role,
            date: new Date().toLocaleString(),
            note: 'One-Click Broadcast Transmitted Live.'
          }
        ];
        return {
          ...post,
          status: 'published' as PostStatus,
          approvalHistory: updatedHistory
        };
      }
      return post;
    });

    setPosts(nextPosts);
    saveToCloudDatabase(nextPosts);

    // Increment metrics posts counts for visuals feedback
    const targetPost = posts.find(p => p.id === postId);
    if (targetPost) {
      const nextMetrics = platformMetrics.map((met) => {
        if (targetPost.platforms.includes(met.platform)) {
          return {
            ...met,
            postsCount: met.postsCount + 1,
            reach: met.reach + Math.floor(Math.random() * 450 + 100)
          };
        }
        return met;
      });
      setPlatformMetrics(nextMetrics);
    }

    logTransaction(`One-Click Live Broadcast Broadcasted Successfully!`);
  };

  const handleDeletePost = (postId: string) => {
    const nextPosts = posts.filter(p => p.id !== postId);
    setPosts(nextPosts);
    saveToCloudDatabase(nextPosts);
    logTransaction(`Post ID #${postId.slice(-4)} deleted from schedule queue.`);
  };

  // Workflow timeline feedback comment
  const handleAddComment = (postId: string, commentText: string) => {
    const nextPosts = posts.map((post) => {
      if (post.id === postId) {
        const newComment: Comment = {
          id: `co-${Date.now()}`,
          author: currentCollaborator.name,
          authorRole: currentCollaborator.role,
          text: commentText,
          createdAt: new Date().toLocaleString()
        };
        return {
          ...post,
          comments: [...post.comments, newComment]
        };
      }
      return post;
    });

    setPosts(nextPosts);
    saveToCloudDatabase(nextPosts);
    logTransaction(`Workflow comment submitted.`);
  };

  // Notifications mechanics
  const handleMarkNotifRead = (notifId: string) => {
    setNotifications(notifications.map(n => n.id === notifId ? { ...n, isRead: true } : n));
  };

  const handleClearAllNotifications = () => {
    setNotifications([]);
  };

  // Core PDF Export system (With simulated progress and printable cover preview!)
  const triggerPDFExportFlow = () => {
    setBiometricActionName("Securing biometric approval to compile & export financial data PDF report");
    setBiometricCallback(() => () => {
      setIsExportingPDF(true);
      setPdfGenerationProgress(0);
      
      const interval = setInterval(() => {
        setPdfGenerationProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsExportingPDF(false);
            setShowPdfOverlay(true);
            return 100;
          }
          return prev + 10;
        });
      }, 200);
    });
    setIsBiometricOpen(true);
  };

  const handleNativePrint = () => {
    window.print();
  };

  return (
    <div id="full-viewport-app" className="min-h-screen bg-[#050505] text-white font-sans flex flex-col relative overflow-x-hidden selection:bg-indigo-500/35 selection:text-white">
      
      {/* Visual background lines representing SocialSphere Control specifications */}
      <div className="fixed inset-0 grid grid-cols-4 md:grid-cols-6 lg:grid-cols-12 pointer-events-none opacity-[0.03] z-0">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="border-r border-white/5 h-full" />
        ))}
      </div>

      {/* Primary Header layout */}
      <header className="h-16 border-b border-white/10 flex items-center justify-between px-6 bg-black/40 backdrop-blur-md z-50 relative text-white">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center font-bold text-xl tracking-tighter shadow-lg shadow-indigo-500/20 text-white select-none">
            SS
          </div>
          <div className="h-6 w-px bg-white/20"></div>
          <h1 className="text-sm font-bold tracking-widest uppercase text-white/90">SocialSphere Control</h1>
        </div>

        <div className="flex items-center gap-6">
          <div className={`flex items-center gap-2 border px-3 py-1 rounded-full transition-all ${
            isOnline 
              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
              : 'bg-amber-500/10 border-amber-500/20 text-amber-500'
          }`}>
            <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`}></div>
            <span className="text-[10px] uppercase font-bold tracking-wider">{isOnline ? 'Cloud Synced' : 'Offline Mode'}</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-[10px] text-white/50 uppercase">Biometric ID</p>
              <p className="text-xs font-semibold uppercase text-white">{currentCollaborator.name}</p>
            </div>
            <div className="w-10 h-10 rounded-full border-2 border-indigo-500/40 p-0.5">
              <img
                src={currentCollaborator.avatarUrl}
                alt={currentCollaborator.name}
                referrerPolicy="no-referrer"
                className="w-full h-full rounded-full object-cover"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Core Body content container */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10 bg-gradient-to-tr from-indigo-950/20 via-black to-purple-950/20 w-full">
        
        {/* Alerts for Offline state to notify user about cache mechanics */}
        <AnimatePresence>
          {!isOnline && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mb-4 bg-amber-500/10 border border-amber-500/20 text-amber-405 p-3.5 rounded-2xl text-xs flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-2">
                <AlertTriangle size={16} className="text-amber-405 animate-bounce" />
                <div>
                  <span className="font-bold uppercase font-mono tracking-wider">OFFLINE REDUNDANCY MODE:</span>
                  <p className="mt-0.5">Posts created now will cache securely in LocalStorage. Automatic sync begins instantly once connection is switched back on.</p>
                </div>
              </div>
              <button 
                onClick={toggleConnectionStatus}
                className="bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold px-3 py-1.5 rounded-xl text-[11px] uppercase transition-colors"
              >
                Reconnect Cloud
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dashboard Grid Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left panel column (Controls, sync logs, metrics switch): span 4 */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Teammate Collaborative Approvals Hub */}
            <CollaboratorBar
              currentCollaborator={currentCollaborator}
              allCollaborators={MOCK_COLLABORATORS}
              onSwitchCollaborator={handleSwitchCollaborator}
              notifications={notifications}
              onMarkNotificationRead={handleMarkNotifRead}
              onClearAllNotifications={handleClearAllNotifications}
              onSelectPostFromNotification={(id) => {
                logTransaction(`Focused stream on update ID: #${id.slice(-4)}`);
              }}
            />

            {/* Offline sync monitor status ledger */}
            <SyncStatus
              isOnline={isOnline}
              onToggleConnection={toggleConnectionStatus}
              pendingSyncCount={posts.filter((p) => !p.isSyncedToCloud).length}
              syncingLogs={syncLogs}
              lastBackupTime={lastBackupTime}
              onManualSync={() => {
                logTransaction("Forced manual sync initiated...");
                saveToCloudDatabase(posts);
              }}
            />

            {/* Platform metrics panel breakdown */}
            <AnalyticsView
              platformMetrics={platformMetrics}
              onTriggerPDFExport={triggerPDFExportFlow}
              isExportingPDF={isExportingPDF}
              isOnline={isOnline}
              totalPendingPostCount={posts.filter(p => p.status === 'pending').length}
            />

          </div>

          {/* Right panel column (Post Composer, Real-time queue view): span 8 */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Interactive Composer box */}
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 px-1.5">
                <span className="h-2 w-2 rounded-full bg-indigo-550" />
                <h3 className="text-xs font-bold font-mono tracking-wider uppercase text-white/40">
                  Cross-Platform Post Workspace
                </h3>
              </div>
              <PostComposer
                onAddPost={handleAddPost}
                currentUserRole={currentCollaborator.role}
                isOnline={isOnline}
              />
            </div>

            {/* Queue flow lists */}
            <div className="space-y-3">
              <div className="flex items-center gap-1.5 px-1.5 justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-indigo-550" />
                  <h3 className="text-xs font-bold font-mono tracking-wider uppercase text-white/40">
                    Scheduled Broadcast / Review Queue
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-white/40">
                  Total Managed Posts: {posts.length}
                </span>
              </div>
              
              <PostQueue
                posts={posts}
                currentUser={currentCollaborator}
                isOnline={isOnline}
                onApprovePost={handleApprovePost}
                onRejectPost={handleRejectPost}
                onPublishPost={handlePublishPost}
                onDeletePost={handleDeletePost}
                onAddComment={handleAddComment}
              />
            </div>

          </div>

        </div>
      </main>

      {/* PDF Generation Loader Animation */}
      <AnimatePresence>
        {isExportingPDF && (
          <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#0d0d0d] border border-white/10 p-6 rounded-3xl w-full max-w-sm text-center shadow-2xl text-white"
            >
              <Loader2 className="animate-spin text-indigo-400 mx-auto mb-4" size={36} />
              <h3 className="font-bold text-white mb-1">Generating PDF Document</h3>
              <p className="text-xs text-white/60 mb-4">Reconciling master analytics with cloud ledger...</p>
              
              {/* Progress bar */}
              <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 h-full transition-all duration-300" style={{ width: `${pdfGenerationProgress}%` }} />
              </div>
              <span className="text-[10px] font-mono text-white/40 mt-2 block uppercase">
                Progress: {pdfGenerationProgress}% Cryptographic checkout
              </span>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 🚀 GORGEOUS INTERACTIVE PDF REPORT OVERLAY SCREEN (PRINT-READY COVER PAGE & DATA SUMMARY SHEET) */}
      <AnimatePresence>
        {showPdfOverlay && (
          <div className="fixed inset-0 overflow-y-auto bg-stone-950/90 backdrop-blur-md z-50 p-4 min-h-screen">
            <div className="max-w-4xl mx-auto py-10">
              
              {/* Command controls layout (Unprintable in native print via @media print) */}
              <div className="flex justify-between items-center bg-stone-900 text-white p-3 rounded-t-2xl border-l border-r border-t border-stone-800 print:hidden">
                <div className="flex items-center gap-2">
                  <div className="p-1 bg-amber-500 rounded">
                    <FileText size={16} className="text-stone-950" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-amber-400">PDF VECTOR SUMMARY REPLICATED</span>
                    <p className="text-[10.5px] text-stone-400">Ready for paper printing or file storage download</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleNativePrint}
                    className="cursor-pointer bg-amber-500 text-stone-950 hover:bg-amber-600 font-bold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1 transition-all"
                  >
                    <Printer size={13} />
                    Execute Print View / Export
                  </button>
                  
                  <button
                    onClick={() => setShowPdfOverlay(false)}
                    className="cursor-pointer bg-stone-800 hover:bg-stone-750 p-2 rounded-xl text-stone-400 hover:text-white"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>

              {/* Printable PDF Content canvas */}
              <div id="pdf-printable-body" className="bg-[#FAF8F2] text-[#1C1A17] p-10 shadow-2xl rounded-b-2xl print:rounded-none min-h-[1100px] border border-stone-200 select-text font-serif">
                
                {/* Cover header block */}
                <div className="border-b-2 border-[#1C1A17] pb-8 mb-8 flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <SSLogo size={42} />
                      <span className="font-sans font-bold tracking-widest text-xs uppercase text-[#B85C38]">
                        BRAND PORTFOLIO ENGINE
                      </span>
                    </div>
                    <h1 className="text-3xl font-bold font-sans tracking-tight text-[#1C1A17]">
                      Synergy Social Post Analytics
                    </h1>
                    <p className="text-xs text-stone-500 font-sans mt-1">
                      Quarterly Audit Report &bull; Reconciled at {new Date().toLocaleString()}
                    </p>
                  </div>

                  <div className="text-right font-sans text-xs">
                    <span className="font-bold text-[#1C1A17] block">SS DISTRIBUTION SERVICES INC.</span>
                    <span className="text-stone-500 block">System Signature: Secure API Checksum</span>
                    <span className="text-[10px] text-stone-400 font-mono">REPLICA-UUID-{Date.now().toString().slice(-6)}</span>
                  </div>
                </div>

                {/* Cover executive synopsis */}
                <div className="mb-8 p-4 bg-stone-100 rounded-xl border border-stone-200">
                  <h4 className="font-sans font-bold text-xs uppercase text-[#B85C38] mb-1">Executive Summary</h4>
                  <p className="text-xs leading-relaxed text-[#1C1A17]">
                    This certified data index maps cross-platform engagement performance. It highlights weekly click cycles, aggregate community followers expansion rates, and certified content queue states. Reconciliations show consistent **12.4%** active campaign growth loops.
                  </p>
                </div>

                {/* Sub audit metrics grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  <div className="border-l-2 border-[#B85C38] pl-3.5">
                    <span className="text-[9px] uppercase font-sans text-stone-550 block">Aggregate Followers</span>
                    <strong className="text-lg font-sans text-[#1C1A17]">{INITIAL_METRICS.reduce((sum, item) => sum + item.followers, 0).toLocaleString()}</strong>
                  </div>
                  <div className="border-l-2 border-[#B85C38] pl-3.5">
                    <span className="text-[9px] uppercase font-sans text-stone-550 block">Active Reach Scope</span>
                    <strong className="text-lg font-sans text-[#1C1A17]">{INITIAL_METRICS.reduce((sum, item) => sum + item.reach, 0).toLocaleString()}</strong>
                  </div>
                  <div className="border-l-2 border-[#B85C38] pl-3.5">
                    <span className="text-[9px] uppercase font-sans text-stone-550 block">Audit Queue Posts</span>
                    <strong className="text-lg font-sans text-[#1C1A17]">{posts.length} entries</strong>
                  </div>
                  <div className="border-l-2 border-[#B85C38] pl-3.5">
                    <span className="text-[9px] uppercase font-sans text-stone-550 block">Verification Authority</span>
                    <strong className="text-lg font-sans text-emerald-700">Biometric Verified</strong>
                  </div>
                </div>

                {/* Audit Grid breakdown */}
                <div className="mb-8">
                  <h3 className="font-sans font-bold text-sm uppercase tracking-wider text-[#1C1A17] mb-3.5 border-b border-stone-300 pb-1.5">
                    1. Channel Metric Breakdown
                  </h3>
                  <table className="w-full text-left text-[11px] font-sans">
                    <thead>
                      <tr className="border-b border-stone-300 text-stone-450 uppercase font-bold">
                        <th className="py-2">Platform Connection</th>
                        <th className="py-2 text-right">Followers Count</th>
                        <th className="py-2 text-right">Engagement Quotient</th>
                        <th className="py-2 text-right">Weekly Reach Estimate</th>
                        <th className="py-2 text-right">Total Dispatches</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-200">
                      {platformMetrics.map((item) => (
                        <tr key={item.platform}>
                          <td className="py-2.5 font-bold uppercase">{item.platform}</td>
                          <td className="py-2.5 text-right font-medium">{item.followers.toLocaleString()}</td>
                          <td className="py-2.5 text-right font-bold text-[#B85C38]">{item.engagementRate.toFixed(1)}%</td>
                          <td className="py-2.5 text-right font-medium">{item.reach.toLocaleString()}</td>
                          <td className="py-2.5 text-right text-stone-500">{item.postsCount} posts</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Active queue reports list within PDF */}
                <div>
                  <h3 className="font-sans font-bold text-sm uppercase tracking-wider text-[#1C1A17] mb-3.5 border-b border-stone-300 pb-1.5">
                    2. Active Post Queue Audit Trails
                  </h3>
                  <div className="space-y-4 font-sans text-[11px] leading-relaxed">
                    {posts.map((post, index) => (
                      <div key={post.id} className="border border-stone-300 p-3 rounded-lg bg-stone-50">
                        <div className="flex justify-between font-bold text-stone-600 mb-1">
                          <span>Audit Record #{index+1} &bull; Platforms: [{post.platforms.join(', ').toUpperCase()}]</span>
                          <span className="uppercase text-[#B85C38] font-mono">{post.status}</span>
                        </div>
                        <p className="text-stone-800 italic select-text">"{post.content}"</p>
                        <div className="mt-2 text-[10px] text-stone-400 text-right">
                          Created by: {post.author} &bull; Scheduled Target Slots: {post.scheduledDate}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer disclaimer */}
                <div className="border-t border-stone-300 pt-6 mt-12 text-center text-[10px] text-stone-400 font-sans">
                  <span>Standard legal disclaimer: This statement is system verified as an authentic production index. Encryption details verified with biometric checkout parameters.</span>
                  <p className="mt-1">&copy; 2026 SS Social Systems Distribution Corp. All licenses active.</p>
                </div>

              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Security Biometrics authentication Modal gate */}
      <BiometricModal
        isOpen={isBiometricOpen}
        onClose={() => {
          setIsBiometricOpen(false);
          setBiometricCallback(null);
        }}
        onSuccess={() => {
          if (biometricCallback) {
            biometricCallback();
            setBiometricCallback(null);
          }
        }}
        actionName={biometricActionName}
      />
    </div>
  );
}

interface Loader2Props extends React.SVGProps<SVGSVGElement> {
  size?: number;
}
const Loader2: React.FC<Loader2Props> = ({ size = 24, className = '', ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`animate-spin ${className}`}
    {...props}
  >
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);
