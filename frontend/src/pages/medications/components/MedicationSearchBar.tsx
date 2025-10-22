/**
 * MedicationSearchBar Component
 * Purpose: Search functionality across medications
 * Features: Drug name, student, generic/brand search
 */

import React, { useState } from 'react';

interface MedicationSearchBarProps {
  onSearch?: (query: string) => void;
}

const MedicationSearchBar: React.FC<MedicationSearchBarProps> = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(query);
    }
  };

  return (
    <div className="medication-search-bar">
      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search medications..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>
    </div>
  );
};

export default MedicationSearchBar;
