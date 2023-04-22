import React, { useContext } from "react";
import { FaSearch } from "react-icons/fa";
import "./SearchBar.css";
import { AuthContext } from "../../../../../context/Authentication/AuthState";

const SearchBar = ({customerEmail}) => {
  const {GetCustomerDetails} = useContext(AuthContext);
  const handleSearch = (e) => {
    GetCustomerDetails(e.target.search.value)
    e.preventDefault();
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", padding: "2rem" }}>
      <form onSubmit={handleSearch} className="search-form">
        <div className="search-container">
          <input
            type="text"
            name="search"
            defaultValue = {customerEmail ? customerEmail : ""}
            placeholder="Enter customer email address..."
            className="search-input"
          />
          <button type="submit" className="search-icon">
            <FaSearch />
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchBar;
