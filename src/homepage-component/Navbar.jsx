import React, { Component } from 'react';
import './Navbar.css';
import userIcon from '../assets/images/img10.jpg';
function Navbar(props) {
  return (
    <>
      <div className='navbar'>
        <div className='site-name'>Music Player</div>
        <div
          className='user-icon'
          style={{
            backgroundImage: `url(${userIcon})`,
          }}
        ></div>
      </div>
      <hr className='navbar-hr' />
    </>
  );
}

export default Navbar;
