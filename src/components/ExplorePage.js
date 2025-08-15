'use client';

import { useState, useEffect, useCallback } from 'react';
import styles from './ExplorePage.module.css';
import { useRouter } from 'next/navigation';
import { searchUsers } from '../utils/api';

export default function ExplorePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('For You');
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState([]);
  const [showResults, setShowResults] = useState(false);

  const tabs = [
    'For You',
    'Trending', 
    'News',
    'Sports',
    'Entertainment'
  ];

  const performSearch = useCallback(async (q) => {
    const t = (q || '').trim();
    if (!t) {
      setResults([]);
      setShowResults(false);
      return;
    }
    setIsSearching(true);
    try {
      const data = await searchUsers(t);
      setResults(data.users || []);
      setShowResults(true);
    } catch {
      setResults([]);
      setShowResults(false);
    } finally {
      setIsSearching(false);
    }
  }, []);

  useEffect(() => {
    const id = setTimeout(() => {
      performSearch(query);
    }, 300);
    return () => clearTimeout(id);
  }, [query, performSearch]);

  const handleUserClick = (user) => {
    router.push(`/profile/${user.username}?data=${encodeURIComponent(JSON.stringify(user))}`);
    setQuery('');
    setResults([]);
    setShowResults(false);
  };

  return (
    <div className={styles.container}>
      {/* Search Header */}
      <div className={styles.searchHeader}>
        <div className={styles.searchWrapper}>
          <div className={styles.searchIcon}>
            <svg viewBox="0 0 24 24" className={styles.icon}>
              <path d="M10.25 3.75c-3.59 0-6.5 2.91-6.5 6.5s2.91 6.5 6.5 6.5c1.795 0 3.419-.726 4.596-1.904 1.178-1.177 1.904-2.801 1.904-4.596 0-3.59-2.91-6.5-6.5-6.5zm-8.5 6.5c0-4.694 3.806-8.5 8.5-8.5s8.5 3.806 8.5 8.5c0 1.986-.682 3.815-1.824 5.262l4.781 4.781-1.414 1.414-4.781-4.781c-1.447 1.142-3.276 1.824-5.262 1.824-4.694 0-8.5-3.806-8.5-8.5z" fill="currentColor" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search"
            className={styles.searchInput}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setShowResults(results.length > 0)}
            onBlur={() => setTimeout(() => setShowResults(false), 150)}
          />
        </div>
        <button className={styles.settingsBtn}>
          <svg viewBox="0 0 24 24" className={styles.settingsIcon}>
            <path d="M10.54 1.75h2.92l1.57 2.36c.11.17.32.25.53.21l2.53-.59 2.17 2.17-.58 2.54c-.05.2.04.41.21.53l2.36 1.57v2.92l-2.36 1.57c-.17.12-.26.33-.21.53l.58 2.54-2.17 2.17-2.53-.59c-.21-.04-.42.04-.53.21l-1.57 2.36h-2.92l-1.58-2.36c-.11-.17-.32-.25-.52-.21l-2.54.59-2.17-2.17.58-2.54c.05-.2-.03-.41-.21-.53l-2.35-1.57v-2.92L4.1 8.97c.18-.12.26-.33.21-.53L3.73 5.9 5.9 3.73l2.54.59c.2.04.41-.04.52-.21l1.58-2.36zm1.07 2l-.98 1.47C10.05 6.08 9 6.5 7.99 6.27l-1.46-.34-.6.6.34 1.46c.24 1.01-.19 2.06-1.05 2.64l-1.47.98v.78l1.47.98c.86.58 1.29 1.63 1.05 2.64l-.34 1.46.6.6 1.46-.34c1.01-.23 2.06.19 2.64 1.05l.98 1.47h.78l.97-1.47c.58-.86 1.63-1.28 2.65-1.05l1.45.34.61-.6-.34-1.46c-.23-1.01.19-2.06 1.05-2.64l1.47-.98v-.78l-1.47-.98c-.86-.58-1.28-1.63-1.05-2.64l.34-1.46-.61-.6-1.45.34c-1.02.23-2.07-.19-2.65-1.05l-.97-1.47h-.78zM12 10.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zM12 8c2.21 0 4 1.79 4 4s-1.79 4-4 4-4-1.79-4-4 1.79-4 4-4z" fill="currentColor" />
          </svg>
        </button>
      </div>

      {/* Inline Results Dropdown */}
      {showResults && (
        <div className={styles.searchResults}>
          {isSearching ? (
            <div className={styles.searchingIndicator}>
              <div className={styles.searchingText}>Searching...</div>
            </div>
          ) : results.length > 0 ? (
            <div className={styles.userResults}>
              {results.map((u) => (
                <div key={u.id} className={styles.userResult} onClick={() => handleUserClick(u)}>
                  <div className={styles.userAvatar}>
                    {u.avatarUrl ? (
                      <img src={u.avatarUrl} alt={u.name} className={styles.avatarImage} />
                    ) : (
                      <div className={styles.avatarPlaceholder}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="#888">
                          <path d="M12 2a5 5 0 100 10 5 5 0 000-10zm0 12c-4.418 0-8 2.239-8 5v1h16v-1c0-2.761-3.582-5-8-5z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className={styles.userInfo}>
                    <div className={styles.userName}>{u.name}</div>
                    <div className={styles.userUsername}>@{u.username}</div>
                    {u.bio && <div className={styles.userBio}>{u.bio}</div>}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.noResults}>
              <p className={styles.noResultsText}>No results for "{query}"</p>
            </div>
          )}
        </div>
      )}

      {/* Navigation Tabs */}
      <div className={styles.tabsContainer}>
        <div className={styles.tabs}>
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`${styles.tab} ${activeTab === tab ? styles.active : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className={styles.content}>
        {activeTab === 'For You' && (
          <div className={styles.forYouContent}>
            <div className={styles.emptyState}>
              <h2>Explore what's happening</h2>
              <p>Find trending topics, news, and conversations</p>
            </div>
          </div>
        )}
        
        {activeTab === 'Trending' && (
          <div className={styles.trendingContent}>
            <div className={styles.trendingList}>
              <div className={styles.trendingItem}>
                <div className={styles.trendingCategory}>Trending in Technology</div>
                <div className={styles.trendingTopic}>#NextJS</div>
                <div className={styles.trendingCount}>15.2K posts</div>
              </div>
              <div className={styles.trendingItem}>
                <div className={styles.trendingCategory}>Trending</div>
                <div className={styles.trendingTopic}>#WebDevelopment</div>
                <div className={styles.trendingCount}>8.5K posts</div>
              </div>
              <div className={styles.trendingItem}>
                <div className={styles.trendingCategory}>Trending in Programming</div>
                <div className={styles.trendingTopic}>#React</div>
                <div className={styles.trendingCount}>22.1K posts</div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'News' && (
          <div className={styles.newsContent}>
            <div className={styles.emptyState}>
              <h2>Latest News</h2>
              <p>Stay updated with breaking news and current events</p>
            </div>
          </div>
        )}

        {activeTab === 'Sports' && (
          <div className={styles.sportsContent}>
            <div className={styles.emptyState}>
              <h2>Sports Updates</h2>
              <p>Follow your favorite teams and sports news</p>
            </div>
          </div>
        )}

        {activeTab === 'Entertainment' && (
          <div className={styles.entertainmentContent}>
            <div className={styles.emptyState}>
              <h2>Entertainment</h2>
              <p>Discover movies, music, and celebrity news</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
