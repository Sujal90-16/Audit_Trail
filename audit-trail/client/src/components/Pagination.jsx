import React from 'react';
import './Pagination.css';

/**
 * Pagination — Page navigation with numbered buttons and ellipsis.
 *
 * Supports:
 * - First/Last page jump
 * - Previous/Next arrows
 * - Smart ellipsis (shows ... for large page ranges)
 * - Items-per-page info text
 *
 * @param {number} currentPage - Active page (1-indexed)
 * @param {number} totalPages - Total number of pages
 * @param {Function} onPageChange - Callback with page number
 * @param {number} totalItems - Total item count (for info text)
 * @param {number} itemsPerPage - Items shown per page (default: 10)
 */
function Pagination({ currentPage, totalPages, onPageChange, totalItems, itemsPerPage = 10 }) {
  if (totalPages <= 1) return null;

  /**
   * Build the page number array with ellipsis markers.
   * Always shows first, last, current, and 1 neighbor on each side.
   */
  const getPageNumbers = () => {
    const pages = [];
    const delta = 1; // neighbors on each side

    const rangeStart = Math.max(2, currentPage - delta);
    const rangeEnd = Math.min(totalPages - 1, currentPage + delta);

    pages.push(1);

    if (rangeStart > 2) pages.push('...');

    for (let i = rangeStart; i <= rangeEnd; i++) {
      pages.push(i);
    }

    if (rangeEnd < totalPages - 1) pages.push('...');

    if (totalPages > 1) pages.push(totalPages);

    return pages;
  };

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems || totalPages * itemsPerPage);

  return (
    <div className="pagination">
      {/* Info text */}
      {totalItems && (
        <span className="pagination-info">
          Showing <strong>{startItem}–{endItem}</strong> of <strong>{totalItems.toLocaleString()}</strong>
        </span>
      )}

      <div className="pagination-controls">
        {/* Previous */}
        <button
          className="pagination-btn pagination-btn--nav"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          aria-label="Previous page"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="15,18 9,12 15,6"/>
          </svg>
        </button>

        {/* Page numbers */}
        {getPageNumbers().map((page, i) =>
          page === '...' ? (
            <span key={`ellipsis-${i}`} className="pagination-ellipsis">…</span>
          ) : (
            <button
              key={page}
              className={`pagination-btn pagination-btn--page ${page === currentPage ? 'pagination-btn--active' : ''}`}
              onClick={() => onPageChange(page)}
              aria-label={`Page ${page}`}
              aria-current={page === currentPage ? 'page' : undefined}
            >
              {page}
            </button>
          )
        )}

        {/* Next */}
        <button
          className="pagination-btn pagination-btn--nav"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          aria-label="Next page"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="9,18 15,12 9,6"/>
          </svg>
        </button>
      </div>
    </div>
  );
}

export default Pagination;
