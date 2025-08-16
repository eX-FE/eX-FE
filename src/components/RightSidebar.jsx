'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { searchUsers } from '../utils/api';
import { followUser, unfollowUser } from '../utils/api';
import { useUser } from '../context/UserContext';
import styles from './RightSidebar.module.css';

export default function RightSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const isExplore = pathname === '/explore';
  const { user: currentUser } = useUser();
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
    const controller = new AbortController();
    try {
      const data = await searchUsers(query, { signal: controller.signal });
      setSearchResults(data.users || []);
      setShowResults(true);
    } catch (error) {
      console.error('Search failed:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
    return () => controller.abort();
  }, []);

  // Debounce search queries
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery.length > 0) {
        const cleanup = performSearch(searchQuery);
        // if performSearch returned a cleanup (abort), call it when query changes
        if (typeof cleanup === 'function') {
          return cleanup;
        }
      } else {
        setSearchResults([]);
        setShowResults(false);
      }
    }, 350); // slight debounce

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

  // First "Who to follow" suggestion (random existing account)
  const [suggested, setSuggested] = useState(null);
  const [firstFollowing, setFirstFollowing] = useState(false);
  useEffect(() => {
    let cancelled = false;
    async function pickSuggestion() {
      const seeds = ['a','e','i','o','u','s','n'];
      for (const seed of seeds) {
        try {
          const res = await searchUsers(seed);
          const list = (res.users || []).filter(u => !currentUser || u.username !== currentUser.username);
          if (!cancelled && list.length > 0) { setSuggested(list[0]); break; }
        } catch {}
      }
    }
    pickSuggestion();
    return () => { cancelled = true; };
  }, [currentUser]);

  async function toggleFollowFirst() {
    if (!suggested) return;
    try {
      if (!firstFollowing) {
        setFirstFollowing(true);
        try { await followUser(suggested.username); } catch (e) {
          if (e?.code === 'AUTH' || /(Invalid|Missing Authorization|User not found)/i.test(e?.message || '')) {
            if (typeof window !== 'undefined') localStorage.removeItem('access_token');
            router.push('/login');
            return;
          }
          setFirstFollowing(false);
        }
      } else {
        setFirstFollowing(false);
        try { await unfollowUser(suggested.username); } catch {}
      }
    } catch {}
  }

  return (
    <div className={styles.rightSidebar}>
      {/* Search Bar (hidden on /explore) */}
      {!isExplore && (
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
                       <div key={user.id} className={styles.userResult}>
                         <div className={styles.userMeta} onClick={() => handleUserClick(user)}>
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
                         <button className={styles.moreButton} aria-label="More options">
                           <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                             <circle cx="5" cy="12" r="2" />
                             <circle cx="12" cy="12" r="2" />
                             <circle cx="19" cy="12" r="2" />
                           </svg>
                         </button>
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
      )}

      {/* What's happening card */}
      <div className={styles.happeningCard}>
        <div className={styles.cardTitle}>What’s happening</div>

        <div className={styles.hItem}>
          <div className={styles.hMeta}>Trending in Mexico</div>
          <button className={styles.hMore} aria-label="More">…</button>
          <div className={styles.hTopic}>Piedras Negras</div>
          <div className={styles.hCount}>3,648 posts</div>
        </div>

        <div className={styles.hItem}>
          <div className={styles.hMeta}>Trending in Mexico</div>
          <button className={styles.hMore} aria-label="More">…</button>
          <div className={styles.hTopic}>THE AIR Q8 SHOOTING</div>
          <div className={styles.hCount}>281K posts</div>
        </div>

        <div className={styles.hItem}>
          <div className={styles.hMeta}>Trending in Mexico</div>
          <button className={styles.hMore} aria-label="More">…</button>
          <div className={styles.hTopic}>Norma Piña</div>
          <div className={styles.hCount}>17.6K posts</div>
        </div>

        <div className={styles.hItem}>
          <div className={styles.hMeta}>Only on X · Trending</div>
          <button className={styles.hMore} aria-label="More">…</button>
          <div className={styles.hTopic}>#FelizViernesATodos</div>
          <div className={styles.hCount}>1,401 posts</div>
        </div>

        <button className={styles.showMore} type="button">Show more</button>
      </div>

      {/* Who to follow card */}
      <div className={styles.followCard}>
        <div className={styles.cardTitle}>Who to follow</div>
        <div className={styles.fItem}>
          <div className={styles.fAvatar}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            {suggested?.avatarUrl ? (
              <img src={suggested.avatarUrl} alt={suggested.name || suggested.username} onError={(e)=>{ e.currentTarget.style.display='none'; const sib=e.currentTarget.nextElementSibling; if(sib) sib.style.display='flex'; }} />
            ) : (
              <img src="/vercel.svg" alt="avatar" onError={(e)=>{ e.currentTarget.style.display='none'; const sib=e.currentTarget.nextElementSibling; if(sib) sib.style.display='flex'; }} />
            )}
            <div className={styles.avatarIcon} style={{display:'none'}}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#888"><path d="M12 2a5 5 0 100 10 5 5 0 000-10zm0 12c-4.418 0-8 2.239-8 5v1h16v-1c0-2.761-3.582-5-8-5z"/></svg>
            </div>
          </div>
          <div className={styles.fInfo}>
            <div className={styles.fName}>{suggested?.name || suggested?.username || 'User'}</div>
            <div className={styles.fUsername}>@{suggested?.username || 'username'}</div>
          </div>
          <button className={styles.fBtn} type="button" onClick={toggleFollowFirst}>{firstFollowing ? 'Following' : 'Follow'}</button>
        </div>
        <div className={styles.fItem}>
          <div className={styles.fAvatar}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/next.svg" alt="brozo" onError={(e)=>{ e.currentTarget.style.display='none'; const sib=e.currentTarget.nextElementSibling; if(sib) sib.style.display='flex'; }} />
            <div className={styles.avatarIcon} style={{display:'none'}}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#888"><path d="M12 2a5 5 0 100 10 5 5 0 000-10zm0 12c-4.418 0-8 2.239-8 5v1h16v-1c0-2.761-3.582-5-8-5z"/></svg>
            </div>
          </div>
          <div className={styles.fInfo}>
            <div className={styles.fName}>brozo xmiswebs</div>
            <div className={styles.fUsername}>@brozoxmiswebs</div>
          </div>
          <button className={styles.fBtn} type="button">Follow</button>
        </div>
        <div className={styles.fItem}>
          <div className={styles.fAvatar}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/vercel.svg" alt="El Universal" onError={(e)=>{ e.currentTarget.style.display='none'; const sib=e.currentTarget.nextElementSibling; if(sib) sib.style.display='flex'; }} />
            <div className={styles.avatarIcon} style={{display:'none'}}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#888"><path d="M12 2a5 5 0 100 10 5 5 0 000-10zm0 12c-4.418 0-8 2.239-8 5v1h16v-1c0-2.761-3.582-5-8-5z"/></svg>
            </div>
          </div>
          <div className={styles.fInfo}>
            <div className={styles.fName}>El Universal</div>
            <div className={styles.fUsername}>@EL_Universal_Mx</div>
          </div>
          <button className={styles.fBtn} type="button">Follow</button>
        </div>
        <button className={styles.showMore} type="button">Show more</button>
      </div>

      {/* Footer */}
      <div className={styles.footer}>
        <a className={styles.footerLink}>Terms of Service</a>
        <span className={styles.footerDivider}>|</span>
        <a className={styles.footerLink}>Privacy Policy</a>
        <span className={styles.footerDivider}>|</span>
        <a className={styles.footerLink}>Cookie Policy</a>
        <span className={styles.footerDivider}>|</span>
        <a className={styles.footerLink}>Accessibility</a>
        <span className={styles.footerDivider}>|</span>
        <a className={styles.footerLink}>Ads info</a>
        <span className={styles.footerDivider}>|</span>
        <a className={styles.footerLink}>More …</a>
        <span className={styles.footerCopy}>© 2025 X Corp.</span>
      </div>

      {/* Future content will go here */}
      <div className={styles.placeholder}>
        {/* Placeholder for future content */}
      </div>
    </div>
  );
} 