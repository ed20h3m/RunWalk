import React, { useContext, useState } from "react";
import { FaSearch, FaTimes } from "react-icons/fa";
import "./SearchBar.css";
import { AuthContext } from "../../../../../context/Authentication/AuthState";

const SearchBar = ({ customerEmail }) => {
  const { GetCustomerDetails } = useContext(AuthContext);
  const [prevale, setVale] = useState({ search: customerEmail });

  const handleSearch = (e) => {
    GetCustomerDetails(prevale.search);
    e.preventDefault();
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setVale({ ...prevale, [name]: value });
    e.preventDefault();
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", padding: "2rem" }}>
      <div className="search-container">
        <input
          type="text"
          name="search"
          placeholder="Enter customer email address..."
          className="search-input"
          defaultValue={customerEmail ? customerEmail : ""}
          onChange={handleChange}
          value={prevale.search}
        />

        <button type="submit" className="search-icon">
          <FaSearch onClick={handleSearch} />
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
