import React, { Component } from 'react';
import './PlayerArea.css';
import homeIcon from '../assets/icons/home_icon.png';
import searchIcon from '../assets/icons/search_icon.png';
import history from '../history';
import MainPlayer from './MainPlayer/MainPlayer';
import SongCard from './SongCard/SongCard';
import loaderIcon from '../assets/icons/loader.svg';

const axios = require('axios');

const SERVER_ADDRESS = 'http://localhost:8000/api';

export default class PlayerArea extends Component {
  state = {
    currSong: new Audio(),
    isSongPlaying: false,
    hasSongLoaded: false,
    songId: '',
    songName: '',
    songArtist: '',
    songThumbnail: '',
    isSongLiked: false,
    streamAddress: '',
    songTimeElapsed: 0,
    songDuration: 0,
    songVolume: 5,
    searchResults: [],
    recommendedSongs: [],

    selectedOption: 'liked',
    songList: undefined,

    searchInput: '',
    sliderKey: `${Math.random()}`,

    userName: '',
    userEmail: '',
    userIcon: '',
    userLikedSongs: undefined,
    isLoggedIn: false,
    userAuthToken: '',
  };

  // TODO: Verify user Login.

  loader = (
    <div className='loader-container'>
      <img src={loaderIcon} alt='Loader Icon' />
    </div>
  );

  verifyUserLogin = async () => {
    try {
      const tokenId = sessionStorage.getItem('tokenId');
      if (tokenId) {
        const loginResponse = await axios({
          method: 'POST',
          url: `${SERVER_ADDRESS}/login`,
          headers: {
            Authorization: `Bearer ${tokenId}`,
          },
        });
        const data = loginResponse.data;
        console.log(data);

        if (data.isEmailVerified) {
          this.setState({
            userName: data.name,
            userEmail: data.email,
            userIcon: data.userIcon,
            isLoggedIn: true,
            userAuthToken: tokenId,
          });
        } else {
          console.log('Invalid Token');
        }
      } else {
        console.log('Token Id not found!');
      }
    } catch (err) {
      console.log(`Login Error from our server: ${err}`);
    }
  };

  componentDidMount = async () => {
    // Verifying the user login.
    await this.verifyUserLogin();

    // Getting the user's liked songs.
    const response = await axios({
      method: 'GET',
      url: `${SERVER_ADDRESS}/user/like`,
      headers: {
        Authorization: `Bearer ${this.state.userAuthToken}`,
      },
    });
    const data = response.data;
    console.log(data);
    await this.setState({
      userLikedSongs: data.likedSongs,
      songList: data.likedSongs,
    });
  };

  // Event handler to update input value.
  updateSearchInput = (event) => {
    this.setState({
      searchInput: event.target.value,
    });
  };

  playSong = async (songData) => {
    console.log(songData);
    if (this.state.currSong) this.state.currSong.pause();
    await this.setState({
      currSong: new Audio(songData.streamAddress),
      songId: songData.songId,
      songName: songData.songName,
      songArtist: songData.songArtist,
      songThumbnail: songData.songThumbnail,
      streamAddress: songData.streamAddress,
      isSongLiked: songData.isLiked,
    });

    this.state.currSong.addEventListener('canplaythrough', () => {
      this.setState({
        songDuration: this.state.currSong.duration,
        hasSongLoaded: true,
        isSongPlaying: true,
      });
      this.state.currSong.volume = this.state.songVolume / 10;
      this.state.currSong.play();
    });

    this.state.currSong.addEventListener('ended', () => {
      this.setState({
        hasSongLoaded: false,
        isSongPlaying: false,
      });
      // this.getRandomSong();
    });
    this.state.currSong.ontimeupdate = () => {
      this.setState({
        songTimeElapsed: this.state.currSong.currentTime,
      });
    };

    await this.getRecommendedSongs(songData.songId);
  };

  getRecommendedSongs = async (songId) => {
    try {
      if (this.state.selectedOption === 'recommended') {
        await this.setState({
          songList: undefined,
        });
      }
      const response = await axios({
        url: `${SERVER_ADDRESS}/suggestions/${songId}`,
        headers: {
          Authorization: `Bearer ${this.state.userAuthToken}`,
        },
      });
      if (this.state.selectedOption === 'recommended') {
        await this.setState({
          recommendedSongs: response.data.suggestions,
          songList: response.data.suggestions,
        });
      } else {
        await this.setState({
          recommendedSongs: response.data.suggestions,
        });
      }

      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  getSearchResults = async () => {
    if (this.state.searchInput) {
      try {
        const response = await axios({
          method: 'POST',
          url: `${SERVER_ADDRESS}/search?q=${this.state.searchInput}`,
          headers: {
            Authorization: `Bearer ${this.state.userAuthToken}`,
          },
        });

        console.log(response);

        if (response.data.success) {
          // Rendering Search Results
          this.setState({
            searchResults: response.data.searchResults,
            songList: response.data.searchResults,
            selectedOption: 'search',
          });
        } else {
          console.log(response.message);
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  // Event Handler to toggle the song.
  toggleSong = (event) => {
    let toggleButton;
    if (event.target.classList.contains('bar'))
      toggleButton = event.target.parentNode;
    else toggleButton = event.target;

    if (this.state.currSong.paused) {
      // toggleButton.classList.remove('play');
      // toggleButton.classList.add('pause');
      this.state.currSong.play();
      this.setState({
        isSongPlaying: true,
      });
    } else {
      // toggleButton.classList.remove('pause');
      // toggleButton.classList.add('play');
      this.state.currSong.pause();
      this.setState({
        isSongPlaying: false,
      });
    }
  };

  // Event Handler to change song time.
  changeSongTime = async (event) => {
    const seekSlider = event.target;
    this.state.currSong.currentTime = `${seekSlider.value}`;
    console.log(this.state.sliderKey);

    await this.setState({
      songTimeElapsed: this.state.currSong.currentTime,
    });
    await this.setState({
      sliderKey: `${Math.random()}`,
    });
    console.log(this.state.sliderKey);

    // seekSlider.value = this.state.songTimeElapsed;
  };

  // Event Handler to change song volume.
  changeSongVolume = (event) => {
    this.state.currSong.volume = event.target.value / 10;
    this.setState({
      songVolume: event.target.value,
    });
  };

  //event handler for adding liked songs to database

  addToLikedSongs = async (event, song) => {
    try {
      let likedSong;
      if (song) {
        likedSong = song;
      } else {
        likedSong = {
          songId: this.state.songId,
          song: this.state.songName,
          artist: this.state.songArtist,
          thumbnail: this.state.songThumbnail,
          streamAddress: this.state.streamAddress,
          isLiked: true,
        };
        this.setState({
          isSongLiked: true,
        });
      }
      const response = await axios({
        method: 'PUT',
        url: `${SERVER_ADDRESS}/user/like`,
        data: {
          songId: likedSong.songId,
        },
        headers: {
          Authorization: `Bearer ${this.state.userAuthToken}`,
        },
      });

      const likedSongs = this.state.userLikedSongs;
      likedSongs.unshift(likedSong);

      const recommendedSongs = this.state.recommendedSongs;
      recommendedSongs.forEach((song) => {
        if (song.songId === likedSong.songId) song.isLiked = true;
      });

      const searchResults = this.state.searchResults;
      searchResults.forEach((song) => {
        if (song.songId === likedSong.songId) song.isLiked = true;
      });

      await this.setState({
        userLikedSongs: likedSongs,
        recommendedSongs: recommendedSongs,
        searchResults: searchResults,
      });

      if (this.state.selectedOption === 'search') {
        this.setState({
          songList: this.state.searchResults,
        });
      } else if (this.state.selectedOption === 'recommended') {
        this.setState({
          songList: this.state.recommendedSongs,
        });
      } else if (this.state.selectedOption === 'liked') {
        this.setState({
          songList: this.state.userLikedSongs,
        });
      }
    } catch (error) {
      console.log('Could not add song to Liked Songs: ' + error);
    }
  };

  removeFromLikedSongs = async (event, song) => {
    try {
      let likedSong;
      if (song) {
        likedSong = song;
      } else {
        likedSong = {
          songId: this.state.songId,
          song: this.state.songName,
          artist: this.state.songArtist,
          thumbnail: this.state.songThumbnail,
          streamAddress: this.state.streamAddress,
          isLiked: false,
        };
        this.setState({
          isSongLiked: false,
        });
      }
      const response = await axios({
        method: 'DELETE',
        url: `${SERVER_ADDRESS}/user/like`,
        data: {
          songId: likedSong.songId,
        },
        headers: {
          Authorization: `Bearer ${this.state.userAuthToken}`,
        },
      });

      let likedSongs = this.state.userLikedSongs;
      likedSongs = likedSongs.filter(
        (song) => song.songId !== likedSong.songId
      );

      const recommendedSongs = this.state.recommendedSongs;
      recommendedSongs.forEach((song) => {
        if (song.songId === likedSong.songId) song.isLiked = false;
      });

      const searchResults = this.state.searchResults;
      searchResults.forEach((song) => {
        if (song.songId === likedSong.songId) song.isLiked = false;
      });

      await this.setState({
        userLikedSongs: likedSongs,
        recommendedSongs: recommendedSongs,
        searchResults: searchResults,
      });

      if (this.state.selectedOption === 'search') {
        this.setState({
          songList: this.state.searchResults,
        });
      } else if (this.state.selectedOption === 'recommended') {
        this.setState({
          songList: this.state.recommendedSongs,
        });
      } else if (this.state.selectedOption === 'liked') {
        this.setState({
          songList: this.state.userLikedSongs,
        });
      }
    } catch (error) {
      console.log('Could not remove song from Liked Songs: ' + error);
    }
  };

  switchPage = () => {
    history.push('/');
  };

  render() {
    return (
      <div className='player-area-wrapper'>
        <div className='data-container'>
          <div className='left-section'>
            <div className='home-button-container'>
              <img src={homeIcon} onClick={this.switchPage} />
            </div>
            <div className='song-info-container'>
              <div
                className='song-thumbnail'
                style={{ backgroundImage: `url(${this.state.songThumbnail}` }}
              ></div>
              <div className='artist-name'>{this.state.songArtist}</div>
              <div className='song-name'>{this.state.songName}</div>
            </div>
          </div>
          <div className='right-section'>
            <div className='search-bar-container'>
              <input
                type='text'
                placeholder='Search for Songs!'
                className='search-box'
                onChange={this.updateSearchInput}
              ></input>
              <div className='search-button' onClick={this.getSearchResults}>
                <img src={searchIcon} width='18px' />
              </div>
            </div>
            <div className='buttons-container'>
              <div
                className={`option option-search ${
                  this.state.selectedOption === 'search' ? 'selected' : ''
                }
                `}
                onClick={() => {
                  this.setState({
                    selectedOption: 'search',
                    songList: this.state.searchResults,
                  });
                }}
              >
                Search
              </div>
              <div
                className={`option option-recommended ${
                  this.state.selectedOption === 'recommended' ? 'selected' : ''
                }
                `}
                onClick={() => {
                  this.setState({
                    selectedOption: 'recommended',
                    songList: this.state.recommendedSongs,
                  });
                }}
              >
                Recommended
              </div>
              <div
                className={`option option-liked ${
                  this.state.selectedOption === 'liked' ? 'selected' : ''
                }
                `}
                onClick={() => {
                  this.setState({
                    selectedOption: 'liked',
                    songList: this.state.userLikedSongs,
                  });
                }}
              >
                Liked
              </div>
            </div>
            <div className='song-list-container'>
              {this.state.songList === undefined
                ? this.loader
                : this.state.songList.map((song) => {
                    return (
                      <SongCard
                        songName={song.song}
                        artistName={song.artist}
                        songThumbnail={song.thumbnail.url}
                        songStream={song.streamAddress}
                        isLiked={song.isLiked}
                        id={song.songId}
                        key={song.songId}
                        addToLikedSongs={(event) =>
                          this.addToLikedSongs(event, song)
                        }
                        removeFromLikedSongs={(event) =>
                          this.removeFromLikedSongs(event, song)
                        }
                        onClick={this.playSong}
                      />
                    );
                  })}
            </div>
          </div>
        </div>
        <div className='main-player'>
          <MainPlayer
            songTimeElapsed={this.state.songTimeElapsed}
            songDuration={this.state.songDuration}
            volume={this.state.songVolume}
            hasSongLoaded={this.state.hasSongLoaded}
            isSongPlaying={this.state.isSongPlaying}
            isSongLiked={this.state.isSongLiked}
            sliderKey={this.state.sliderKey}
            onPlayPause={this.toggleSong}
            onSongSeek={this.changeSongTime}
            onVolumeChange={this.changeSongVolume}
            addToLikedSongs={this.addToLikedSongs}
            removeFromLikedSongs={this.removeFromLikedSongs}
          />
        </div>
      </div>
    );
  }
}
