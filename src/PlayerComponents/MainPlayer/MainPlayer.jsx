import React from 'react';
import './MainPlayer.css';

// Importing Icons
import likeIcon from '../../assets/icons/player-icons/like-icon.svg';
import shuffleIcon from '../../assets/icons/player-icons/shuffle-icon.svg';
import replayIcon from '../../assets/icons/player-icons/repeat-icon.svg';
import prevIcon from '../../assets/icons/player-icons/prev-icon.svg';
import nextIcon from '../../assets/icons/player-icons/next-icon.svg';
import shareIcon from '../../assets/icons/player-icons/share-icon.svg';

// Importing volumne Icons
import volumeIconMax from '../../assets/icons/volume-icons/volume-icon-max.svg';
import volumeIconMid from '../../assets/icons/volume-icons/volume-icon-mid.svg';
import volumeIconMin from '../../assets/icons/volume-icons/volume-icon-min.svg';
import volumeIconMuted from '../../assets/icons/volume-icons/volume-icon-muted.svg';

const MainPlayer = (props) => {
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
    <div className='main-player-container'>
      <div className='player-controls-container'>
        <div className='left-side-controls-container'>
          <div className='song-duration-container'>0:06 / 6:09</div>
          <div className='btn-container like-btn-container'>
            <img src={likeIcon} alt='Like Icon' />
          </div>
          <div className='btn-container shuffle-btn-container'>
            <img src={shuffleIcon} alt='Shuffle Icon' />
          </div>
          <div className='btn-container replay-btn-container'>
            <img src={replayIcon} alt='Replay Icon' />
          </div>
        </div>
        <div className='song-btn-container'>
          <div className='prev-btn-container'>
            <img src={prevIcon} alt='Previous Button Icon' />
          </div>
          <div className='play-pause-btn-container'>
            <div className='btn play' onClick={props.onPlayPause}>
              <span className='bar bar-1'></span>
              <span className='bar bar-2'></span>
            </div>
          </div>
          <div className='next-btn-container'>
            <img src={nextIcon} alt='Next Button Icon' />
          </div>
        </div>
        <div className='right-side-controls-container'>
          <div className='btn-container share-btn-container'>
            <img src={shareIcon} alt='ShareIcon' />
          </div>
          <div className='song-volume-container'>
            <div className='btn-container volume-icon-container'>
              <img src={volumeIcon} alt='Volume Icon' className='volume-icon' />
            </div>
            <input
              type='range'
              className='player-volume'
              min='0'
              max='10'
              step='1'
              defaultValue='5'
              // onChange={props.onVolumeChange}
            />
          </div>
        </div>
      </div>
      <div className='song-range-container'>
        <input
          type='range'
          className='player-range'
          min='0'
          max='100'
          step='1'
          defaultValue='69'
          // onClick={props.onSongSeek}
        />
      </div>
    </div>
  );
};

export default MainPlayer;
