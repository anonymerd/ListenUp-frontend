import React, { useRef } from 'react';

import './Player.css';

const Player = (props) => {
  const toggleButton = useRef(null);

  const toggleButtonEventHandler = () => {
    toggleButton.current.classList.toggle('play');
    toggleButton.current.classList.toggle('pause');
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

  return (
    <div className='player-container'>
      <div
        className='btn play'
        ref={toggleButton}
        onClick={toggleButtonEventHandler}
      >
        <span className='bar bar-1'></span>
        <span className='bar bar-2'></span>
      </div>
      <div className='time-container current-song-time'>
        {formatTime(parseInt(props.currSongTime))}
      </div>
      <div className='player-range-container'>
        <input type='range' className='player-range' />
      </div>
      <div className='time-container total-song-time'>
        {formatTime(parseInt(props.currSongDuration))}
      </div>
    </div>
  );
};

export default Player;
