'use client';

import { useState } from 'react';
import styles from './CommunitiesPage.module.css';

export default function CommunitiesPage({ onNavigate }) {
  const [activeCategory, setActiveCategory] = useState('Sports');

  const categories = [
    'Sports',
    'Technology', 
    'Art',
    'Entertainment',
    'Gaming',
    'Politics'
  ];

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <button 
          className={styles.backBtn}
          onClick={() => onNavigate('Home')}
        >
          <svg viewBox="0 0 24 24" className={styles.backIcon}>
            <path d="M7.414 13l5.043 5.04-1.414 1.42L3.586 12l7.457-7.46 1.414 1.42L7.414 11H21v2H7.414z" fill="currentColor" />
          </svg>
        </button>
        
        <h1 className={styles.title}>Communities</h1>
        
        <div className={styles.headerActions}>
          <button className={styles.actionBtn}>
            <svg viewBox="0 0 24 24" className={styles.actionIcon}>
              <path d="M10.25 3.75c-3.59 0-6.5 2.91-6.5 6.5s2.91 6.5 6.5 6.5c1.795 0 3.419-.726 4.596-1.904 1.178-1.177 1.904-2.801 1.904-4.596 0-3.59-2.91-6.5-6.5-6.5zm-8.5 6.5c0-4.694 3.806-8.5 8.5-8.5s8.5 3.806 8.5 8.5c0 1.986-.682 3.815-1.824 5.262l4.781 4.781-1.414 1.414-4.781-4.781c-1.447 1.142-3.276 1.824-5.262 1.824-4.694 0-8.5-3.806-8.5-8.5z" fill="currentColor" />
            </svg>
          </button>
          <button className={styles.actionBtn}>
            <svg viewBox="0 0 24 24" className={styles.actionIcon}>
              <path d="M16 4v8l-4-4-4 4V4H4v16h16V4h-4zM8 2h8v12l-4-4-4 4V2z" fill="currentColor" />
            </svg>
          </button>
        </div>
      </div>

      {/* Category Tabs */}
      <div className={styles.categoriesContainer}>
        <div className={styles.categories}>
          {categories.map((category) => (
            <button
              key={category}
              className={`${styles.categoryTab} ${activeCategory === category ? styles.active : ''}`}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className={styles.content}>
        {activeCategory === 'Sports' && (
          <div className={styles.categoryContent}>
            <div className={styles.communityList}>
              <div className={styles.communityItem}>
                <div className={styles.communityAvatar}>
                  <div className={styles.avatarPlaceholder}>⚽</div>
                </div>
                <div className={styles.communityInfo}>
                  <div className={styles.communityName}>Football Fans</div>
                  <div className={styles.communityStats}>125K members</div>
                  <div className={styles.communityDescription}>Discussing the beautiful game</div>
                </div>
                <button className={styles.joinBtn}>Join</button>
              </div>
              
              <div className={styles.communityItem}>
                <div className={styles.communityAvatar}>
                  <div className={styles.avatarPlaceholder}>🏀</div>
                </div>
                <div className={styles.communityInfo}>
                  <div className={styles.communityName}>Basketball Central</div>
                  <div className={styles.communityStats}>89K members</div>
                  <div className={styles.communityDescription}>NBA, college, and street basketball</div>
                </div>
                <button className={styles.joinBtn}>Join</button>
              </div>
            </div>
          </div>
        )}

        {activeCategory === 'Technology' && (
          <div className={styles.categoryContent}>
            <div className={styles.communityList}>
              <div className={styles.communityItem}>
                <div className={styles.communityAvatar}>
                  <div className={styles.avatarPlaceholder}>💻</div>
                </div>
                <div className={styles.communityInfo}>
                  <div className={styles.communityName}>Web Developers</div>
                  <div className={styles.communityStats}>234K members</div>
                  <div className={styles.communityDescription}>Frontend, backend, and full-stack development</div>
                </div>
                <button className={styles.joinBtn}>Join</button>
              </div>
              
              <div className={styles.communityItem}>
                <div className={styles.communityAvatar}>
                  <div className={styles.avatarPlaceholder}>🤖</div>
                </div>
                <div className={styles.communityInfo}>
                  <div className={styles.communityName}>AI & Machine Learning</div>
                  <div className={styles.communityStats}>156K members</div>
                  <div className={styles.communityDescription}>Latest in artificial intelligence</div>
                </div>
                <button className={styles.joinBtn}>Join</button>
              </div>
            </div>
          </div>
        )}

        {activeCategory === 'Art' && (
          <div className={styles.categoryContent}>
            <div className={styles.communityList}>
              <div className={styles.communityItem}>
                <div className={styles.communityAvatar}>
                  <div className={styles.avatarPlaceholder}>🎨</div>
                </div>
                <div className={styles.communityInfo}>
                  <div className={styles.communityName}>Digital Artists</div>
                  <div className={styles.communityStats}>78K members</div>
                  <div className={styles.communityDescription}>Share your digital creations</div>
                </div>
                <button className={styles.joinBtn}>Join</button>
              </div>
            </div>
          </div>
        )}

        {activeCategory === 'Entertainment' && (
          <div className={styles.categoryContent}>
            <div className={styles.communityList}>
              <div className={styles.communityItem}>
                <div className={styles.communityAvatar}>
                  <div className={styles.avatarPlaceholder}>🎬</div>
                </div>
                <div className={styles.communityInfo}>
                  <div className={styles.communityName}>Movie Buffs</div>
                  <div className={styles.communityStats}>192K members</div>
                  <div className={styles.communityDescription}>Discuss movies, TV shows, and series</div>
                </div>
                <button className={styles.joinBtn}>Join</button>
              </div>
            </div>
          </div>
        )}

        {activeCategory === 'Gaming' && (
          <div className={styles.categoryContent}>
            <div className={styles.communityList}>
              <div className={styles.communityItem}>
                <div className={styles.communityAvatar}>
                  <div className={styles.avatarPlaceholder}>🎮</div>
                </div>
                <div className={styles.communityInfo}>
                  <div className={styles.communityName}>Gamers Unite</div>
                  <div className={styles.communityStats}>456K members</div>
                  <div className={styles.communityDescription}>All things gaming - PC, console, mobile</div>
                </div>
                <button className={styles.joinBtn}>Join</button>
              </div>
            </div>
          </div>
        )}

        {activeCategory === 'Politics' && (
          <div className={styles.categoryContent}>
            <div className={styles.communityList}>
              <div className={styles.communityItem}>
                <div className={styles.communityAvatar}>
                  <div className={styles.avatarPlaceholder}>🏛️</div>
                </div>
                <div className={styles.communityInfo}>
                  <div className={styles.communityName}>Political Discussion</div>
                  <div className={styles.communityStats}>289K members</div>
                  <div className={styles.communityDescription}>Respectful political discourse</div>
                </div>
                <button className={styles.joinBtn}>Join</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
