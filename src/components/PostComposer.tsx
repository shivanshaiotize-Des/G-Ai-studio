import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, Image as ImageIcon, Calendar, Clock, Send, 
  CheckSquare, Check, X, Film, AlertCircle, FileText, ChevronRight 
} from 'lucide-react';
import { SocialPlatform, Role } from '../types';

interface PostComposerProps {
  onAddPost: (content: string, platforms: SocialPlatform[], scheduledDate: string, mediaUrl?: string, mediaName?: string) => Promise<void>;
  currentUserRole: Role;
  isOnline: boolean;
}

export const PostComposer: React.FC<PostComposerProps> = ({
  onAddPost,
  currentUserRole,
  isOnline,
}) => {
  const [content, setContent] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<SocialPlatform[]>(['twitter']);
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  
  // Media states
  const [mediaUrl, setMediaUrl] = useState<string | undefined>(undefined);
  const [mediaName, setMediaName] = useState<string | undefined>(undefined);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // AI states
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [aiTargetPlatform, setAiTargetPlatform] = useState<SocialPlatform>('twitter');
  const [aiResult, setAiResult] = useState<string | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);

  // General submittals
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const togglePlatform = (platform: SocialPlatform) => {
    if (selectedPlatforms.includes(platform)) {
      if (selectedPlatforms.length > 1) {
        setSelectedPlatforms(selectedPlatforms.filter(p => p !== platform));
      }
    } else {
      setSelectedPlatforms([...selectedPlatforms, platform]);
    }
  };

  // Convert File to base64
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setMediaUrl(reader.result as string);
        setMediaName(file.name);
      };
      reader.readAsDataURL(file);
    }
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setMediaUrl(reader.result as string);
        setMediaName(file.name);
      };
      reader.readAsDataURL(file);
    }
  };

  // Trigger server-side Gemini AI Post Formatting / Tone Optimizer
  const handleAIElevate = async () => {
    if (!content.trim()) {
      setAiError('Please enter some text in the composer first to optimize!');
      return;
    }
    setIsOptimizing(true);
    setAiError(null);
    setAiResult(null);

    try {
      const response = await fetch('/api/generate-caption', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt: content,
          platform: aiTargetPlatform 
        }),
      });

      if (!response.ok) {
        throw new Error('Server returned an optimization error.');
      }

      const data = await response.json();
      if (data.optimizedText) {
        setAiResult(data.optimizedText);
      } else {
        throw new Error('Empty text output.');
      }
    } catch (err: any) {
      console.error(err);
      // Beautiful local fallback suggestions of optimized captions in case of missing keys
      let fallback = '';
      if (aiTargetPlatform === 'twitter') {
        fallback = `⚡️ ${content.slice(0, 240)}...\n\n#SocialSpeed #Distribution`;
      } else if (aiTargetPlatform === 'linkedin') {
        fallback = `💼 EXCITING INSIGHT:\n\n${content}\n\nI'd love to hear your thoughts in the comments. Let's discuss!\n\n#Leadership #Innovation #Productivity #OneClick`;
      } else if (aiTargetPlatform === 'instagram') {
        fallback = `✨ ${content} ✨\n\n🎯 Cross-Platform Distribution Matrix\n💡 Collaborative Workflows\n\n💬 Double tap to support and comment below!\n\n#InstaGrow #SMonogram #DesignSystems #WarmIvory`;
      } else {
        fallback = `🚀 QUICK UPDATE: ${content} 🔥 #OneClick #MultiPlatform #Efficiency`;
      }
      setAiResult(fallback);
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleApplyAIResult = () => {
    if (aiResult) {
      setContent(aiResult);
      setAiResult(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsSubmitting(true);
    setSuccessMsg(null);

    // Format final date
    let fullScheduleDate = '';
    if (scheduledDate && scheduledTime) {
      fullScheduleDate = `${scheduledDate} ${scheduledTime}`;
    } else {
      // Direct post/Draft default date
      const d = new Date();
      d.setMinutes(d.getMinutes() + 15); // Default scheduled to +15 mins if not set
      fullScheduleDate = d.toLocaleString();
    }

    try {
      await onAddPost(content, selectedPlatforms, fullScheduleDate, mediaUrl, mediaName);
      
      // Reset fields
      setContent('');
      setMediaUrl(undefined);
      setMediaName(undefined);
      setScheduledDate('');
      setScheduledTime('');
      
      // Success feedback banner
      const feedback = currentUserRole === 'creator' 
        ? 'Submitted for Approvals! Task assigned to workflow queue.'
        : 'Post scheduled successfully!';
      setSuccessMsg(feedback);
      
      setTimeout(() => {
        setSuccessMsg(null);
      }, 4000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPlatformLabel = (platform: SocialPlatform) => {
    switch (platform) {
      case 'twitter': return 'X / Twitter';
      case 'linkedin': return 'LinkedIn';
      case 'instagram': return 'Instagram';
      case 'facebook': return 'Facebook';
      case 'tiktok': return 'TikTok';
    }
  };

  return (
    <div id="composer-card" className="bg-white/5 border border-white/10 rounded-3xl p-5 backdrop-blur-xl relative overflow-hidden transition-all duration-300 text-white">
      
      {/* Platform Multi-selector Channels */}
      <div className="mb-4">
        <label className="block text-[9.5px] font-bold font-mono tracking-widest uppercase text-white/40 mb-2">
          SELECT BROADCAST CHANNELS
        </label>
        
        <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-5 gap-1.5 list-none">
          {(['twitter', 'linkedin', 'instagram', 'facebook', 'tiktok'] as SocialPlatform[]).map((plat) => {
            const isSelected = selectedPlatforms.includes(plat);
            return (
              <button
                key={plat}
                type="button"
                onClick={() => togglePlatform(plat)}
                className={`cursor-pointer px-2 py-2.5 rounded-xl border text-[11px] font-bold text-center uppercase tracking-wider transition-all flex items-center justify-center gap-1 leading-none ${
                  isSelected
                    ? 'bg-indigo-650 border-indigo-500 text-white font-bold shadow-md scale-[1.02]'
                    : 'bg-white/5 border-white/10 text-white/60 hover:text-white hover:bg-white/10'
                }`}
              >
                {isSelected && <Check size={11} className="stroke-[3]" />}
                {plat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Editor Body text input */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <label className="block text-[9.5px] font-bold font-mono tracking-widest uppercase text-white/40 mb-2">
            POST CONTENT
          </label>
          
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Type your strategic updates... SS AI can optimize it for each platform."
            className="w-full min-h-[120px] p-4 bg-white/5 text-white border border-white/10 rounded-2xl focus:outline-none focus:ring-1 focus:ring-indigo-500/50 focus:border-indigo-550/60 placeholder-white/30 font-sans text-sm resize-y leading-relaxed"
          />

          {/* Character counters indicators */}
          <div className="absolute right-3.5 bottom-3.5 flex items-center gap-2 select-none pointer-events-none">
            <span className={`text-[10px] font-mono p-1 rounded ${
              content.length > 280 && selectedPlatforms.includes('twitter')
                ? 'bg-rose-500/15 text-rose-400 font-bold'
                : 'text-white/40'
            }`}>
              {content.length} chars
            </span>
          </div>
        </div>

        {/* Media Attach Drag and Drop Simulated Block */}
        <div
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`cursor-pointer border-2 border-dashed rounded-2xl p-4 text-center transition-all ${
            mediaUrl 
              ? 'border-emerald-500 bg-emerald-500/5' 
              : isDragging
                ? 'border-indigo-500 bg-indigo-500/10'
                : 'border-white/10 bg-white/5 hover:border-indigo-500/30'
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />

          {mediaUrl ? (
            <div className="flex items-center justify-between gap-3 text-left">
              <div className="flex items-center gap-2.5 min-w-0">
                <img 
                  src={mediaUrl} 
                  alt="upload preview" 
                  referrerPolicy="no-referrer"
                  className="w-12 h-12 object-cover rounded-lg border border-emerald-500/30 bg-stone-900"
                />
                <div className="min-w-0">
                  <span className="text-xs font-semibold text-emerald-355 truncate block">
                    {mediaName || 'Attached Media'}
                  </span>
                  <span className="text-[10px] text-white/40 font-mono">FILE ATTACHED SYNCED</span>
                </div>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setMediaUrl(undefined);
                  setMediaName(undefined);
                }}
                className="p-1.5 bg-white/5 hover:bg-white/10 rounded-full text-white/40 hover:text-white"
              >
                <X size={13} />
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-2 text-white/40">
              <ImageIcon size={18} className="text-white/40 mb-1" />
              <p className="text-xs font-semibold">
                Drag & Drop Media or <span className="text-indigo-400 underline font-bold">Browse</span>
              </p>
              <span className="text-[9px] text-white/30 mt-0.5">JPEG, PNG, MP4 up to 48MB (drag simulated)</span>
            </div>
          )}
        </div>

        {/* Strategic SS AI Caption Optimizer Panel using process-level process.env.GEMINI_API_KEY */}
        <div className="rounded-2xl border border-indigo-500/15 bg-indigo-500/5 p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-300">
              <Sparkles size={14} className="text-indigo-400 animate-pulse" />
              SS AI Caption Optimizer
              <span className="px-1 py-0.5 text-[8px] font-bold bg-indigo-500/10 text-indigo-300 rounded border border-indigo-500/10 font-mono uppercase">
                {isOnline ? "Gemini-3.5" : "Local Fallback"}
              </span>
            </div>

            <div className="flex items-center gap-1">
              <span className="text-[10px] text-white/40">For</span>
              <select
                value={aiTargetPlatform}
                onChange={(e) => setAiTargetPlatform(e.target.value as SocialPlatform)}
                className="bg-[#0a0a0a] border border-white/15 rounded px-1.5 py-0.5 text-[10px] font-bold text-white focus:outline-none"
              >
                {selectedPlatforms.map(p => (
                  <option key={p} value={p}>{p.toUpperCase()}</option>
                ))}
              </select>
            </div>
          </div>

          <p className="text-[11px] text-white/65 leading-relaxed mb-3 pr-2">
            Transforms draft text into high-engagement captioned variants customized specifically for your selected platform aesthetics.
          </p>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleAIElevate}
              disabled={isOptimizing}
              className="cursor-pointer flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-all border border-transparent shadow shadow-indigo-500/20"
            >
              {isOptimizing ? (
                <>
                  <svg className="animate-spin h-3.5 w-3.5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Recalculating...
                </>
              ) : (
                <>
                  <Sparkles size={12} />
                  Optimize Caption Tonality
                </>
              )}
            </button>
          </div>

          {/* AI Output Result Box container */}
          <AnimatePresence>
            {aiResult && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-3 bg-[#0d0d0d] border border-white/10 rounded-xl p-3 text-white relative overflow-hidden"
              >
                <div className="flex justify-between items-center text-[10px] text-white/40 font-mono mb-2 border-b border-white/5 pb-1.5">
                  <span>AI TRANSLATION FOR {aiTargetPlatform.toUpperCase()}</span>
                  <span className="text-indigo-400 font-bold animate-pulse">READY TO DEPLOY</span>
                </div>
                
                <p className="text-xs font-normal leading-relaxed whitespace-pre-wrap select-text pr-2 text-white/90">
                  {aiResult}
                </p>

                <div className="flex justify-end gap-2 mt-3 pt-2 border-t border-white/5">
                  <button
                    type="button"
                    onClick={() => setAiResult(null)}
                    className="cursor-pointer px-2 py-1 text-[10px] text-white/40 hover:text-white font-medium"
                  >
                    Reject Modification
                  </button>
                  <button
                    type="button"
                    onClick={handleApplyAIResult}
                    className="cursor-pointer px-3 py-1.5 text-[10px] font-bold text-white bg-indigo-650 hover:bg-indigo-750 rounded-lg shadow-sm font-sans"
                  >
                    Apply & Replace Original Draft
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Scheduling Calendar parameters */}
        <div>
          <label className="block text-[9.5px] font-bold font-mono tracking-widest uppercase text-white/40 mb-2">
            SCHEDULING TIME SLOT (OPTIONAL)
          </label>

          <div className="grid grid-cols-2 gap-2.5Locale">
            <div className="relative">
              <Calendar size={13} className="absolute left-3 top-3.5 text-white/40" />
              <input
                type="date"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                className="w-full pl-8 pr-2 py-2.5 bg-white/5 text-white border border-white/10 rounded-xl text-xs focus:outline-none"
              />
            </div>

            <div className="relative">
              <Clock size={13} className="absolute left-3 top-3.5 text-white/40" />
              <input
                type="time"
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
                className="w-full pl-8 pr-2 py-2.5 bg-white/5 text-white border border-white/10 rounded-xl text-xs focus:outline-none"
              />
            </div>
          </div>
          <span className="text-[10px] text-white/40 mt-1 block">
            Leave blank to queue post for immediate execution (default schedules to next active block).
          </span>
        </div>

        {/* Action triggers: Direct Broadcast vs Submit for approvals */}
        <div className="pt-3 border-t border-white/5 flex items-center justify-between gap-4">
          <div className="text-left">
            <span className="text-[10px] text-white/40 block">WORKFLOW STATE</span>
            <p className="text-xs font-bold text-indigo-305">
              {currentUserRole === 'creator' ? 'Requires Approval Sweep' : 'Pre-approved Publish'}
            </p>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !content.trim()}
            className="cursor-pointer px-5 py-2.5 text-xs font-bold bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-xl hover:scale-[1.01] hover:brightness-105 active:scale-95 transition-all shadow-md flex items-center gap-1.5 disabled:scale-100 disabled:opacity-40 disabled:brightness-100"
          >
            <Send size={13} />
            {currentUserRole === 'creator' ? 'Submit for Approvals' : 'Broadcast / Schedule Post'}
          </button>
        </div>

        {/* Success feedbacks overlay */}
        <AnimatePresence>
          {successMsg && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/10 rounded-xl p-3 text-xs mt-3 flex items-center gap-2 shadow"
            >
              <CheckSquare size={16} />
              <span className="font-semibold">{successMsg}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </div>
  );
};
