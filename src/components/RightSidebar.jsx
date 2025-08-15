'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { searchUsers } from '../utils/api';
import styles from './RightSidebar.module.css';

export default function RightSidebar() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [showTooltip, setShowTooltip] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);

  // Debounced search function
  const performSearch = useCallback(async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    setIsSearching(true);
    try {
      const data = await searchUsers(query);
      setSearchResults(data.users || []);
      setShowResults(true);
    } catch (error) {
      console.error('Search failed:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  // Debounce search queries
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery.length > 0) {
        performSearch(searchQuery);
      } else {
        setSearchResults([]);
        setShowResults(false);
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(timeoutId);
  }, [searchQuery, performSearch]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (value.length === 0) {
      setShowResults(false);
      setSearchResults([]);
    }
  };

  const handleFocus = () => {
    setShowTooltip(searchQuery.length === 0);
    if (searchQuery.length > 0 && searchResults.length > 0) {
      setShowResults(true);
    }
  };

  const handleBlur = () => {
    setTimeout(() => {
      setShowTooltip(false);
      setShowResults(false);
    }, 150);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setShowResults(false);
    setShowTooltip(true);
  };

  const handleUserClick = (user) => {
    // Navigate to user's profile page with user data
    router.push(`/profile/${user.username}?data=${encodeURIComponent(JSON.stringify(user))}`);
    // Clear search
    setSearchQuery('');
    setSearchResults([]);
    setShowResults(false);
  };

  return (
    <div className={styles.rightSidebar}>
      {/* Search Bar */}
      <div className={styles.searchContainer}>
        <div className={styles.searchWrapper}>
          {/* Search Icon */}
          <svg 
            className={styles.searchIcon}
            viewBox="0 0 24 24"
          >
            <path d="M10.25 3.75c-3.59 0-6.5 2.91-6.5 6.5s2.91 6.5 6.5 6.5c1.795 0 3.419-.726 4.596-1.904 1.178-1.177 1.904-2.801 1.904-4.596 0-3.59-2.91-6.5-6.5-6.5zm-8.5 6.5c0-4.694 3.806-8.5 8.5-8.5s8.5 3.806 8.5 8.5c0 1.986-.682 3.815-1.824 5.262l4.781 4.781-1.414 1.414-4.781-4.781c-1.447 1.142-3.276 1.824-5.262 1.824-4.694 0-8.5-3.806-8.5-8.5z"/>
          </svg>
          
          {/* Search Input */}
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={handleInputChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            className={styles.searchInput}
          />
          
          {/* Clear button */}
          {searchQuery.length > 0 && (
            <button
              onClick={clearSearch}
              className={styles.clearButton}
              type="button"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M10.59 12L4.54 5.96l1.42-1.42L12 10.59l6.04-6.05 1.42 1.42L13.41 12l6.05 6.04-1.42 1.42L12 13.41l-6.04 6.05-1.42-1.42L10.59 12z"/>
              </svg>
            </button>
          )}
        </div>
        
        {/* Search Tooltip */}
        {showTooltip && (
          <div className={styles.searchTooltip}>
            <p className={styles.tooltipText}>
              Try searching for people or keywords
            </p>
          </div>
        )}
        
        {/* Search Results */}
        {showResults && (
          <div className={styles.searchResults}>
            {isSearching ? (
              <div className={styles.searchingIndicator}>
                <div className={styles.searchingText}>Searching...</div>
              </div>
            ) : searchResults.length > 0 ? (
              <>
                {/* Search suggestions */}
                <div className={styles.searchSuggestions}>
                  <div className={styles.searchSuggestion}>
                    <svg className={styles.suggestionIcon} width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M10.25 3.75c-3.59 0-6.5 2.91-6.5 6.5s2.91 6.5 6.5 6.5c1.795 0 3.419-.726 4.596-1.904 1.178-1.177 1.904-2.801 1.904-4.596 0-3.59-2.91-6.5-6.5-6.5zm-8.5 6.5c0-4.694 3.806-8.5 8.5-8.5s8.5 3.806 8.5 8.5c0 1.986-.682 3.815-1.824 5.262l4.781 4.781-1.414 1.414-4.781-4.781c-1.447 1.142-3.276 1.824-5.262 1.824-4.694 0-8.5-3.806-8.5-8.5z"/>
                    </svg>
                    <span className={styles.suggestionText}>{searchQuery}</span>
                  </div>
                </div>
                
                                 {/* User results */}
                 <div className={styles.userResults}>
                   {searchResults.map((user) => (
                     <div key={user.id} className={styles.userResult} onClick={() => handleUserClick(user)}>
                      <div className={styles.userAvatar}>
                        {user.avatarUrl ? (
                          <img src={user.avatarUrl} alt={user.name} className={styles.avatarImage} />
                        ) : (
                          <div className={styles.avatarPlaceholder}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="#888">
                              <path d="M12 2a5 5 0 100 10 5 5 0 000-10zm0 12c-4.418 0-8 2.239-8 5v1h16v-1c0-2.761-3.582-5-8-5z" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <div className={styles.userInfo}>
                        <div className={styles.userName}>{user.name}</div>
                        <div className={styles.userUsername}>@{user.username}</div>
                        {user.bio && <div className={styles.userBio}>{user.bio}</div>}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className={styles.noResults}>
                <p className={styles.noResultsText}>No results for "{searchQuery}"</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Future content will go here */}
      <div className={styles.placeholder}>
        {/* Placeholder for future content */}
      </div>
    </div>
  );
} 