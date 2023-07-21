// lib
import React from 'react';
import PropTypes from 'prop-types';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/fontawesome-free-solid';

const SearchBar = ({ searchText, onSearchTextInput }) => (
  <div className="input-group mr-sm-2 mb-sm-0">
    <div className="input-group-prepend">
      <span className="input-group-text">
        <FontAwesomeIcon icon={faSearch} />
      </span>
    </div>
    <input
      className="form-control"
      type="text"
      placeholder="essayez &laquo; musique &raquo;, &laquo; lc &raquo;..."
      value={searchText}
      onChange={(e) => onSearchTextInput(e.target.value)}
    />
  </div>
);

SearchBar.propTypes = {
  searchText: PropTypes.string.isRequired,
  onSearchTextInput: PropTypes.func.isRequired,
};

export default SearchBar;
