/**
 * MedicationsPagination Component
 * Purpose: Pagination controls for medications
 * Features: Page navigation, page size selection, total counts
 */

import React from 'react';

interface MedicationsPaginationProps {
  currentPage: number;
  pageSize: number;
  totalCount: number;
  onPageChange: (page: number, pageSize: number) => void;
}

export const MedicationsPagination: React.FC<MedicationsPaginationProps> = ({
  currentPage,
  pageSize,
  totalCount,
  onPageChange
}) => {
  const totalPages = Math.ceil(totalCount / pageSize);
  const startIndex = (currentPage - 1) * pageSize + 1;
  const endIndex = Math.min(currentPage * pageSize, totalCount);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page, pageSize);
    }
  };

  const handlePageSizeChange = (newPageSize: number) => {
    const newPage = Math.ceil((currentPage - 1) * pageSize / newPageSize) + 1;
    onPageChange(newPage, newPageSize);
  };

  const getPageNumbers = () => {
    const pages: number[] = [];
    const maxVisiblePages = 5;
    
    let start = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let end = Math.min(totalPages, start + maxVisiblePages - 1);
    
    if (end - start + 1 < maxVisiblePages) {
      start = Math.max(1, end - maxVisiblePages + 1);
    }
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    return pages;
  };

  if (totalCount === 0) {
    return null;
  }

  return (
    <div className="medications-pagination">
      <div className="pagination-info">
        <span>
          Showing {startIndex}-{endIndex} of {totalCount} medications
        </span>
      </div>

      <div className="pagination-controls">
        {/* Page Size Selector */}
        <div className="page-size-selector">
          <label htmlFor="pageSize">Per page:</label>
          <select
            id="pageSize"
            value={pageSize}
            onChange={(e) => handlePageSizeChange(Number(e.target.value))}
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>

        {/* Page Navigation */}
        <div className="page-navigation">
          {/* First Page */}
          <button
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1}
            className="page-button first"
            title="First page"
          >
            ««
          </button>

          {/* Previous Page */}
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="page-button previous"
            title="Previous page"
          >
            ‹
          </button>

          {/* Page Numbers */}
          {getPageNumbers().map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`page-button ${page === currentPage ? 'active' : ''}`}
              title={`Page ${page}`}
            >
              {page}
            </button>
          ))}

          {/* Next Page */}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="page-button next"
            title="Next page"
          >
            ›
          </button>

          {/* Last Page */}
          <button
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages}
            className="page-button last"
            title="Last page"
          >
            »»
          </button>
        </div>
      </div>

      {/* Jump to Page */}
      <div className="jump-to-page">
        <label htmlFor="jumpToPage">Go to page:</label>
        <input
          id="jumpToPage"
          type="number"
          min={1}
          max={totalPages}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              const target = e.target as HTMLInputElement;
              const page = Number(target.value);
              if (page >= 1 && page <= totalPages) {
                handlePageChange(page);
                target.value = '';
              }
            }
          }}
          placeholder={`1-${totalPages}`}
        />
      </div>
    </div>
  );
};

export default MedicationsPagination;
