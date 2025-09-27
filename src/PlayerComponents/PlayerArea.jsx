import React, { Component } from 'react';

import './PlayerArea.css';

import homeIcon from '../assets/icons/home_icon.png';
import searchIcon from '../assets/icons/search_icon.png';
import loaderIcon from '../assets/icons/loader.svg';

import history from '../history';

import MainPlayer from './MainPlayer/MainPlayer';
import SongCard from './SongCard/SongCard';
import User from '../Models/User';
import Search from '../Models/Search';
import Queue from '../Models/Queue';

const axios = require('axios');

const SERVER_ADDRESS = 'http://localhost:8000/api';

const SEARCH = 'search';
const RECOMMENDED = 'recommended';
const LIKED = 'liked';

export default class PlayerArea extends Component {
  // Creating all the states of the component.
  state = {
    // Song States
    currentSong: null,
    currentAudio: new Audio(),
    isSongPlaying: false,
    hasSongLoaded: false,
    songTimeElapsed: 0,
    songDuration: 0,
    songVolume: 0.25,

    searchList: new Queue([]),
    recommendedList: new Queue([]),
    likedList: new Queue([]),

    selectedOption: LIKED,
    displayList: new Queue([]),

    playerQueue: new Queue([]),

    searchInput: '',
    sliderKey: `${Math.random()}`,

    // User States
    currentUser: null,
    userName: '',
    userEmail: '',
    userIcon: '',
    isLoggedIn: false,
    userAuthToken: '',
  };

  // TODO: Verify user Login.

  loader = (
    <div className='loader-container'>
      <img src={loaderIcon} alt='Loader Icon' />
    </div>
  );

  // TODO: Create an id for user in backend and merge that in frontend.
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

        const currentUser = new User(data.email, {
          name: data.name,
          icon: data.userIcon,
        });

        if (data.isEmailVerified) {
          this.setState({
            currentUser: currentUser,

            // FIXME: Remove user data and use user obj
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

    // Redering the user's liked songs.
    this.renderLikedSongs(this.state.currentUser);
  };

  // FIXME:
  // Event handler to update input value.
  updateSearchInput = (event) => {
    this.setState({
      searchInput: event.target.value,
    });
  };

  // Event Handler to toggle the song.
  toggleSong = (event) => {
    let toggleButton;
    if (event.target.classList.contains('bar'))
      toggleButton = event.target.parentNode;
    else toggleButton = event.target;

    if (this.state.currentAudio.paused) {
      this.state.currentAudio.play();
      this.setState({
        isSongPlaying: true,
      });
    } else {
      this.state.currentAudio.pause();
      this.setState({
        isSongPlaying: false,
      });
    }
  };

  // Event Handler to change song time.
  changeSongTime = async (event) => {
    const seekSlider = event.target;
    this.state.currentAudio.currentTime = `${seekSlider.value}`;
    console.log(this.state.sliderKey);

    await this.setState({
      songTimeElapsed: this.state.currentSong.currentTime,
    });
    await this.setState({
      sliderKey: `${Math.random()}`,
    });
    console.log(this.state.sliderKey);

    // seekSlider.value = this.state.songTimeElapsed;
  };

  // Event Handler to change song volume.
  changeSongVolume = (event) => {
    this.state.currentAudio.volume = event.target.value / 10;
    this.setState({
      songVolume: event.target.value,
    });
  };

  switchPage = () => {
    history.push('/');
  };

  // ************************FIXED*******************************

  /**
   * @description Render the given user's Liked songs.
   * @param {User} user The user whose liked songs have to be rendered.
   */
  renderLikedSongs = async (user) => {
    try {
      // Fetching user's liked songs.
      const likedSongs = await user.getLikedSongs(this.state.userAuthToken);

      const likedSongsQueue = new Queue(likedSongs);

      await this.setState({
        likedList: likedSongsQueue,
        displayList: likedSongsQueue,
      });
    } catch (error) {
      console.error(error);
    }
  };

  /**
   * @description Performs the search based on the search query.
   */
  performSearch = async () => {
    // Getting the search query
    const query = this.state.searchInput;
    // If the query is empty do nothing.
    if (!query) return;

    try {
      // Getting the search results.
      const search = new Search(query);
      const searchResults = await search.getResults(this.state.userAuthToken);

      // Rendering the results.
      const searchQueue = new Queue(searchResults);

      this.setState({
        searchList: searchQueue,
        displayList: searchQueue,
        // Forcing the list to show the search results.
        selectedOption: 'search',
      });
    } catch (error) {
      console.error(error);
    }
  };

  /**
   * @description Fetches the recommended songs.
   * @param {Song} song The song whose recommedations is to be fetched.
   */
  getRecommendedSongs = async (song) => {
    // If the recommended is option is already selected, then showing the loader by rendering empty list.
    if (this.state.selectedOption === 'recommended') {
      await this.setState({
        displayList: new Queue([]),
      });
    }

    // Getting the recommended Songs.
    const recommendedSongs = await song.getRecommendations(
      this.state.userAuthToken
    );

    const recommedationsQueue = new Queue(recommendedSongs);

    if (this.state.selectedOption === 'recommended') {
      await this.setState({
        recommendedList: recommedationsQueue,
        displayList: recommedationsQueue,
      });
    } else {
      await this.setState({
        recommendedList: recommedationsQueue,
      });
    }
  };

  /**
   * @description Updates the display list to the given list.
   * @param {String} currentListType The type of list to which the Display List is to be updated.
   */
  updateDisplayList = (listType) => {
    if (listType === SEARCH)
      if (listType === SEARCH) {
        this.setState({
          displayList: this.state.searchList,
        });
      } else if (listType === RECOMMENDED) {
        this.setState({
          displayList: this.state.recommendedList,
        });
      } else if (listType === LIKED) {
        this.setState({
          displayList: this.state.likedList,
        });
      }
  };

  /**
   * @description Updates the given type of list to the given new List in the component state.
   * @param {String} listType The type of list which has to be updated.
   * @param {Song[]} newList The updated list
   */

  updateSongList = (listType, newList) => {
    switch (listType) {
      case SEARCH:
        this.setState({
          searchList: newList,
        });
        break;

      case RECOMMENDED:
        this.setState({
          recommendedList: newList,
        });
        break;

      case LIKED:
        this.setState({
          likedList: newList,
        });
        break;
    }
  };

  /**
   * @description Performs the liked action by syncing everything.
   * @param {Song} song The song on which like action is performed.
   */
  performLikeAction = async (song) => {
    try {
      // Getting the current user.
      const currentUser = this.state.currentUser;

      // Marking the song as liked
      song.like();

      // Adding the song to user's liked songs.
      const response = await currentUser.addToLikedSongs(
        this.state.userAuthToken,
        song
      );

      // Updating the player
      if (this.state.currentSong && song.id == this.state.currentSong.id) {
        this.setState({
          currentSong: Object.create(song),
        });
      }

      // Updating the Liked List.
      const likedSongs = this.state.likedList;
      likedSongs.unshiftSong(song);
      this.updateSongList(LIKED, likedSongs);

      // Updating the Recommended List
      const recommendedSongs = this.state.recommendedList;
      recommendedSongs.songList.forEach((recommendedSong) => {
        if (recommendedSong.id === song.id)
          recommendedSong = Object.create(song);
      });
      this.updateSongList(RECOMMENDED, recommendedSongs);

      // Updating the Search List
      const searchResults = this.state.searchList;
      searchResults.songList.forEach((searchSong) => {
        if (searchSong.id === song.id) searchSong = Object.create(song);
      });
      this.updateSongList(SEARCH, searchResults);

      // Updating the Display List.
      this.updateDisplayList(this.state.selectedOption);
    } catch (error) {
      console.error(error);
    }
  };

  /**
   * @description Performs the unlike action by syncing everything.
   * @param {Song} song The song on which unlike action is to be performed.
   */
  performUnlikeAction = async (song) => {
    try {
      // Getting the current user.
      const currentUser = this.state.currentUser;

      // Removing the song from user's liked songs.
      const response = await currentUser.removeFromLikedSongs(
        this.state.userAuthToken,
        song
      );

      // Marking the song as unliked.
      song.unlike();

      // Updating the player
      if (this.state.currentSong && song.id == this.state.currentSong.id) {
        this.setState({
          currentSong: Object.create(song),
        });
      }

      // Updating the Liked List.
      const likedSongs = this.state.likedList;
      const updatedLikedSongList = likedSongs.songList.filter(
        (likedSong) => likedSong.id !== song.id
      );
      this.updateSongList(LIKED, likedSongs);

      // Updating the Recommended List
      const recommendedSongs = this.state.recommendedList;
      recommendedSongs.songList.forEach((recommendedSong) => {
        if (recommendedSong.id === song.id)
          recommendedSong = Object.create(song);
      });
      this.updateSongList(RECOMMENDED, recommendedSongs);

      // Updating the Search List
      const searchResults = this.state.searchList;
      searchResults.songList.forEach((searchSong) => {
        if (searchSong.id === song.id) searchSong = Object.create(song);
      });
      this.updateSongList(SEARCH, searchResults);

      // Updating the Display List.
      this.updateDisplayList(this.state.selectedOption);
    } catch (error) {
      console.error(error);
    }
  };

  /**
   * @description Loads the song.
   * @param {Song} song The song to be loaded.
   */
  loadSong = async (song) => {
    console.log('inside load song..');
    // Changing the stream address to that of the new song.
    this.state.currentAudio.setAttribute('src', song.streamAddress);

    // Telling the browser to preload the metadata of the song.
    this.state.currentAudio.preload = 'metadata';

    // Loading the new song.
    this.state.currentAudio.load();

    await this.setState({
      currentSong: song,
    });
  };

  /**
   * @description Adds event listener for the currently playing song.
   */
  addEventListenersToCurrentSong = () => {
    // Event listener which fires when the audio has enough data to play.
    this.state.currentAudio.addEventListener('canplaythrough', () => {
      console.log('inside canplaythrough event listener');
      this.setState({
        songDuration: this.state.currentAudio.duration,
        hasSongLoaded: true,
        isSongPlaying: true,
      });
      this.state.currentSong.setDuration(this.state.songDuration);
      this.state.currentAudio.volume = this.state.songVolume / 10;
      this.state.currentAudio.play();
    });

    // Fires when the song ends (plays the next song)
    this.state.currentAudio.addEventListener('ended', () => {
      this.playNextSong();
    });

    // Fires as the song is played (updates the elapsed time)
    this.state.currentAudio.addEventListener('timeupdate', () => {
      this.setState({
        songTimeElapsed: this.state.currentAudio.currentTime,
      });
    });
  };

  /**
   * @description Plays the song.
   * @param {Song} song The song to be played.
   */
  playSong = async (song) => {
    // Setting the states before playing the song.
    // These will be set to true in the event listeners after the song can play through.
    this.setState({
      hasSongLoaded: false,
      isSongPlaying: false,
      recommendedList: new Queue(),
    });

    // Loading the song.
    await this.loadSong(song);

    // Adding event listeners.
    this.addEventListenersToCurrentSong();

    // Getting the recommended songs.
    await this.getRecommendedSongs(this.state.currentSong);
  };

  /**
   * @description Toggles the song.
   */
  toggleCurrentSong = () => {
    if (this.state.currentAudio.paused) {
      // Playing the current song.
      this.state.currentAudio.play();
      this.setState({
        isSongPlaying: true,
      });
    } else {
      // Pausing the current song.
      this.state.currentAudio.pause();
      this.setState({
        isSongPlaying: false,
      });
    }
  };

  /**
   * @description Plays the next song.
   */
  playNextSong = () => {
    // Getting next song from the Player Queue.
    let nextSong = this.state.playerQueue.getNextSong();

    if (!nextSong) {
      // If next song is not available then adding next song from Recommended List to Player Queue.
      nextSong = this.state.recommendedList.getCurrentSong();

      if (!nextSong) {
        console.log('No next song available.');
        return;
      }

      // Adding that song to the Player Queue.
      this.state.playerQueue.addSong(nextSong);

      this.playNextSong();
    } else {
      // Playing the song.
      console.log(`Playing next song: ${nextSong.name}`);
      this.playSong(nextSong);
    }
  };

  /**
   * @description Plays the previous song.
   */
  playPrevSong = () => {
    // Getting previous song from the Current Queue.
    const prevSong = this.state.playerQueue.getPrevSong();

    if (prevSong) {
      // Playing the song.
      console.log(`Playing prev song: ${prevSong.name}`);
      this.playSong(prevSong);
    } else {
      console.log('No Prev Song.');
    }
  };

  render() {
    return (
      <div className='player-area-wrapper'>
        <div className='data-container'>
          <div className='left-section'>
            <div className='home-button-container'>
              <img src={homeIcon} onClick={this.switchPage} />
            </div>

            {this.state.currentSong ? (
              <div className='song-info-container'>
                <div
                  className='song-thumbnail'
                  style={{
                    backgroundImage: `url(${this.state.currentSong.thumbnail}`,
                  }}
                ></div>
                <div className='artist-name'>
                  {this.state.currentSong.artist}
                </div>
                <div className='song-name'>{this.state.currentSong.name}</div>
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
              <div className='search-button' onClick={this.performSearch}>
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
                    displayList: this.state.searchList,
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
                    displayList: this.state.recommendedList,
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
                    displayList: this.state.likedList,
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
                          this.performLikeAction(song)
                        }
                        removeFromLikedSongs={(event) =>
                          this.performUnlikeAction(song)
                        }
                        onClick={() => {
                          // First creating a new queue and adding the song to that queue.
                          const newQ = new Queue();
                          newQ.addSong(song);

                          // Adding this new Queue to the state
                          this.setState({
                            playerQueue: newQ,
                          });
                          this.playSong(song);
                        }}
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
              this.state.currentSong ? this.state.currentSong.isLiked : null
            }
            onPlayPause={this.toggleSong}
            onNext={this.playNextSong}
            onPrev={this.playPrevSong}
            onSongSeek={this.changeSongTime}
            onVolumeChange={this.changeSongVolume}
            addToLikedSongs={() => {
              this.performLikeAction(this.state.currentSong);
            }}
            removeFromLikedSongs={() => {
              this.performUnlikeAction(this.state.currentSong);
            }}
          />
        </div>
      </div>
    );
  }
}
