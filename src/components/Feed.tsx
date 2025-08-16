'use client';

import React, { useState, useCallback } from 'react';
import { Tweet as TweetType, CreateTweetData } from '../types/Tweet';
import Tweet from './Tweet';
import TweetComposer from './TweetComposer';
import styles from './Feed.module.css';

interface FeedProps {
  initialTweets?: TweetType[];
  showComposer?: boolean;
  defaultAuthor?: string;
  defaultAvatarUrl?: string;
  title?: string;
}

const Feed: React.FC<FeedProps> = ({
  initialTweets = [],
  showComposer = true,
  defaultAuthor = 'You',
  defaultAvatarUrl,
  title = 'Home'
}) => {
  const [tweets, setTweets] = useState<TweetType[]>(initialTweets);
  const [isLoading, setIsLoading] = useState(false);

  const handleNewTweet = useCallback(async (tweetData: CreateTweetData) => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newTweet: TweetType = {
      id: Date.now().toString(),
      author: tweetData.author,
      content: tweetData.content,
      createdAt: new Date(),
      avatarUrl: tweetData.avatarUrl,
      likes: 0,
      replies: 0,
      retweets: 0,
      isLiked: false,
      isRetweeted: false
    };

    setTweets(prevTweets => [newTweet, ...prevTweets]);
    setIsLoading(false);
  }, []);

  const handleLike = useCallback((tweetId: string) => {
    setTweets(prevTweets =>
      prevTweets.map(tweet => {
        if (tweet.id === tweetId) {
          return {
            ...tweet,
            isLiked: !tweet.isLiked,
            likes: tweet.isLiked ? tweet.likes - 1 : tweet.likes + 1
          };
        }
        return tweet;
      })
    );
  }, []);

  const handleRetweet = useCallback((tweetId: string) => {
    setTweets(prevTweets =>
      prevTweets.map(tweet => {
        if (tweet.id === tweetId) {
          return {
            ...tweet,
            isRetweeted: !tweet.isRetweeted,
            retweets: tweet.isRetweeted ? tweet.retweets - 1 : tweet.retweets + 1
          };
        }
        return tweet;
      })
    );
  }, []);

  const handleReply = useCallback((tweetId: string) => {
    // For now, just increment reply count
    setTweets(prevTweets =>
      prevTweets.map(tweet => {
        if (tweet.id === tweetId) {
          return {
            ...tweet,
            replies: tweet.replies + 1
          };
        }
        return tweet;
      })
    );
  }, []);

  return (
    <div className={styles.feed}>
      {title && (
        <div className={styles.header}>
          <h1 className={styles.headerTitle}>{title}</h1>
        </div>
      )}
      
      {showComposer && (
        <div className={styles.composerSection}>
          <TweetComposer
            onTweet={handleNewTweet}
            defaultAuthor={defaultAuthor}
            defaultAvatarUrl={defaultAvatarUrl}
          />
        </div>
      )}

      {isLoading && (
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
        </div>
      )}

      <div className={styles.tweets}>
        {tweets.length === 0 ? (
          <div className={styles.emptyState}>
            <h3>No tweets yet</h3>
            <p>When you post a tweet, it will show up here.</p>
          </div>
        ) : (
          tweets.map(tweet => (
            <Tweet
              key={tweet.id}
              tweet={tweet}
              onLike={handleLike}
              onRetweet={handleRetweet}
              onReply={handleReply}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Feed;
