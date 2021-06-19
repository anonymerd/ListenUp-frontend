import React, { useState } from 'react';
import { GoogleLogin, GoogleLogout } from 'react-google-login';

import './Navbar.css';

// Importing Icons
import dropDownIcon from '../../assets/icons/drop-down-arrow.svg';
import googleIcon from '../../assets/icons/google-icon.svg';

const Navbar = (props) => {
  const [isDropdownVisible, setDropDownVisibility] = useState(false);

  const toggleDropDown = () => {
    if (isDropdownVisible) {
      console.log(isDropdownVisible);
      setDropDownVisibility(false);
    } else {
      console.log(isDropdownVisible);

      setDropDownVisibility(true);
    }
  };
  return (
    <>
      <div className='navbar'>
        <div className='site-name'>Music Player</div>
        <div className='user-icon-wrapper'>
          {props.isLoggedIn ? (
            <div className='user-icon-container' onClick={toggleDropDown}>
              <div
                className='user-icon'
                style={{
                  backgroundImage: `url(${props.userIcon})`,
                }}
              />
              <div className='drop-down-icon-container'>
                <img src={dropDownIcon} />
              </div>
            </div>
          ) : (
            <div className='signin-button'>
              <GoogleLogin
                className='google-login-button'
                clientId={props.clientId}
                onSuccess={props.onLoginSuccess}
                onFailure={props.onLoginFaliure}
                cookiePolicy={'single_host_origin'}
                isSignedIn={true}
                icon={false}
              >
                <img
                  src={googleIcon}
                  alt='Google Icon'
                  className='google-icon'
                />
                <span>Sign In</span>
              </GoogleLogin>
            </div>
          )}

          {/* DropDown that contains logout button */}

          {isDropdownVisible ? (
            <div className='dropdown-container'>
              <div className='dropdown-content'>Profile</div>
              <div className='dropdown-content'>
                <GoogleLogout
                  className='logout-button'
                  clientId={props.clientId}
                  onLogoutSuccess={props.onLogoutSuccess}
                  onFailure={props.onLogoutFaliure}
                  icon={false}
                >
                  Sign Out
                </GoogleLogout>
              </div>
            </div>
          ) : null}
        </div>
      </div>
      <hr className='navbar-hr' />
    </>
  );
};

export default Navbar;
