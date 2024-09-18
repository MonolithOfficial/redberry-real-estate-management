import React from 'react';
import styles from '../styles/header.scss';

const Header = () => {
    return (
      <header id="header">
        <a href='/'>
          <img id="logo" src='/images/header-logo.png'/>
        </a>
      </header>
    );
  };
  
  export default Header;