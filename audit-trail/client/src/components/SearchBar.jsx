import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useDebounce } from '../hooks/useDebounce';
import EventBadge from './EventBadge';
import './SearchBar.css';

/**
 * Mock suggestion data — simulates autocomplete results
 * from the CQRS read model. Will be replaced with real API calls.
 */
const MOCK_SUGGESTIONS = [
  { id: 'SHIP-2024-0847', route: 'Shanghai → Los Angeles', status: 'In Transit', lastEvent: 'ARRIVED_AT_PORT' },
  { id: 'SHIP-2024-0621', route: 'Rotterdam → Mumbai', status: 'Delivered', lastEvent: 'DELIVERED' },
  { id: 'SHIP-2024-0103', route: 'Hamburg → Singapore', status: 'Alert', lastEvent: 'TEMPERATURE_SPIKE' },
  { id: 'SHIP-2024-0489', route: 'Busan → Seattle', status: 'In Transit', lastEvent: 'LOADED_ON_SHIP' },
  { id: 'SHIP-2024-0952', route: 'Rotterdam → Mumbai', status: 'Created', lastEvent: 'CONTAINER_CREATED' },
  { id: 'SHIP-2024-1100', route: 'Shenzhen → Hamburg', status: 'In Transit', lastEvent: 'LOADED_ON_SHIP' },
  { id: 'SHIP-2024-0755', route: 'Tokyo → Vancouver', status: 'Delivered', lastEvent: 'DELIVERED' },
];

function SearchBar({ onSearch, placeholder = 'Search shipment by ID (e.g., SHIP-2024-0847)' }) {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [suggestions, setSuggestions] = useState([]);

  const inputRef = useRef(null);
  const dropdownRef = useRef(null);
  const debouncedQuery = useDebounce(query, 200);

  // Filter suggestions based on debounced query
  useEffect(() => {
    if (debouncedQuery.trim().length >= 1) {
      const filtered = MOCK_SUGGESTIONS.filter(
        (s) =>
          s.id.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
          s.route.toLowerCase().includes(debouncedQuery.toLowerCase())
      );
      setSuggestions(filtered);
      setShowDropdown(filtered.length > 0);
      setActiveIndex(-1);
    } else {
      setSuggestions([]);
      setShowDropdown(false);
    }
  }, [debouncedQuery]);

  // Global Ctrl/Cmd+K shortcut to focus search
  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (activeIndex >= 0 && suggestions[activeIndex]) {
      selectSuggestion(suggestions[activeIndex]);
    } else {
      onSearch(query);
      setShowDropdown(false);
    }
  };

  const selectSuggestion = (suggestion) => {
    setQuery(suggestion.id);
    setShowDropdown(false);
    setActiveIndex(-1);
    onSearch(suggestion.id);
  };

  const handleKeyDown = (e) => {
    if (!showDropdown) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActiveIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
        break;
      case 'Escape':
        setShowDropdown(false);
        setActiveIndex(-1);
        break;
      default:
        break;
    }
  };

  return (
    <div className="search-wrapper" ref={dropdownRef}>
      <form
        className={`search-bar ${isFocused ? 'search-bar--focused' : ''}`}
        onSubmit={handleSubmit}
      >
        <div className="search-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/>
            <path d="M21 21l-4.35-4.35"/>
          </svg>
        </div>
        <input
          ref={inputRef}
          id="shipment-search"
          type="text"
          className="search-input"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            setIsFocused(true);
            if (suggestions.length > 0) setShowDropdown(true);
          }}
          onBlur={() => setIsFocused(false)}
          onKeyDown={handleKeyDown}
          autoComplete="off"
          role="combobox"
          aria-expanded={showDropdown}
          aria-autocomplete="list"
          aria-activedescendant={activeIndex >= 0 ? `suggestion-${activeIndex}` : undefined}
        />
        {query && (
          <button
            type="button"
            className="search-clear"
            onClick={() => {
              setQuery('');
              setSuggestions([]);
              setShowDropdown(false);
              inputRef.current?.focus();
            }}
            aria-label="Clear search"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        )}
        <button type="submit" className="search-button" disabled={!query.trim()}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
          </svg>
          Search
        </button>
        <div className="search-shortcut">
          <kbd>⌘</kbd><kbd>K</kbd>
        </div>
      </form>

      {/* Autocomplete Dropdown */}
      {showDropdown && (
        <div className="search-dropdown animate-fade-in-scale" role="listbox">
          <div className="dropdown-header">
            <span className="dropdown-label">Suggestions</span>
            <span className="dropdown-count">{suggestions.length} found</span>
          </div>
          {suggestions.map((suggestion, index) => (
            <div
              key={suggestion.id}
              id={`suggestion-${index}`}
              className={`dropdown-item ${index === activeIndex ? 'dropdown-item--active' : ''}`}
              onClick={() => selectSuggestion(suggestion)}
              onMouseEnter={() => setActiveIndex(index)}
              role="option"
              aria-selected={index === activeIndex}
            >
              <div className="dropdown-item-left">
                <span className="dropdown-item-id">{suggestion.id}</span>
                <span className="dropdown-item-route">{suggestion.route}</span>
              </div>
              <EventBadge type={suggestion.lastEvent} size="sm" />
            </div>
          ))}
          <div className="dropdown-footer">
            <span>
              <kbd>↑</kbd><kbd>↓</kbd> navigate
            </span>
            <span>
              <kbd>↵</kbd> select
            </span>
            <span>
              <kbd>esc</kbd> close
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export default SearchBar;
