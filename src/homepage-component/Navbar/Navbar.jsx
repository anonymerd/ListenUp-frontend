import React, {Component} from 'react';
import './Navbar.css';

function Navbar(props) {
  //console.log(props);
  // const logoutHandler = () => {
  //   axios({
  //     method:"GET",
  //     url: `${props.SERVER_ADDRESS}logout`
  //   }).then((response) => {
  //     console.log(response);
  //   })
  // }
  return (
    <>
      <div className='navbar'>
        <div className='site-name'>Music Player</div>
        <div
          className='user-icon'
          style={{
            backgroundImage: `url(${props.userimageUrl})`,
          }}
        ></div>
      </div>
      <hr className='navbar-hr' />
    </>
  );
}

export default Navbar;
