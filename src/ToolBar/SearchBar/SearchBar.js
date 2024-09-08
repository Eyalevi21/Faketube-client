import React, { useRef, useEffect } from 'react';
import './SearchBar.css';  
import { useNavigate } from "react-router-dom";


  function SearchBar({ doSearch, setSearchResult, videoList }) {
    const navigate = useNavigate();
    const searchBox = useRef(null);
    const originalListRef = useRef(null);
    useEffect(() => {
      // Store the initial video list in the originalListRef only once
      if (!originalListRef.current) {
        originalListRef.current = videoList;
      }
    }, [videoList]);
    const handleSearch = () => {
      navigate('/');
      const filteredList = doSearch(searchBox.current.value, originalListRef.current);
      {setSearchResult(filteredList)};      
    };
  return (
    <div className='SearchBar'>
        <input ref={searchBox} type='text' className='form-control' placeholder='Search' aria-label='Search' aria-describedby='button-addon2'></input>
        <button onClick={handleSearch} className='btn' type='button' id='button-addon2'> <i className='bi bi-search'></i> </button>
    </div>
  );
}

export default SearchBar;

