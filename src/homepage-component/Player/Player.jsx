import React, { useRef } from 'react';

import './Player.css';

// Importing volumne Icons
import volumeIconMax from '../../assets/icons/volume-icons/volume-icon-max.svg';
import volumeIconMid from '../../assets/icons/volume-icons/volume-icon-mid.svg';
import volumeIconMin from '../../assets/icons/volume-icons/volume-icon-min.svg';
import volumeIconMuted from '../../assets/icons/volume-icons/volume-icon-muted.svg';

// Importing Loader
import loaderIcon from '../../assets/icons/loader.svg';

const Player = (props) => {
  // Creating Loader
  const loader = (
    <div className='loader-container'>
      <img src={loaderIcon} alt='Loader Icon' />
    </div>
  );

  // Function to convert seconds into hh:mm:ss or mm:ss format.
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

  // Determining the volume icon according to volume slider value.
  let volumeIcon = volumeIconMid;
  if (props.volume == 0) volumeIcon = volumeIconMuted;
  else if (props.volume <= 3) volumeIcon = volumeIconMin;
  else if (props.volume > 3 && props.volume < 7) volumeIcon = volumeIconMid;
  else volumeIcon = volumeIconMax;

  return (
    <div className='player-container'>
      {/* Toggle button to play/pause the song */}

      {props.hasSongLoaded ? (
        <div className='toggle-btn-contanier'>
          <div className='btn play' onClick={props.onPlayPause}>
            <span className='bar bar-1'></span>
            <span className='bar bar-2'></span>
          </div>
        </div>
      ) : (
        loader
      )}
      <div className='time-container current-song-time'>
        {formatTime(parseInt(props.songTimeElapsed))}
      </div>

      {/* The div that contains the song slider to seek songs to a particular time */}

      <div className='player-range-container'>
        <input
          type='range'
          className='player-range'
          min='0'
          max={parseInt(props.songDuration)}
          step='1'
          defaultValue={parseInt(props.songTimeElapsed)}
          onClick={props.onSongSeek}
        />
      </div>

      {/* The div that contains the total song duration. */}

      <div className='time-container total-song-time'>
        {formatTime(parseInt(props.songDuration))}
      </div>

      {/* The div that contains the volume slider. */}

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
          onChange={props.onVolumeChange}
        />
      </div>
    </div>
  );
};

export default Player;
