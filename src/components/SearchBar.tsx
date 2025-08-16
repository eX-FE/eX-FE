'use client';

import React, { useState } from 'react';
import styles from './SearchBar.module.css';

interface SearchBarProps {
  onSearch?: (query: string) => void;
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  onSearch, 
  placeholder = "Search Twitter" 
}) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch && query.trim()) {
      onSearch(query.trim());
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  return (
    <div className={styles.searchContainer}>
      <form onSubmit={handleSubmit} className={styles.searchForm}>
        <div className={`${styles.searchInputContainer} ${isFocused ? styles.focused : ''}`}>
          <svg className={styles.searchIcon} width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M10.25 3.75c-3.59 0-6.5 2.91-6.5 6.5s2.91 6.5 6.5 6.5c1.795 0 3.419-.726 4.596-1.904 1.178-1.177 1.904-2.801 1.904-4.596 0-3.59-2.91-6.5-6.5-6.5zm-8.5 6.5c0-4.694 3.806-8.5 8.5-8.5s8.5 3.806 8.5 8.5c0 1.986-.682 3.815-1.824 5.262l4.781 4.781-1.414 1.414-4.781-4.781c-1.447 1.142-3.276 1.824-5.262 1.824-4.694 0-8.5-3.806-8.5-8.5z"/>
          </svg>
          <input
            type="text"
            value={query}
            onChange={handleInputChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={placeholder}
            className={styles.searchInput}
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className={styles.clearButton}
              aria-label="Clear search"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.36 6.64c.78-.78.78-2.05 0-2.83-.78-.78-2.05-.78-2.83 0L12 7.34 8.47 3.81c-.78-.78-2.05-.78-2.83 0-.78.78-.78 2.05 0 2.83L9.17 10l-3.53 3.53c-.78.78-.78 2.05 0 2.83.39.39.9.59 1.42.59s1.02-.2 1.41-.59L12 12.83l3.53 3.53c.39.39.9.59 1.42.59s1.02-.2 1.41-.59c.78-.78.78-2.05 0-2.83L14.83 10l3.53-3.36z"/>
              </svg>
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default SearchBar;
