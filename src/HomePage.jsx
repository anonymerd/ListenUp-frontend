import React, { Component } from 'react';

import './HomePage.css';
import Navbar from './homepage-component/Navbar';
import mainImage from './assets/images/img12.jpg';
import googleIcon from './assets/icons/google-icon.svg';

const imgURL = 'https://source.unsplash.com/1600x900/?songs';

const audio = new Audio('http://localhost:8000/');

export default class HomePage extends Component {
  audio = new Audio('http://localhost:8000/');

  toggleSong = () => {
    // const player = document.getElementById('track-player');
    // if (player.paused) player.play();
    // else player.pause();
    if (this.audio.paused) this.audio.play();
    else this.audio.pause();

    console.log(audio.paused);
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
                  <audio autoplay controls id='track-player'>
                    <source src='http://localhost:8000/' type='audio/mpeg' />
                  </audio>
                  <button
                    className='btn toggle-song-btn'
                    onClick={this.toggleSong}
                  >
                    Play/Pause
                  </button>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    );
  }
}
