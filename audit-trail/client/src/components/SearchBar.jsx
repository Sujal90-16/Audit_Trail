import React, { useState } from 'react';
import './SearchBar.css';

function SearchBar({ onSearch, placeholder = 'Search shipment by ID (e.g., SHIP-2024-0847)' }) {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form className={`search-bar ${isFocused ? 'search-bar--focused' : ''}`} onSubmit={handleSubmit}>
      <div className="search-icon">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"/>
          <path d="M21 21l-4.35-4.35"/>
        </svg>
      </div>
      <input
        id="shipment-search"
        type="text"
        className="search-input"
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        autoComplete="off"
      />
      <button type="submit" className="search-button" disabled={!query.trim()}>
        Search
      </button>
      <div className="search-shortcut">
        <kbd>⌘</kbd><kbd>K</kbd>
      </div>
    </form>
  );
}

export default SearchBar;
