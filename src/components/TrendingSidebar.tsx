'use client';

import React from 'react';
import styles from './TrendingSidebar.module.css';

interface TrendingTopic {
  id: string;
  category: string;
  title: string;
  tweets: string;
}

interface TrendingSidebarProps {
  className?: string;
}

const trendingTopics: TrendingTopic[] = [
  {
    id: '1',
    category: 'Technology',
    title: 'AI Revolution',
    tweets: '125K Tweets'
  },
  {
    id: '2',
    category: 'Trending in Tech',
    title: 'Next.js 16',
    tweets: '89.2K Tweets'
  },
  {
    id: '3',
    category: 'Space',
    title: 'James Webb Telescope',
    tweets: '67.8K Tweets'
  },
  {
    id: '4',
    category: 'Innovation',
    title: 'Neuralink',
    tweets: '45.6K Tweets'
  },
  {
    id: '5',
    category: 'Programming',
    title: 'TypeScript',
    tweets: '34.2K Tweets'
  }
];

const whoToFollow = [
  {
    id: '1',
    name: 'Vercel',
    username: '@vercel',
    avatar: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=150&h=150&fit=crop&crop=face',
    verified: true
  },
  {
    id: '2',
    name: 'GitHub',
    username: '@github',
    avatar: 'https://images.unsplash.com/photo-1618401479427-c8ef9465fbe1?w=150&h=150&fit=crop&crop=face',
    verified: true
  },
  {
    id: '3',
    name: 'OpenAI',
    username: '@openai',
    avatar: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=150&h=150&fit=crop&crop=face',
    verified: true
  }
];

const TrendingSidebar: React.FC<TrendingSidebarProps> = ({ className }) => {
  return (
    <div className={`${styles.sidebar} ${className || ''}`}>
      {/* Trending Topics */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>What's happening</h2>
        <div className={styles.trendingList}>
          {trendingTopics.map((topic) => (
            <div key={topic.id} className={styles.trendingItem}>
              <div className={styles.trendingCategory}>{topic.category}</div>
              <div className={styles.trendingTitle}>{topic.title}</div>
              <div className={styles.trendingStats}>{topic.tweets}</div>
            </div>
          ))}
        </div>
        <button className={styles.showMore}>Show more</button>
      </div>

      {/* Who to Follow */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Who to follow</h2>
        <div className={styles.followList}>
          {whoToFollow.map((user) => (
            <div key={user.id} className={styles.followItem}>
              <img src={user.avatar} alt={user.name} className={styles.followAvatar} />
              <div className={styles.followInfo}>
                <div className={styles.followName}>
                  {user.name}
                  {user.verified && (
                    <svg className={styles.verifiedBadge} width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                    </svg>
                  )}
                </div>
                <div className={styles.followUsername}>{user.username}</div>
              </div>
              <button className={styles.followButton}>Follow</button>
            </div>
          ))}
        </div>
        <button className={styles.showMore}>Show more</button>
      </div>
    </div>
  );
};

export default TrendingSidebar;
