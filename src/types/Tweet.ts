export interface Tweet {
  id: string;
  author: string;
  content: string;
  createdAt: Date;
  avatarUrl?: string;
  likes: number;
  replies: number;
  retweets: number;
  isLiked?: boolean;
  isRetweeted?: boolean;
}

export interface CreateTweetData {
  author: string;
  content: string;
  avatarUrl?: string;
}