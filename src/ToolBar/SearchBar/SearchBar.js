import React, { useRef, useEffect } from 'react';
import './SearchBar.css';  
import { useNavigate } from "react-router-dom";


  function SearchBar({ setVideos, token}) {
    const navigate = useNavigate();
    const searchBox = useRef(null);
    const originalListRef = useRef(null);
    const handleSearch = async (searchTerm) => {
      try {
        let url;
    
        // Check if searchTerm is empty
        if (!searchTerm) {
          // If searchTerm is empty, make a regular GET request to /videos
          url = 'http://localhost:880/api/videos';
        } else {
          // If searchTerm is not empty, search for videos using the search key
          url = `http://localhost:880/api/videos/search?key=${encodeURIComponent(searchTerm)}`;
        }
    
        // Fetch videos from the server
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {}) // Add Authorization header if token exists
          }
        });        
        if (response.ok) {
          const data = await response.json();
          setVideos(data); // Set the fetched videos
        } else {
          throw new Error('Failed to fetch videos');
        }
    
        // After fetching, navigate to home 
        navigate('/');           
      } catch (err) {
        console.error('Error fetching videos:', err);
      }
    };
    const handleKeyPress = (event) => {
      if (event.key === 'Enter') {
        handleSearchClick(); // Call handleSearchClick when Enter is pressed
      }
    };

    const handleSearchClick = async () => {
      const searchTerm = searchBox.current.value; // Get search term from input
      try {
        await handleSearch(searchTerm); // Await the handleSearch function, even if searchTerm is empty
      } catch (err) {
        console.error('Error during search:', err);
      }
    };
  return (
    <div className="SearchBar">
    <input
      ref={searchBox}
      type="text"
      className="form-control"
      placeholder="Search"
      aria-label="Search"
      aria-describedby="button-addon2"
      onKeyDown={handleKeyPress}
      onFocus={() => document.querySelector('.SearchBar').classList.add('focused')} // Add focus class
      onBlur={() => document.querySelector('.SearchBar').classList.remove('focused')} // Remove focus class
    />
    <button onClick={handleSearchClick} className="btn" type="button" id="button-addon2">
      <i className="bi bi-search"></i>
    </button>
  </div>
  );
}

export default SearchBar;

