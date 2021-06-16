import React, { useRef } from 'react';

import './Player.css';
import volumeIconMax from '../../assets/icons/volume-icons/volume-icon-max.svg';
import volumeIconMid from '../../assets/icons/volume-icons/volume-icon-mid.svg';
import volumeIconMin from '../../assets/icons/volume-icons/volume-icon-min.svg';
import volumeIconMuted from '../../assets/icons/volume-icons/volume-icon-muted.svg';

const Player = (props) => {
  const toggleButtonEventHandler = (event) => {
    const toggleButton = event.target;

    toggleButton.classList.toggle('play');
    toggleButton.classList.toggle('pause');
    props.clicked();
  };

  const formatTime = (time) => {
    const hours = parseInt(time / 3600);
    const mins = parseInt((time % 3600) / 60);
    const secs = parseInt(time % 60);

    let result = '';
    if (hours > 0) {
      result += hours + ':' + (mins < 10 ? '0' : '');
    }

    result += mins + ':' + (secs < 10 ? '0' : '');
    result += secs;

    return result;
  };

  const handleInputChange = (event) => {
    console.log(event.target.value);
  };

  let volumeIcon = volumeIconMid;
  if (props.volume == 0) volumeIcon = volumeIconMuted;
  else if (props.volume <= 3) volumeIcon = volumeIconMin;
  else if (props.volume > 3 && props.volume < 7) volumeIcon = volumeIconMid;
  else volumeIcon = volumeIconMax;

  return (
    <div className='player-container'>
      <div className='toggle-btn-contanier'>
        <div className='btn play' onClick={toggleButtonEventHandler}>
          <span className='bar bar-1'></span>
          <span className='bar bar-2'></span>
        </div>
      </div>
      <div className='time-container current-song-time'>
        {formatTime(parseInt(props.currSongTime))}
      </div>
      <div className='player-range-container'>
        <input
          type='range'
          className='player-range'
          min='0'
          max={parseInt(props.currSongDuration)}
          step='1'
          defaultValue={parseInt(props.currSongTime)}
          onClick={props.slide}
        />
      </div>
      <div className='time-container total-song-time'>
        {formatTime(parseInt(props.currSongDuration))}
      </div>
      <div className='player-volume-container'>
        <div className='volume-icon-container'>
          <img src={volumeIcon} alt='Volume Icon' className='volume-icon' />
        </div>
        <input
          type='range'
          className='player-volume'
          min='0'
          max='10'
          step='1'
          defaultValue='5'
          onChange={props.volumeChange}
        />
      </div>
    </div>
  );
};

export default Player;
