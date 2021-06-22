import React, { Component } from 'react';
import './PlayerArea.css';
import homeIcon from '../assets/icons/home_icon.png';
import searchIcon from '../assets/icons/search_icon.png';
import thumbnail from '../assets/images/img1.jpg';
import history from '../history';
import MainPlayer from './MainPlayer/MainPlayer';
import SongCard from './SongCard/SongCard';

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
    streamAddress: '',
    songTimeElapsed: 0,
    songDuration: 0,
    songVolume: 5,
    searchResults: [],
    recommendedSongs: [],
    songList: [],

    searchInput: '',
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
    });

    this.state.currSong.addEventListener('canplaythrough', () => {
      this.setState({
        songDuration: this.state.currSong.duration,
        hasSongLoaded: true,
      });
      this.state.currSong.volume = this.state.songVolume / 10;
      this.state.currSong.play();
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

    this.getRecommendedSongs(songData.songId);
  };

  getRecommendedSongs = async (songId) => {
    const response = await axios(`${SERVER_ADDRESS}/suggestions/${songId}`);
    await this.setState({
      recommendedSongs: response.data,
    });

    console.log(response.data);
  };

  getSearchResults = async () => {
    if (this.state.searchInput) {
      try {
        const response = await axios(
          `${SERVER_ADDRESS}/search?q=${this.state.searchInput}`
        );

        console.log(response);

        if (response.data.success) {
          // Rendering Search Results
          this.setState({
            searchResults: response.data.searchResults,
            songList: response.data.searchResults,
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
    event.target.defaultValue = this.state.songTimeElapsed;
  };

  // Event Handler to change song volume.
  changeSongVolume = (event) => {
    this.state.currSong.volume = event.target.value / 10;
    this.setState({
      songVolume: event.target.value,
    });
  };

  switchPage = () => {
    history.push('/');
  };

  render() {
    return (
      <div className='player-area-wrapper'>
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
          <div className='main-player-container'>
            <MainPlayer
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
              className='option option-search'
              onClick={() => {
                this.setState({
                  songList: this.state.searchResults,
                });
              }}
            >
              Search
            </div>
            <div
              className='option option-recommended'
              onClick={() => {
                this.setState({
                  songList: this.state.recommendedSongs,
                });
              }}
            >
              Recommended
            </div>
            <div className='option option-liked'>Liked</div>
          </div>
          <div className='song-list-container'>
            {this.state.songList.map((song) => {
              return (
                <SongCard
                  songName={song.song}
                  artistName={song.artist}
                  songThumbnail={song.thumbnail.url}
                  songStream={song.streamAddress}
                  key={song.songId}
                  id={song.songId}
                  onClick={this.playSong}
                />
              );
            })}
          </div>
        </div>
      </div>
    );
  }
}
