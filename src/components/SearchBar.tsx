import React from 'react';

interface SearchBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  handleSearch: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ searchTerm, setSearchTerm, handleSearch }) => (
  <div className="w-full max-w-2xl mb-4 flex items-center gap-1">
    <input
      type="text"
      placeholder="검색"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      className="flex-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
    />
    <button
      onClick={handleSearch}
      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
    >
      검색
    </button>
  </div>
);

export default SearchBar;
