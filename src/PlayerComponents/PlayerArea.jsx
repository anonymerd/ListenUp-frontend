import React, { Component } from 'react';

import './PlayerArea.css';

import homeIcon from '../assets/icons/home_icon.png';
import searchIcon from '../assets/icons/search_icon.png';
import loaderIcon from '../assets/icons/loader.svg';

import history from '../history';

import MainPlayer from './MainPlayer/MainPlayer';
import SongCard from './SongCard/SongCard';
import Song from '../Models/Song';
import Queue from '../Models/Queue';

const axios = require('axios');

const SERVER_ADDRESS = 'http://localhost:8000/api';

export default class PlayerArea extends Component {
  state = {
    isSongPlaying: false,
    hasSongLoaded: false,
    currAudio: new Audio(),
    currSong: null,
    songTimeElapsed: 0,
    songDuration: 0,
    songVolume: 1,
    searchResults: new Queue([]),
    recommendedSongs: new Queue([]),

    selectedOption: 'liked',
    displayList: new Queue([]),

    playerQueue: new Queue([]),

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

  /**
   * Retrieve current user's Liked songs.
   * @param  {Number} num1 The first number
   * @param  {Number} num2 The second number
   * @return {Number}      The total of the two numbers
   */

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

    const likedSongsQueue = new Queue(likedSongs);

    await this.setState({
      userLikedSongs: likedSongsQueue,
      displayList: likedSongsQueue,
    });
  };

  // Event handler to update input value.
  updateSearchInput = (event) => {
    this.setState({
      searchInput: event.target.value,
    });
  };

  playSong = async (newSong, fromDisplayList) => {
    console.log(newSong.getInfo());

    // If the song is played from the Display List then adding the song into the Current Queue first.
    if (fromDisplayList) {
      this.setState({
        playerQueue: new Queue([newSong]),
      });
      // this.state.playerQueue.addSong(newSong);
    }

    console.log(this.state.playerQueue.songList.map((song) => song.getInfo()));

    this.setState({
      hasSongLoaded: false,
      isSongPlaying: false,
    });

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
      this.playNextSong();
      // this.getRandomSong();
    });
    this.state.currAudio.ontimeupdate = () => {
      this.setState({
        songTimeElapsed: this.state.currAudio.currentTime,
      });
    };

    await this.getRecommendedSongs(newSong.id);
  };

  // Function to fetch recommended songs of a given song.
  getRecommendedSongs = async (songId) => {
    try {
      if (this.state.selectedOption === 'recommended') {
        await this.setState({
          displayList: new Queue([]),
        });
      }
      const response = await axios({
        url: `${SERVER_ADDRESS}/suggestions/${songId}`,
        headers: {
          Authorization: `Bearer ${this.state.userAuthToken}`,
        },
      });

      if (response.data.success) {
        console.log(response.data);

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
        const suggestionsQueue = new Queue(suggestions);

        if (this.state.selectedOption === 'recommended') {
          await this.setState({
            recommendedSongs: suggestionsQueue,
            displayList: suggestionsQueue,
          });
        } else {
          await this.setState({
            recommendedSongs: suggestionsQueue,
          });
        }
      } else {
        console.log(response.message);
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

          const searchQueue = new Queue(searchResults);

          this.setState({
            searchResults: searchQueue,
            displayList: searchQueue,
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

  /**
   * @desc Plays the next song.
   * @param  {Queue} currQueue The queue from which the next song has to be played.
   */
  playNextSong = (currQueue) => {
    // Getting next song from the Current Queue.
    let nextSong = this.state.currQueue.getNextSong();

    console.log(
      'This is from play next song: ' + this.state.currQueue.currentSong
    );

    // If next song is not available then getting it from recommended songs.
    if (!nextSong) {
      // Updating the current song pointer of the current queue.
      this.state.currQueue.currentSong++;

      nextSong = this.state.recommendedSongs.getNextSong();

      // Adding that song to the Current Queue.
      this.state.currQueue.addSong(nextSong);
    }

    if (nextSong) {
      // Playing next song.
      this.playSong(nextSong, false);
    } else {
      console.log('No Next Song.');
    }
  };

  /**
   * @desc Plays the previous song.
   */
  playPrevSong = () => {
    // Getting previous song from the Current Queue.
    const prevSong = this.state.playerQueue.getPrevSong();

    console.log(
      'This is from play prev song: ' + this.state.playerQueue.currentSong
    );

    if (prevSong) {
      // Playing next song.
      this.playSong(prevSong, false);
    } else {
      console.log('No Prev Song.');
    }
  };

  // Event Handler to change song time.
  changeSongTime = async (event) => {
    const seekSlider = event.target;
    this.state.currAudio.currentTime = `${seekSlider.value}`;
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
    this.state.currAudio.volume = event.target.value / 10;
    this.setState({
      songVolume: event.target.value,
    });
  };

  // Event handler for adding liked songs to database
  addToLikedSongs = async (event, song) => {
    try {
      let currSong;
      if (song) {
        currSong = song;
      } else {
        // This song is currently playing.
        currSong = this.state.currSong;
        currSong.like();

        await this.setState({
          currSong: currSong,
        });
      }
      const response = await axios({
        method: 'PUT',
        url: `${SERVER_ADDRESS}/user/like`,
        data: {
          songId: currSong.id,
        },
        headers: {
          Authorization: `Bearer ${this.state.userAuthToken}`,
        },
      });

      const likedSongs = this.state.userLikedSongs;
      likedSongs.unshift(currSong);

      const recommendedSongs = this.state.recommendedSongs;
      recommendedSongs.forEach((song) => {
        if (song.id === currSong.id) currSong.like();
      });

      const searchResults = this.state.searchResults;
      searchResults.forEach((song) => {
        if (song.id === currSong.id) song = currSong;
      });

      await this.setState({
        userLikedSongs: likedSongs,
        recommendedSongs: recommendedSongs,
        searchResults: searchResults,
      });

      if (this.state.selectedOption === 'search') {
        this.setState({
          displayList: this.state.searchResults,
        });
      } else if (this.state.selectedOption === 'recommended') {
        this.setState({
          displayList: this.state.recommendedSongs,
        });
      } else if (this.state.selectedOption === 'liked') {
        this.setState({
          displayList: this.state.userLikedSongs,
        });
      }
    } catch (error) {
      console.log('Could not add song to Liked Songs: ' + error);
    }
  };

  // Event handler to remove a song from liked songs in the database.
  removeFromLikedSongs = async (event, song) => {
    try {
      let currSong;
      if (song) {
        currSong = song;
      } else {
        // This song is currently playing.
        currSong = this.state.currSong;
        currSong.unlike();

        this.setState({
          currSong: currSong,
        });
      }
      const response = await axios({
        method: 'DELETE',
        url: `${SERVER_ADDRESS}/user/like`,
        data: {
          songId: currSong.id,
        },
        headers: {
          Authorization: `Bearer ${this.state.userAuthToken}`,
        },
      });

      let likedSongs = this.state.userLikedSongs;
      likedSongs = likedSongs.filter((song) => song.id !== currSong.id);

      const recommendedSongs = this.state.recommendedSongs;
      recommendedSongs.forEach((song) => {
        if (song.id === currSong.id) song.unlike();
      });

      const searchResults = this.state.searchResults;
      searchResults.forEach((song) => {
        if (song.id === currSong.id) song.isLiked = false;
      });

      await this.setState({
        userLikedSongs: likedSongs,
        recommendedSongs: recommendedSongs,
        searchResults: searchResults,
      });

      if (this.state.selectedOption === 'search') {
        this.setState({
          displayList: this.state.searchResults,
        });
      } else if (this.state.selectedOption === 'recommended') {
        this.setState({
          displayList: this.state.recommendedSongs,
        });
      } else if (this.state.selectedOption === 'liked') {
        this.setState({
          displayList: this.state.userLikedSongs,
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
                    displayList: this.state.searchResults,
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
                    displayList: this.state.recommendedSongs,
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
                    displayList: this.state.userLikedSongs,
                  });
                }}
              >
                Liked
              </div>
            </div>
            <div className='song-list-container'>
              {this.state.displayList.songList.length === 0
                ? this.loader
                : this.state.displayList.songList.map((song) => {
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
            playerQueue={this.state.playerQueue}
            hasSongLoaded={this.state.hasSongLoaded}
            isSongPlaying={this.state.isSongPlaying}
            isSongLiked={
              this.state.currSong ? this.state.currSong.isLiked : null
            }
            onPlayPause={this.toggleSong}
            onNext={this.playNextSong}
            onPrev={this.playPrevSong}
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
