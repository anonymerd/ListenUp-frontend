import React, { Component } from 'react';

import './PlayerArea.css';

import homeIcon from '../assets/icons/home_icon.png';
import searchIcon from '../assets/icons/search_icon.png';
import loaderIcon from '../assets/icons/loader.svg';

import history from '../history';

import MainPlayer from './MainPlayer/MainPlayer';
import SongCard from './SongCard/SongCard';
import Song from '../Models/Song';

const axios = require('axios');

const SERVER_ADDRESS = 'http://localhost:8000/api';

export default class PlayerArea extends Component {
  state = {
    isSongPlaying: false,
    hasSongLoaded: false,
    currAudio: new Audio(),
    currSong: null,
    songId: '',
    songName: '',
    songArtist: '',
    songThumbnail: '',
    isSongLiked: false,
    streamAddress: '',
    songTimeElapsed: 0,
    songDuration: 0,
    songVolume: 1,
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
    this.getLikedSongs();
  };

  // Fucntion to retrieve users Liked Songs.
  getLikedSongs = async () => {
    const response = await axios({
      method: 'GET',
      url: `${SERVER_ADDRESS}/user/like`,
      headers: {
        Authorization: `Bearer ${this.state.userAuthToken}`,
      },
    });

    const likedSongs = response.data.likedSongs.map((song) => {
      return new Song(
        song.id,
        song.name,
        song.artist,
        song.thumbnail,
        song.streamAddress,
        song.isLiked
      );
    });

    await this.setState({
      userLikedSongs: likedSongs,
      songList: likedSongs,
    });
  };

  // Event handler to update input value.
  updateSearchInput = (event) => {
    this.setState({
      searchInput: event.target.value,
    });
  };

  playSong = async (newSong) => {
    console.log(newSong.getInfo());

    // Changing the stream address to that of the new song.
    this.state.currAudio.setAttribute('src', newSong.streamAddress);

    // Telling the browser to preload the metadata of the song.
    this.state.currAudio.preload = 'metadata';

    // Loading the new song.
    this.state.currAudio.load();

    await this.setState({
      currSong: newSong,
    });

    this.state.currAudio.addEventListener('canplaythrough', () => {
      this.setState({
        songDuration: this.state.currAudio.duration,
        hasSongLoaded: true,
        isSongPlaying: true,
      });
      this.state.currSong.setDuration(this.state.songDuration);
      this.state.currAudio.volume = this.state.songVolume / 10;
      this.state.currAudio.play();
    });

    this.state.currAudio.addEventListener('ended', () => {
      this.setState({
        hasSongLoaded: false,
        isSongPlaying: false,
      });
      // this.getRandomSong();
    });
    this.state.currAudio.ontimeupdate = () => {
      this.setState({
        songTimeElapsed: this.state.currAudio.currentTime,
      });
    };

    await this.getRecommendedSongs(newSong.songId);
  };

  // Function to fetch recommended songs of a given song.
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

      console.log(response.data.suggestions);

      const suggestions = response.data.suggestions.map((song) => {
        return new Song(
          song.id,
          song.name,
          song.artist,
          song.thumbnail,
          song.streamAddress,
          song.isLiked
        );
      });

      if (this.state.selectedOption === 'recommended') {
        await this.setState({
          recommendedSongs: suggestions,
          songList: suggestions,
        });
      } else {
        await this.setState({
          recommendedSongs: suggestions,
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Function to retreive search results.
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

        console.log(response.data.searchResults);

        if (response.data.success) {
          // Rendering Search Results
          const searchResults = response.data.searchResults.map((song) => {
            return new Song(
              song.id,
              song.name,
              song.artist,
              song.thumbnail,
              song.streamAddress,
              song.isLiked
            );
          });
          this.setState({
            searchResults: searchResults,
            songList: searchResults,
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

    if (this.state.currAudio.paused) {
      this.state.currAudio.play();
      this.setState({
        isSongPlaying: true,
      });
    } else {
      this.state.currAudio.pause();
      this.setState({
        isSongPlaying: false,
      });
    }
  };

  // Event Hanlder to play next song.
  playNextSong = () => {
    this.playSong(this.state.recommendedSongs[0]);
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

            {this.state.currSong ? (
              <div className='song-info-container'>
                <div
                  className='song-thumbnail'
                  style={{
                    backgroundImage: `url(${this.state.currSong.thumbnail}`,
                  }}
                ></div>
                <div className='artist-name'>{this.state.currSong.artist}</div>
                <div className='song-name'>{this.state.currSong.name}</div>
              </div>
            ) : null}
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
                        song={song}
                        key={song.id}
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
            onNext={this.playNextSong}
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
