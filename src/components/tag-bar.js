import React from 'react';
import styles from '../styles/tag-bar.scss';

const TagBar = ({ removeStateProperty, removeRegion, state }) => {
  const cross = (
    <svg className='cross' width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10.5 4L3.5 11" stroke="#354451" stroke-linecap="round" stroke-linejoin="round" />
      <path d="M3.5 4L10.5 11" stroke="#354451" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
  );

  const handleParentStateRemoveProperty = (property) => {
    removeStateProperty(property);
  };

  const renderPriceTag = () => {
    const { minPrice, maxPrice } = state;

    if (minPrice === null && maxPrice === null) {
      return null;
    }

    if (minPrice !== null && maxPrice === null) {
      return <li className='filter-tag'><h4>{minPrice} - ∞</h4><div onClick={() => {
        handleParentStateRemoveProperty('minPrice');
        handleParentStateRemoveProperty('maxPrice');
      }}>{cross}</div></li>;
    }

    if (minPrice === null && maxPrice !== null) {
      return <li className='filter-tag'><h4>∞ - {maxPrice}</h4><div onClick={() => {
        handleParentStateRemoveProperty('minPrice');
        handleParentStateRemoveProperty('maxPrice');
      }}>{cross}</div></li>;
    }

    return <li className='filter-tag'><h4>{minPrice} - {maxPrice}</h4><div onClick={() => {
      handleParentStateRemoveProperty('minPrice');
      handleParentStateRemoveProperty('maxPrice');
    }}>{cross}</div></li>;
  };

  const renderAreaTag = () => {
    const { minArea, maxArea } = state;

    if (minArea === null && maxArea === null) {
      return null;
    }

    if (minArea !== null && maxArea === null) {
      return <li className='filter-tag'><h4>{minArea} - ∞</h4><div onClick={() => {
        handleParentStateRemoveProperty('minArea');
        handleParentStateRemoveProperty('maxArea');
      }}>{cross}</div></li>;
    }

    if (minArea === null && maxArea !== null) {
      return <li className='filter-tag'><h4>∞ - {maxArea}</h4><div onClick={() => {
        handleParentStateRemoveProperty('minArea');
        handleParentStateRemoveProperty('maxArea');
      }}>{cross}</div></li>;
    }

    return <li className='filter-tag'><h4>{minArea} - {maxArea}</h4><div onClick={() => {
      handleParentStateRemoveProperty('minArea');
      handleParentStateRemoveProperty('maxArea');
    }}>{cross}</div></li>;
  };

  const renderRoomsTag = () => {
    const { rooms } = state;

    if (rooms === null) {
      return null;
    }

    return <li className='filter-tag'><h4>{rooms}</h4><div onClick={() => {
      handleParentStateRemoveProperty('rooms');
    }}>{cross}</div></li>;
  };

  return (
    <div id='tag-bar-holder'>
      <ul>
        {state.region.map((regionItem, index) => (
          <li key={index} className='filter-tag'>
            <h4>{regionItem}</h4>
            <div onClick={() => {
              removeRegion(regionItem);
            }}>{cross}</div>
          </li>
        ))}
        {renderPriceTag()}
        {renderAreaTag()}
        {renderRoomsTag()}
      </ul>
    </div>
  );
};

export default TagBar;