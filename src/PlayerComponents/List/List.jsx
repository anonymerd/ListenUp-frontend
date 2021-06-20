import React, { Component } from 'react';
import './List.css';

import likeIcon from '../../assets/icons/like-icon.svg';

const List = (props) => {
  return (
    <>
      <div className='search-result-song'>
        <div
          className='song-thumbnail'
          style={{ backgroundImage: `url(${props.thumbnail})` }}
        ></div>
        <div className='music-info'>
          <div className='song-name'>{props.songName}</div>
          <div className='artist-name'>{props.artistName}</div>
          <div className='like-icon-container'>
            <img src={likeIcon} alt='Like Icon' />
          </div>
        </div>
      </div>
    </>
  );
};

export default List;
