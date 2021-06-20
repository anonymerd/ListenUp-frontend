import React, { Component } from 'react';
import './PlayerArea.css';
import homeIcon from '../assets/icons/home_icon.png';
import searchIcon from '../assets/icons/search_icon.png';
import thumbnail from '../assets/images/img1.jpg';
import history from '../history';
import MainPlayer from './MainPlayer/MainPlayer';
import List from './List/List';

export default class PlayerArea extends Component {
  state = {
    musicListSaved: [
      {
        songName: 'Song 1',
        artistName: 'Eminem',
        songThumbnail:
          'https://www.biography.com/.image/ar_1:1%2Cc_fill%2Ccs_srgb%2Cg_face%2Cq_auto:good%2Cw_300/MTQ3NjM5MTEzMTc5MjEwODI2/eminem_photo_by_dave_j_hogan_getty_images_entertainment_getty_187596325.jpg',
      },
      {
        songName: 'Song part-2',
        artistName: 'Eminem 2',
        songThumbnail:
          'https://www.biography.com/.image/ar_1:1%2Cc_fill%2Ccs_srgb%2Cg_face%2Cq_auto:good%2Cw_300/MTQ3NjM5MTEzMTc5MjEwODI2/eminem_photo_by_dave_j_hogan_getty_images_entertainment_getty_187596325.jpg',
      },
      {
        songName: 'Song 3',
        artistName: 'Eminem 3',
        songThumbnail:
          'https://www.biography.com/.image/ar_1:1%2Cc_fill%2Ccs_srgb%2Cg_face%2Cq_auto:good%2Cw_300/MTQ3NjM5MTEzMTc5MjEwODI2/eminem_photo_by_dave_j_hogan_getty_images_entertainment_getty_187596325.jpg',
      },
    ],
  };

  switchPage = () => {
    history.push('/');
  };

  // functions for button Component sent in props to Options.jsx
  showSaved = () => {
    console.log('bkc');
    var savedArray = [];
    savedArray.push({
      songName: 'Real Slim Shady',
      artistName: 'Eminem',
      songThumbnail:
        'https://www.biography.com/.image/ar_1:1%2Cc_fill%2Ccs_srgb%2Cg_face%2Cq_auto:good%2Cw_300/MTQ3NjM5MTEzMTc5MjEwODI2/eminem_photo_by_dave_j_hogan_getty_images_entertainment_getty_187596325.jpg',
    });
    savedArray.push({
      songName: 'Not Afraid',
      artistName: 'Eminem 2',
      songThumbnail:
        'https://www.biography.com/.image/ar_1:1%2Cc_fill%2Ccs_srgb%2Cg_face%2Cq_auto:good%2Cw_300/MTQ3NjM5MTEzMTc5MjEwODI2/eminem_photo_by_dave_j_hogan_getty_images_entertainment_getty_187596325.jpg',
    });
    savedArray.push({
      songName: 'Loose Yourself',
      artistName: 'Eminem 3',
      songThumbnail:
        'https://www.biography.com/.image/ar_1:1%2Cc_fill%2Ccs_srgb%2Cg_face%2Cq_auto:good%2Cw_300/MTQ3NjM5MTEzMTc5MjEwODI2/eminem_photo_by_dave_j_hogan_getty_images_entertainment_getty_187596325.jpg',
    });
    // this.setState({
    //   musicListSaved: savedArray,
    // });
  };
  showRecommended = () => {
    console.log('bkc2');
  };
  showShared = () => {
    console.log('bkc3');
  };

  render() {
    const musicSaved = [];
    const savedListObj = this.state.musicListSaved;
    for (var i = 0; i < savedListObj.length; i++) {
      musicSaved.push(
        <List
          songName={savedListObj[i].songName}
          artistName={savedListObj[i].artistName}
          thumbnail={savedListObj[i].songThumbnail}
        />
      );
    }
    return (
      <div className='player-area-wrapper'>
        <div className='left-section'>
          <div className='home-button-container'>
            <img src={homeIcon} onClick={this.switchPage} />
          </div>
          <div className='song-info-container'>
            <div
              className='song-thumbnail'
              style={{ backgroundImage: `url(${thumbnail})` }}
            ></div>
            <div className='artist-name'>Eminem</div>
            <div className='song-name'>The Slim Shady</div>
          </div>
          <div className='main-player-container'>
            <MainPlayer></MainPlayer>
          </div>
        </div>
        <div className='right-section'>
          <div className='search-bar-container'>
            <input
              type='text'
              placeholder='Search for Songs!'
              className='search-box'
            ></input>
            <div className='search-button'>
              <img src={searchIcon} width='18px' />
            </div>
          </div>
          {/* <div className='options'>
            <Options value='saved' func={this.showSaved} />
            <Options value='Recommended' func={this.showRecommended} />
            <Options value='Shared' func={this.showShared} />
          </div> */}
          <div className='search-results'>{musicSaved}</div>
        </div>
      </div>
    );
  }
}
