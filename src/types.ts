export type SocialPlatform = 'twitter' | 'linkedin' | 'instagram' | 'facebook' | 'tiktok';

export type PostStatus = 'draft' | 'pending' | 'approved' | 'published';

export type Role = 'creator' | 'approver' | 'client' | 'admin';

export interface Collaborator {
  id: string;
  name: string;
  role: Role;
  avatarUrl: string;
}

export interface Comment {
  id: string;
  author: string;
  authorRole: Role;
  text: string;
  createdAt: string;
}

export interface ApprovalHistory {
  status: PostStatus;
  user: string;
  role: Role;
  date: string;
  note?: string;
}

export interface Post {
  id: string;
  content: string;
  platformContents?: Record<SocialPlatform, string>; // Customized content per platform if needed
  platforms: SocialPlatform[];
  scheduledDate: string;
  status: PostStatus;
  mediaUrl?: string; // base64 or object URL of client-uploaded media
  mediaName?: string;
  comments: Comment[];
  approvalHistory: ApprovalHistory[];
  createdAt: string;
  author: string;
  isSyncedToCloud: boolean;
  captionOptimized?: boolean;
}

export interface Notification {
  id: string;
  type: 'approval_request' | 'approved' | 'comment' | 'published' | 'system';
  text: string;
  isRead: boolean;
  postId?: string;
  createdAt: string;
}

export interface PlatformMetric {
  platform: SocialPlatform;
  followers: number;
  followersGrowth: number;
  engagementRate: number;
  reach: number;
  postsCount: number;
}
