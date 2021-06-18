import React, { useRef } from 'react';
import { GoogleLogin, GoogleLogout } from 'react-google-login';
import { useTransition, animated } from 'react-spring';

import './Navbar.css';
import dropDownIcon from '../../assets/icons/drop-down-arrow.svg';
import googleIcon from '../../assets/icons/google-icon.svg';

const Navbar = (props) => {
  // const fadeIn = useTransition({
  //   from: { opacity: 0, height: '0px' },
  //   enter: { opacity: 1, height: '100px' },
  //   leave: { opacity: 0, height: '0px' },
  // });

  const dropDown = useRef(null);

  let isDisplaying = false;
  const toggleDropDown = () => {
    if (isDisplaying) {
      isDisplaying = false;
      dropDown.current.style.visibility = 'hidden';
    } else {
      isDisplaying = true;
      dropDown.current.style.visibility = 'visible';
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

          {props.isLoggedIn ? (
            <div className='dropdown-content' ref={dropDown}>
              <button>Profile</button>
              <GoogleLogout
                className='logout-button'
                clientId={props.clientId}
                buttonText='Logout'
                onLogoutSuccess={props.logoutSuccess}
                onFailure={props.logoutFaliure}
                icon={false}
              >
                <span>Sign Out</span>
              </GoogleLogout>
            </div>
          ) : null}
        </div>
      </div>
      <hr className='navbar-hr' />
    </>
  );
};

export default Navbar;
