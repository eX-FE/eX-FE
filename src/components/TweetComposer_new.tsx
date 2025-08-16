'use client';

import React, { useState } from 'react';
import { CreateTweetData } from '../types/Tweet';
import styles from './TweetComposer.module.css';

interface TweetComposerProps {
  onTweet: (tweetData: CreateTweetData) => void;
  defaultAuthor?: string;
  defaultAvatarUrl?: string;
}

const TweetComposer: React.FC<TweetComposerProps> = ({ 
  onTweet, 
  defaultAuthor = 'You',
  defaultAvatarUrl 
}) => {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) return;
    
    setIsSubmitting(true);
    
    try {
      await onTweet({
        author: defaultAuthor,
        content: content.trim(),
        avatarUrl: defaultAvatarUrl
      });
      
      setContent('');
    } catch (error) {
      console.error('Failed to post tweet:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isDisabled = !content.trim() || isSubmitting;
  const remainingChars = 280 - content.length;

  return (
    <div className={styles.composer}>
      <div className={styles.avatar}>
        {defaultAvatarUrl ? (
          <img src={defaultAvatarUrl} alt={`${defaultAuthor} avatar`} />
        ) : (
          <div className={styles.defaultAvatar}>
            {defaultAuthor.charAt(0).toUpperCase()}
          </div>
        )}
      </div>
      
      <form className={styles.form} onSubmit={handleSubmit}>
        <textarea
          className={styles.textarea}
          placeholder="What's happening?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          maxLength={280}
          rows={3}
          disabled={isSubmitting}
        />
        
        <div className={styles.footer}>
          <div className={styles.actions}>
            <span className={`${styles.charCount} ${remainingChars < 20 ? styles.warning : ''}`}>
              {remainingChars}
            </span>
            
            <button
              type="submit"
              className={styles.tweetButton}
              disabled={isDisabled}
            >
              {isSubmitting ? 'Posting...' : 'Post'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default TweetComposer;
