import React, { useState } from 'react';

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchTermChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Handle the search term here
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={searchTerm}
        onChange={handleSearchTermChange}
        placeholder="Search..."
      />
      <button type="submit">Search</button>
    </form>
  );
};

export default SearchBar;
