import React, { useState, useEffect } from 'react';
import { Tweet as TweetType } from '../types/Tweet';
import styles from './Tweet.module.css';

interface TweetProps {
  tweet: TweetType;
  onLike?: (tweetId: string) => void;
  onRetweet?: (tweetId: string) => void;
  onReply?: (tweetId: string) => void;
}

const Tweet: React.FC<TweetProps> = ({ tweet, onLike, onRetweet, onReply }) => {
  const [timeAgo, setTimeAgo] = useState<string>('');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const formatTimeAgo = (date: Date) => {
      const now = new Date();
      const diffInMs = now.getTime() - date.getTime();
      const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
      const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
      const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

      if (diffInMinutes < 1) return 'now';
      if (diffInMinutes < 60) return `${diffInMinutes}m`;
      if (diffInHours < 24) return `${diffInHours}h`;
      return `${diffInDays}d`;
    };

    setTimeAgo(formatTimeAgo(tweet.createdAt));

    // Update every minute
    const interval = setInterval(() => {
      setTimeAgo(formatTimeAgo(tweet.createdAt));
    }, 60000);

    return () => clearInterval(interval);
  }, [tweet.createdAt, isClient]);

  const handleLike = () => {
    if (onLike) {
      onLike(tweet.id);
    }
  };

  const handleRetweet = () => {
    if (onRetweet) {
      onRetweet(tweet.id);
    }
  };

  const handleReply = () => {
    if (onReply) {
      onReply(tweet.id);
    }
  };

  return (
    <div className={styles.tweet}>
      <div className={styles.avatar}>
        {tweet.avatarUrl ? (
          <img src={tweet.avatarUrl} alt={`${tweet.author} avatar`} />
        ) : (
          <div className={styles.defaultAvatar}>
            {tweet.author.charAt(0).toUpperCase()}
          </div>
        )}
      </div>
      
      <div className={styles.content}>
        <div className={styles.header}>
          <span className={styles.author}>{tweet.author}</span>
          <span className={styles.username}>@{tweet.author.toLowerCase().replace(/\s+/g, '')}</span>
          <span className={styles.timestamp}>{timeAgo}</span>
        </div>
        
        <div className={styles.text}>
          {tweet.content}
        </div>
        
        <div className={styles.actions}>
          <button 
            className={styles.actionButton}
            onClick={handleReply}
            aria-label="Reply"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M1.751 10c0-4.42 3.584-8 8.005-8h4.366c4.49 0 8.129 3.64 8.129 8.13 0 2.96-1.607 5.68-4.196 7.11l-8.054 4.46v-3.69h-.067c-4.49.1-8.183-3.51-8.183-8.01z"/>
            </svg>
            <span>{tweet.replies}</span>
          </button>
          
          <button 
            className={`${styles.actionButton} ${tweet.isRetweeted ? styles.retweeted : ''}`}
            onClick={handleRetweet}
            aria-label="Retweet"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M4.5 3.88l4.432 4.14-1.364 1.46L5.5 7.55V16c0 1.1.896 2 2 2H13v2H7.5c-2.209 0-4-1.791-4-4V7.55L1.432 9.48.068 8.02 4.5 3.88zM16.5 6H11V4h5.5c2.209 0 4 1.791 4 4v8.45l2.068-1.93 1.364 1.46-4.432 4.14-4.432-4.14 1.364-1.46L18.5 16.45V8c0-1.1-.896-2-2-2z"/>
            </svg>
            <span>{tweet.retweets}</span>
          </button>
          
          <button 
            className={`${styles.actionButton} ${tweet.isLiked ? styles.liked : ''}`}
            onClick={handleLike}
            aria-label="Like"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M16.697 5.5c-1.222-.06-2.679.51-3.89 2.16l-.805 1.09-.806-1.09C9.984 6.01 8.526 5.44 7.304 5.5c-1.243.07-2.349.78-2.91 1.91-.552 1.12-.633 2.78.479 4.82 1.074 1.97 3.257 4.27 7.129 6.61 3.87-2.34 6.052-4.64 7.126-6.61 1.111-2.04 1.03-3.7.477-4.82-.561-1.13-1.666-1.84-2.908-1.91zm4.187 7.69c-1.351 2.48-4.001 5.12-8.379 7.67l-.503.3-.504-.3c-4.379-2.55-7.029-5.19-8.382-7.67-1.36-2.5-1.41-4.86-.514-6.67.887-1.79 2.647-2.91 4.601-3.01 1.651-.09 3.368.56 4.798 2.01 1.429-1.45 3.146-2.1 4.796-2.01 1.954.1 3.714 1.22 4.601 3.01.896 1.81.846 4.17-.514 6.67z"/>
            </svg>
            <span>{tweet.likes}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Tweet;
