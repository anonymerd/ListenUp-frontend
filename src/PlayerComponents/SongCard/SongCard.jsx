import React, { Component } from 'react';
import './SongCard.css';

import likeIcon from '../../assets/icons/player-icons/like-icon.svg';

const List = (props) => {
  const songData = {
    streamAddress: props.songStream,
    songName: props.songName,
    songArtist: props.artistName,
    songThumbnail: props.songThumbnail,
    songId: props.id,
  };
  return (
    <>
      <div
        className='search-result-song'
        onClick={() => props.onClick(songData)}
      >
        <div
          className='song-thumbnail'
          style={{ backgroundImage: `url(${props.songThumbnail})` }}
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
