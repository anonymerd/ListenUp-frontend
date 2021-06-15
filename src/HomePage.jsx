import React, { Component } from 'react';

import Navbar from './homepage-component/Navbar/Navbar';
import Player from './homepage-component/Player/Player';

import './HomePage.css';

import mainImage from './assets/images/img12.jpg';
import googleIcon from './assets/icons/google-icon.svg';

export default class HomePage extends Component {
  state = {
    isSongPlaying: false,
    currSongTime: 0,
    currSongDuration: 0,
  };

  currSong = new Audio('http://localhost:8000/');

  componentDidMount() {
    this.currSong.addEventListener('canplaythrough', () => {
      this.setState({
        currSongDuration: this.currSong.duration,
      });
    });
    this.currSong.ontimeupdate = () => {
      this.setState({
        currSongTime: this.currSong.currentTime,
      });
    };
  }

  toggleSong = () => {
    if (this.currSong.paused) this.currSong.play();
    else this.currSong.pause();
  };

  render() {
    return (
      <div class='wrapper'>
        <Navbar />
        <div className='container'>
          <div className='main-section'>
            <section className='main-section-left'>
              <div className='homepage-heading'>Listen to AD free music </div>
              <div className='homepage-subheading'>
                All your favourite artists at one spot.
              </div>
              <div className='signin-button'>
                <button>
                  <img
                    src={googleIcon}
                    alt='Google Icon'
                    className='google-icon'
                  />
                  <span>Sign In With Google</span>
                </button>
              </div>
            </section>
            <section className='main-section-right'>
              <div className='right-section-container'>
                <div className='right-section-popups music-details-container'>
                  <div
                    className='track-icon'
                    style={{
                      backgroundImage:
                        'url(https://www.gannett-cdn.com/media/USATODAY/USATODAY/2013/08/27/1377616803000-XXX-D0-EMINEM-COVER-ALBUM-21-GRAPHIC.jpg)',
                    }}
                  ></div>
                  <div className='track-info-container'>
                    <span className='now-playing'>Now Playing</span>
                    <span className='track-name'>The Real Slim Shady</span>
                    <span className='artist-name'>Eminem</span>
                  </div>
                </div>
                <div
                  className='main-image-container'
                  style={{
                    backgroundImage: `url(${mainImage})`,
                  }}
                ></div>
                <div className='right-section-popups music-player-container'>
                  <Player
                    clicked={this.toggleSong}
                    currSongTime={this.state.currSongTime}
                    currSongDuration={this.state.currSongDuration}
                  />
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    );
  }
}
