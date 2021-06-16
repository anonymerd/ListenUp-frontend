import React, {Component} from 'react';
import { GoogleLogout } from 'react-google-login';
import downArrow from '../../assets/icons/drop-down-arrow.svg';
import './Navbar.css';

export default class Navbar extends Component{
  state = {
    display:'none',
  }
  toggleClass = () => {
    if(this.state.display === 'none') {
      this.setState({
        display:'block'
      });
    }
    else {
      this.setState({
        display:'none'
      });
    }
  }

  render() {
    return (
      <>
        <div className='navbar'>
          <div className='site-name'>Music Player</div>
          <div className="dropdown" onClick = {this.toggleClass}>
            <div style={{display:'flex',alignItems:'center'}}>
              <div
                className='user-icon'
                style={{
                  backgroundImage: `url(${this.props.userimageUrl})`,
                }}
              ></div>
              <div onClick = {this.toggleClass}>
                <img src={downArrow} style={{height: '16px',marginLeft: '10px'}}/>
              </div>
            </div>
            <div className="dropdown-content" style = {this.state}>
              <GoogleLogout
                  className = "logout-button"
                  clientId="658977310896-knrl3gka66fldh83dao2rhgbblmd4un9.apps.googleusercontent.com"
                  buttonText="Logout"
                  onLogoutSuccess={this.props.logoutSuccess}
                  onFailure={this.props.logoutFaliure}
                  icon={false}
                >
                <span>Sign Out</span>
              </GoogleLogout>
            </div>
          </div>
        </div>
        <hr className='navbar-hr' />
      </>
    );
  }
}

