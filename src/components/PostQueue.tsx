import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar, Check, X, ShieldCheck, CornerDownRight, MessageSquare, 
  Trash2, AlertTriangle, Cloud, CloudOff, FilePlus2, Play, Users, Clock
} from 'lucide-react';
import { Post, SocialPlatform, PostStatus, Role, Comment, Collaborator } from '../types';

interface PostQueueProps {
  posts: Post[];
  currentUser: Collaborator;
  isOnline: boolean;
  onApprovePost: (postId: string) => void;
  onRejectPost: (postId: string, note: string) => void;
  onPublishPost: (postId: string) => void;
  onDeletePost: (postId: string) => void;
  onAddComment: (postId: string, commentText: string) => void;
}

export const PostQueue: React.FC<PostQueueProps> = ({
  posts,
  currentUser,
  isOnline,
  onApprovePost,
  onRejectPost,
  onPublishPost,
  onDeletePost,
  onAddComment,
}) => {
  const [activeTab, setActiveTab] = useState<PostStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [platformFilter, setPlatformFilter] = useState<SocialPlatform | 'all'>('all');
  
  // Interactive comment expansion state
  const [expandedCommentsPostId, setExpandedCommentsPostId] = useState<string | null>(null);
  const [newCommentText, setNewCommentText] = useState('');

  // Rejection note active input
  const [activeRejectionPostId, setActiveRejectionPostId] = useState<string | null>(null);
  const [rejectionNote, setRejectionNote] = useState('');

  // Filter posts
  const filteredPosts = posts.filter((post) => {
    const matchesSearch = post.content.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          post.author.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = activeTab === 'all' || post.status === activeTab;
    
    const matchesPlatform = platformFilter === 'all' || post.platforms.includes(platformFilter);

    return matchesSearch && matchesStatus && matchesPlatform;
  });

  const getStatusBadgeClass = (status: PostStatus) => {
    switch (status) {
      case 'published':
        return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/10';
      case 'approved':
        return 'bg-teal-500/15 text-teal-450 border-teal-500/10';
      case 'pending':
        return 'bg-amber-500/15 text-amber-400 border-amber-500/10 animate-pulse';
      case 'draft':
        return 'bg-white/10 text-white/50 border-white/10';
    }
  };

  const getPlatformLabelColor = (platform: SocialPlatform) => {
    switch (platform) {
      case 'twitter': return 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/20';
      case 'linkedin': return 'bg-blue-600/20 text-blue-400 border border-blue-500/20';
      case 'instagram': return 'bg-pink-600/20 text-pink-400 border border-pink-500/20';
      case 'facebook': return 'bg-blue-700/20 text-blue-500 border border-blue-600/20';
      case 'tiktok': return 'bg-[#0a0a0a] text-white border border-white/10';
    }
  };

  const handlePublishClick = (postId: string) => {
    onPublishPost(postId);
  };

  return (
    <div id="queue-container" className="space-y-4 text-white">
      {/* Filtering Navigation Ribbon */}
      <div className="bg-white/5 border border-white/10 rounded-3xl p-4 backdrop-blur-xl transition-all duration-300">
        
        {/* Search & Platform Filter row */}
        <div className="flex flex-col md:flex-row gap-3 mb-4">
          <div className="flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search strategic content drafts, team creators..."
              className="w-full px-3.5 py-2.5 bg-[#0a0a0a] text-white border border-white/10 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-550/50 focus:border-indigo-550 text-xs placeholder-white/30"
            />
          </div>

          <div className="flex items-center gap-2">
            <label className="text-[10px] font-bold font-mono text-white/40 uppercase tracking-wider">
              PLATFORM:
            </label>
            <select
              value={platformFilter}
              onChange={(e) => setPlatformFilter(e.target.value as SocialPlatform | 'all')}
              className="bg-[#0a0a0a] border border-white/10 rounded-xl px-3 py-2 text-xs font-semibold text-white focus:outline-none"
            >
              <option value="all">ALL STATIONS</option>
              <option value="twitter">X / TWITTER</option>
              <option value="linkedin">LINKEDIN</option>
              <option value="instagram">INSTAGRAM</option>
              <option value="facebook">FACEBOOK</option>
              <option value="tiktok">TIKTOK</option>
            </select>
          </div>
        </div>

        {/* Workflow State Tab Selection (Multi-approved tracks) */}
        <div className="flex bg-white/5 p-1 rounded-xl border border-white/10 overflow-x-auto list-none scrollbar-none">
          {(['all', 'pending', 'approved', 'published', 'draft'] as const).map((tab) => {
            const isSelected = activeTab === tab;
            const count = posts.filter(p => tab === 'all' || p.status === tab).length;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`cursor-pointer flex-1 text-center py-2 px-2.5 text-xs font-semibold rounded-lg uppercase tracking-wider transition-all whitespace-nowrap leading-none flex items-center justify-center gap-1.5 ${
                  isSelected
                    ? 'bg-indigo-650 text-white font-bold shadow-sm'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                {tab}
                <span className={`px-1.5 py-0.5 text-[9px] rounded-full transition-all ${
                  isSelected
                    ? 'bg-indigo-500/20 text-indigo-300 font-bold'
                    : 'bg-white/10 text-white/50'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Stream Queue List */}
      <div className="space-y-3.5 animate-none">
        {filteredPosts.length === 0 ? (
          <div className="bg-white/5 border border-white/10 rounded-3xl p-10 text-center text-white/40">
            <Calendar size={36} className="mx-auto mb-2 opacity-50 text-indigo-400" />
            <h4 className="font-semibold text-white/90 text-sm">No scheduled updates found</h4>
            <p className="text-xs mt-0.5 text-white/40">Adjust filter presets or schedule a new broadcast caption above.</p>
          </div>
        ) : (
          filteredPosts.map((post) => {
            const isCommentsExpanded = expandedCommentsPostId === post.id;
            const isRejectionActive = activeRejectionPostId === post.id;

            return (
              <motion.div
                key={post.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/5 border border-white/10 rounded-3xl p-5 shadow-sm relative transition-all duration-300 hover:border-white/20 text-white"
              >
                {/* Offline Cache Status Flag Indicator */}
                {!post.isSyncedToCloud && (
                  <div className="absolute top-4 right-4 bg-amber-500/15 text-amber-400 border border-amber-500/10 px-2 py-0.5 rounded-md text-[9px] font-bold tracking-wider uppercase flex items-center gap-1">
                    <CloudOff size={10} />
                    Cached Offline
                  </div>
                )}

                {/* Status and platforms metadata header */}
                <div className="flex flex-wrap items-center gap-2 mb-3 pr-24">
                  <span className={`px-2.5 py-1 text-[10px] font-bold border rounded-lg uppercase tracking-wider ${getStatusBadgeClass(post.status)}`}>
                    {post.status}
                  </span>

                  {post.platforms.map((plat) => (
                    <span
                      key={plat}
                      className={`px-2 py-0.5 rounded-md text-[9.5px] font-bold font-mono tracking-wider uppercase ${getPlatformLabelColor(plat)}`}
                    >
                      {plat}
                    </span>
                  ))}
                </div>

                {/* Main Content text draft */}
                <p className="text-white text-sm leading-relaxed whitespace-pre-wrap mb-4 font-sans font-normal border-l-2 border-indigo-500/30 pl-3">
                  {post.content}
                </p>

                {/* Media Attachment thumbnail if present */}
                {post.mediaUrl && (
                  <div className="mb-4 relative rounded-2xl overflow-hidden border border-white/10 max-w-sm">
                    <img 
                      src={post.mediaUrl} 
                      alt="attachment preview" 
                      referrerPolicy="no-referrer"
                      className="w-full max-h-48 object-cover object-top hover:scale-[1.01] transition-transform duration-200"
                    />
                    <div className="absolute bottom-2 left-2 bg-[#050505]/80 backdrop-blur-md px-2 py-1 text-[9px] font-mono text-white rounded">
                      {post.mediaName || 'Attached Graphic'}
                    </div>
                  </div>
                )}

                {/* Metadatas: Creator name and Schedule clock time */}
                <div className="flex flex-wrap items-center justify-between gap-3 text-[11px] text-white/50 border-t border-b border-white/5 py-3 mb-3.5">
                  <div className="flex items-center gap-1.5 font-sans">
                    <div className="h-4.5 w-4.5 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-bold uppercase text-white">
                      {post.author.slice(0, 2)}
                    </div>
                    <span>By <strong className="text-white font-bold">{post.author}</strong></span>
                  </div>

                  <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase">
                    <Clock size={12} className="text-white/40" />
                    <span>Slots: <strong className="text-indigo-305 font-bold">{post.scheduledDate}</strong></span>
                  </div>
                </div>

                {/* Interactive State Actions Panel depending on teammate role */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  
                  {/* Switch to show comments trigger */}
                  <button
                    onClick={() => setExpandedCommentsPostId(isCommentsExpanded ? null : post.id)}
                    className="cursor-pointer flex items-center gap-1.5 text-xs font-bold text-white/55 hover:text-white"
                  >
                    <MessageSquare size={14} className={post.comments.length > 0 ? "text-indigo-400 stroke-[2.5]" : "text-white/40"} />
                    Workflow Chat ({post.comments.length})
                  </button>

                  {/* Core Status Triggers */}
                  <div className="flex flex-wrap items-center gap-1.5 justify-end">
                    
                    {/* Delete capability */}
                    <button
                      onClick={() => onDeletePost(post.id)}
                      title="Withdraw update"
                      className="cursor-pointer p-2 bg-white/5 hover:bg-white/10 text-white/40 hover:text-rose-500 rounded-xl transition-colors border border-white/5"
                    >
                      <Trash2 size={13} />
                    </button>

                    {/* APPROVERS / CLIENT / ADMIN ACTUATIONS */}
                    {post.status === 'pending' && (currentUser.role === 'approver' || currentUser.role === 'client' || currentUser.role === 'admin') && (
                      <>
                        <button
                          onClick={() => setActiveRejectionPostId(isRejectionActive ? null : post.id)}
                          className="cursor-pointer px-2.5 py-1.5 text-xs font-bold rounded-xl border border-rose-500/20 text-rose-450 hover:bg-rose-500/5 transition-all text-[11px]"
                        >
                          Request Revision
                        </button>
                        
                        <button
                          onClick={() => onApprovePost(post.id)}
                          className="cursor-pointer px-3.5 py-1.5 text-xs font-bold rounded-xl bg-emerald-600 text-white hover:bg-emerald-750 transition-all flex items-center gap-1 flex-shrink-0"
                        >
                          <ShieldCheck size={13} />
                          Secure Approve
                        </button>
                      </>
                    )}

                    {/* DIRECT EXECUTIVES */}
                    {post.status === 'approved' && (
                      <button
                        onClick={() => handlePublishClick(post.id)}
                        className="cursor-pointer px-4.5 py-2 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white hover:scale-[1.01] active:scale-95 transition-all flex items-center gap-1 flex-shrink-0 shadow shadow-indigo-500/20 uppercase tracking-wide"
                      >
                        <Play size={10} className="fill-white stroke-none" />
                        One-Click Publish Live
                      </button>
                    )}
                  </div>
                </div>

                {/* Sub Rejection inputs box */}
                <AnimatePresence>
                  {isRejectionActive && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden mt-3 pt-3 border-t border-white/5"
                    >
                      <label className="block text-[10px] font-bold font-mono text-white/40 uppercase mb-1">
                        Revision Guidelines / Core Feedback
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={rejectionNote}
                          onChange={(e) => setRejectionNote(e.target.value)}
                          placeholder="e.g. Please crop the attached graphic, or add more hashtags for LinkedIn formatting..."
                          className="flex-1 px-3 py-2 bg-[#0a0a0a] border border-white/10 text-xs text-white rounded-xl focus:outline-none"
                        />
                        <button
                          onClick={() => {
                            if (!rejectionNote.trim()) return;
                            onRejectPost(post.id, rejectionNote);
                            setRejectionNote('');
                            setActiveRejectionPostId(null);
                          }}
                          className="px-3 bg-rose-600 text-white text-xs font-bold rounded-xl hover:bg-rose-700 transition-colors"
                        >
                          Reject Draft
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Expand Comments Chat Timeline Section */}
                <AnimatePresence>
                  {isCommentsExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden mt-4 pt-4 border-t border-white/5 space-y-3.5"
                    >
                      <div className="flex items-center gap-2 justify-between">
                        <span className="text-[10px] font-bold font-mono tracking-wider text-indigo-300 uppercase flex items-center gap-1">
                          <Users size={12} />
                          Feedback / Collaborative Log Timeline
                        </span>
                        <span className="text-[9px] font-mono text-white/40">AUDITED LOG</span>
                      </div>

                      {/* Custom Audit Timeline list */}
                      <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
                        {post.comments.length === 0 ? (
                           <p className="text-xs text-white/40 italic py-2">
                            No team comments logged yet. Use the timeline tool below to add feedback.
                          </p>
                        ) : (
                          post.comments.map((comment) => (
                            <div key={comment.id} className="flex gap-2 text-xs leading-relaxed">
                              <div className="h-6 w-6 rounded-full bg-white/10 flex items-center justify-center font-bold text-[9px] uppercase flex-shrink-0 text-white">
                                {comment.author.slice(0, 2)}
                              </div>
                              <div className="bg-white/5 border border-white/5 p-3 rounded-2xl flex-1 text-white">
                                <div className="flex items-center justify-between gap-2 mb-1.5">
                                  <span className="font-semibold text-[11px] text-white">
                                    {comment.author} ({comment.authorRole})
                                  </span>
                                  <span className="text-[9px] font-mono text-white/40">{comment.createdAt}</span>
                                </div>
                                <p className="font-normal font-sans text-[11.5px] leading-relaxed select-text text-white/80">{comment.text}</p>
                              </div>
                            </div>
                          ))
                        )}

                        {/* Approval Audit History markers in comments list for premium layout visual */}
                        {post.approvalHistory.map((hist, ind) => (
                          <div key={ind} className="flex items-center gap-2 text-[10px] font-mono text-white/40 bg-white/5 p-2 rounded-xl border border-dashed border-white/10 pl-3">
                            <CornerDownRight size={10} className="text-emerald-500" />
                            <span>
                              {hist.date} &bull; State change to <strong className="text-indigo-300 uppercase">{hist.status}</strong> by {hist.user} ({hist.role})
                              {hist.note && <span className="text-white/50 italic block mt-0.5">Note: "{hist.note}"</span>}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Add comment timeline submission */}
                      <div className="flex gap-2 pt-2">
                        <input
                          type="text"
                          value={newCommentText}
                          onChange={(e) => setNewCommentText(e.target.value)}
                          placeholder="Add team feedback, comments..."
                          className="flex-1 px-3 py-2 bg-[#0a0a0a] border border-white/10 text-xs text-white rounded-xl focus:outline-none"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              if (!newCommentText.trim()) return;
                              onAddComment(post.id, newCommentText);
                              setNewCommentText('');
                            }
                          }}
                        />
                        <button
                          onClick={() => {
                            if (!newCommentText.trim()) return;
                            onAddComment(post.id, newCommentText);
                            setNewCommentText('');
                          }}
                          className="cursor-pointer px-4 bg-indigo-650 hover:bg-indigo-750 text-white text-xs font-bold rounded-xl transition-colors leading-none"
                        >
                          Send Log
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
};
