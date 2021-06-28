import React, { Component } from 'react';
import { GoogleLogin } from 'react-google-login';
import { Link } from 'react-router-dom';

import Navbar from './Navbar/Navbar';
import Player from './Player/Player';
import history from '../history';
import './Homepage.css';

import userIcon from '../assets/images/img10.jpg';
import mainImage from '../assets/images/img12.jpg';
import googleIcon from '../assets/icons/google-icon.svg';
import loaderIcon from '../assets/icons/loader.svg';

const axios = require('axios');

const SERVER_ADDRESS = 'http://localhost:8000/api';
const CLIENT_ID =
  '390511031158-234aa4gmc6oadsj6inuku9hi9f6ug8vq.apps.googleusercontent.com';

export default class Homepage extends Component {
  state = {
    // Song Details
    currSong: new Audio(),
    hasSongLoaded: false,
    isSongPlaying: false,
    songName: '',
    songArtist: '',
    albumArt: '',
    streamAddress: '',
    songTimeElapsed: 0,
    songDuration: 0,
    songVolume: 5,

    // User Details
    isLoggedIn: false,
    userName: '',
    userEmail: '',
    userIcon: userIcon,
    userAuthToken: '',
  };

  loader = (
    <div className='loader-container'>
      <img src={loaderIcon} alt='Loader Icon' />
    </div>
  );

  getRandomSong = async () => {
    try {
      const result = await axios.get(`${SERVER_ADDRESS}/random`);
      const songData = result.data;

      await this.setState({
        currSong: new Audio(songData.streamAddress),
        songName: songData.song,
        songArtist: songData.artist,
        albumArt: songData.thumbnail.url,
        streamAddress: songData.streamAddress,
      });

      this.state.currSong.addEventListener('canplaythrough', () => {
        this.setState({
          songDuration: this.state.currSong.duration,
          hasSongLoaded: true,
        });
        this.state.currSong.volume = this.state.songVolume / 10;
      });

      this.state.currSong.addEventListener('ended', () => {
        this.setState({
          hasSongLoaded: false,
        });
        this.getRandomSong();
      });
      this.state.currSong.ontimeupdate = () => {
        this.setState({
          songTimeElapsed: this.state.currSong.currentTime,
        });
      };

      return songData;
    } catch (err) {
      console.log(err);
    }
  };

  async componentDidMount() {
    const songData = await this.getRandomSong();
  }

  // Event Handler to toggle the song.
  toggleSong = (event) => {
    let toggleButton;
    if (event.target.classList.contains('bar'))
      toggleButton = event.target.parentNode;
    else toggleButton = event.target;

    if (this.state.currSong.paused) {
      toggleButton.classList.remove('play');
      toggleButton.classList.add('pause');
      this.state.currSong.play();
      this.setState({
        isSongPlaying: true,
      });
    } else {
      toggleButton.classList.remove('pause');
      toggleButton.classList.add('play');
      this.state.currSong.pause();
      this.setState({
        isSongPlaying: false,
      });
    }
  };

  // Event Handler to change song time.
  changeSongTime = (event) => {
    const seekSlider = event.target;
    this.state.currSong.currentTime = `${seekSlider.value}`;

    this.setState({ songTimeElapsed: this.state.currSong.currentTime });
  };

  // Event Handler to change song volume.
  changeSongVolume = (event) => {
    this.state.currSong.volume = event.target.value / 10;
    this.setState({
      songVolume: event.target.value,
    });
  };

  onLoginSuccess = async (res) => {
    try {
      const loginResponse = await axios({
        method: 'POST',
        url: `${SERVER_ADDRESS}/login`,
        headers: {
          Authorization: `Bearer ${res.tokenId}`,
        },
      });
      const data = loginResponse.data;
      console.log(data);

      if (data.isEmailVerified) {
        sessionStorage.setItem('tokenId', res.tokenId);
        this.setState({
          userName: data.name,
          userEmail: data.email,
          userIcon: data.userIcon,
          isLoggedIn: true,
          userAuthToken: res.tokenId,
        });
      }
    } catch (err) {
      console.log(`Login Error from our server: ${err}`);
    }
  };

  onLoginFaliure = (err) => {
    console.log(err);
  };

  onLogoutSuccess = (res) => {
    // console.log('signed out ' + res);
    this.setState({
      isLoggedIn: false,
    });
  };

  onLogoutFaliure = (err) => {
    console.log(err);
  };

  openPlayer = () => {
    this.state.currSong.pause();
    history.push('/player');
  };

  render() {
    return (
      <>
        <div class='wrapper'>
          <Navbar
            isLoggedIn={this.state.isLoggedIn}
            userIcon={this.state.userIcon}
            clientId={CLIENT_ID}
            onLoginSuccess={this.onLoginSuccess}
            onLoginFaliure={this.onLoginFaliure}
            onLogoutSuccess={this.onLogoutSuccess}
            onLogoutFaliure={this.onLogoutFaliure}
          />
          <div className='container'>
            <div className='main-section'>
              <section className='main-section-left'>
                <div className='homepage-heading'>Listen to AD free music </div>
                <div className='homepage-subheading'>
                  All your favourite artists at one spot.
                </div>
                {this.state.isLoggedIn ? (
                  <div className='player-button-container'>
                    <div className='user-name'>
                      Welcome {this.state.userName} !
                    </div>
                    <Link
                      className='player-button'
                      to={{
                        pathname: '/player',
                      }}
                      userEmail={this.state.email}
                    >
                      Go to Player
                    </Link>
                  </div>
                ) : (
                  <div className='signin-button'>
                    <GoogleLogin
                      className='google-login-button'
                      clientId={CLIENT_ID}
                      onSuccess={this.onLoginSuccess}
                      onFailure={this.onLoginFaliure}
                      cookiePolicy={'single_host_origin'}
                      isSignedIn={true}
                      icon={false}
                    >
                      <img
                        src={googleIcon}
                        alt='Google Icon'
                        className='google-icon'
                      />
                      <span>Sign In With Google</span>
                    </GoogleLogin>
                  </div>
                )}
              </section>
              <section className='main-section-right'>
                <div className='right-section-container'>
                  <div className='right-section-popups music-details-container'>
                    {this.state.hasSongLoaded ? (
                      <div className='music-details'>
                        <div
                          className='track-icon'
                          style={{
                            backgroundImage: `url(${this.state.albumArt})`,
                          }}
                        ></div>
                        <div className='track-info-container'>
                          <span className='now-playing'>Now Playing</span>
                          <span className='track-name'>
                            {this.state.songName}
                          </span>
                          <span className='artist-name'>
                            {this.state.songArtist}
                          </span>
                        </div>
                      </div>
                    ) : (
                      this.loader
                    )}
                  </div>
                  <div
                    className='main-image-container'
                    style={{
                      backgroundImage: `url(${mainImage})`,
                    }}
                  ></div>
                  <div className='right-section-popups music-player-container'>
                    <Player
                      songTimeElapsed={this.state.songTimeElapsed}
                      songDuration={this.state.songDuration}
                      volume={this.state.songVolume}
                      hasSongLoaded={this.state.hasSongLoaded}
                      onPlayPause={this.toggleSong}
                      onSongSeek={this.changeSongTime}
                      onVolumeChange={this.changeSongVolume}
                    />
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </>
    );
  }
}
