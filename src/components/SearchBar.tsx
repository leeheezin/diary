import React from 'react';
import { FiSearch } from 'react-icons/fi'; // react-icons에서 돋보기 아이콘을 불러옵니다.

interface SearchBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  handleSearch: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ searchTerm, setSearchTerm, handleSearch }) => (
  <div className="max-w-xs flex items-center">
    <div className="relative flex-1">
      <input
        type="text"
        placeholder="검색"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full py-2 border-b-2 border-gray-300 focus:outline-none focus:border-purple-500 pr-10" // 오른쪽에 여백 추가
        style={{
          borderTop: "none", // 상단 보더 제거
          borderLeft: "none", // 왼쪽 보더 제거
          borderRight: "none", // 오른쪽 보더 제거
          borderBottom: "1px solid #d1d5db", // 하단 보더 명시적으로 추가
        }}
      />
      <button
        onClick={handleSearch}
        className="absolute right-3 top-1.5 transform -translate-y-1/2 text-gray-500 hover:text-purple-600"
        style={{top: "10px", right: "5px"}}
      >
        <FiSearch size={20} />
      </button>
    </div>
  </div>
);

export default SearchBar;
