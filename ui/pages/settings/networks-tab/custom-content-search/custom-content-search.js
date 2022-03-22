import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import Fuse from 'fuse.js';
import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '../../../../components/ui/text-field';
import { I18nContext } from '../../../../contexts/i18n';
import SearchIcon from '../../../../components/ui/search-icon';

export default function CustomContentSearch({
  onSearch,
  error,
  networksList,
  searchQueryInput,
}) {
  const t = useContext(I18nContext);
  const [searchIconColor, setSearchIconColor] = useState('#9b9b9b');

  const networksListArray = Object.values(networksList);
  const networksSearchFuse = new Fuse(networksListArray, {
    shouldSort: true,
    threshold: 0.2,
    location: 0,
    distance: 100,
    maxPatternLength: 32,
    minMatchCharLength: 1,
    keys: ['label', 'labelKey'],
  });

  const handleSearch = async (searchQuery) => {
    if (searchQuery === '') {
      setSearchIconColor('#9b9b9b');
    } else {
      setSearchIconColor('var(--color-icon-default)');
    }

    const fuseSearchResult = networksSearchFuse.search(searchQuery);
    const results = searchQuery ? [...fuseSearchResult] : networksListArray;
    await onSearch({ searchQuery, results });
  };

  const renderStartAdornment = () => {
    return (
      <InputAdornment position="start">
        <SearchIcon color={searchIconColor} />
      </InputAdornment>
    );
  };

  const renderEndAdornment = () => {
    return (
      <>
        {searchQueryInput && (
          <InputAdornment
            className="imageclosectn"
            position="end"
            onClick={() => handleSearch('')}
          >
            <i
              className="fa fa-close imageclose"
              width="17"
              height="17"
              title="Close"
            />
          </InputAdornment>
        )}
      </>
    );
  };

  return (
    <TextField
      id="search-networks"
      placeholder={t('customContentSearch')}
      type="text"
      value={searchQueryInput}
      onChange={(e) => handleSearch(e.target.value)}
      error={error}
      fullWidth
      autoFocus
      autoComplete="off"
      classes={{
        inputRoot: 'networks-tab__networks-list__custom-search-network',
      }}
      startAdornment={renderStartAdornment()}
      endAdornment={renderEndAdornment()}
    />
  );
}

CustomContentSearch.propTypes = {
  onSearch: PropTypes.func,
  error: PropTypes.string,
  networksList: PropTypes.array,
  searchQueryInput: PropTypes.string,
};
