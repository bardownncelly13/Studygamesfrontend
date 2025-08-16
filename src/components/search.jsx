import React from 'react'

const Search = ({ searchTerm, setSearchTerm, placeholder }) => {
  return (
    <div className="search">
      <div>
        <img src="search.svg" alt="search" />
          <label htmlFor="searchinput" className="sr-only">
            Search games
          </label>
        <input
          id="searchinput"
          type="text"
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
    </div>
  )
}
export default Search