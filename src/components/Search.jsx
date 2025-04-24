import { useState } from "react";

function Search({ setSearch }) {
  const [input, setInput] = useState("");

  const handleSearch = (e) => {
    const value = e.target.value;
    setInput(value);
    setSearch(value.toLowerCase());
  };

  return (
    <div className="titleSearch">
      <div>
        <img src="pokedex.png" alt="pokedex image" />
      </div>
      <div className="search">
        <div className="searchInput">
          <input
            type="text"
            placeholder="search, eg, ditto or pikachu..."
            value={input}
            onChange={handleSearch}
          />
        </div>
        <div className="searchBar">
          <img src="search-button.svg" alt="search-button image" style={{ width: "23px" }} />
        </div>
      </div>
    </div>
  );
}

export default Search;
