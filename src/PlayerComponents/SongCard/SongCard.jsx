import React, { useState } from 'react';
import './SongCard.css';

import likeIcon from '../../assets/icons/player-icons/like-icon.svg';
import likedIcon from '../../assets/icons/player-icons/liked-icon.svg';

const SongCard = (props) => {
  const [isLiked, toggleLike] = useState(props.isLiked);
  const songData = {
    streamAddress: props.songStream,
    songName: props.songName,
    songArtist: props.artistName,
    songThumbnail: props.songThumbnail,
    songId: props.id,
    isLiked: isLiked, // State
  };
  return (
    <>
      <div className='search-result-song'>
        <div
          className='song-thumbnail'
          style={{ backgroundImage: `url(${props.songThumbnail})` }}
          onClick={() => props.onClick(songData)}
        ></div>
        <div className='music-info'>
          <div className='song-name'>{props.songName}</div>
          <div className='artist-name'>{props.artistName}</div>
          <div className='like-icon-container'>
            {isLiked ? (
              <img
                src={likedIcon}
                alt='Liked Icon'
                onClick={() => {
                  toggleLike(false);
                  props.removeFromLikedSongs();
                }}
              />
            ) : (
              <img
                src={likeIcon}
                alt='Like Icon'
                onClick={() => {
                  toggleLike(true);
                  props.addToLikedSongs();
                }}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default SongCard;
