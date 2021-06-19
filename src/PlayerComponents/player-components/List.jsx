import React, {Component} from 'react';
import './list.css';

const  List = (props) => {
    return(
        <>
            <div className="music-list-element">
                <div className="thumbnail" style={{backgroundImage: `url(${props.thumbnail})`}}></div>
                <div className="music-info">
                    <div className="music-info-inner">
                        <div className="song-name">
                            {props.songName}
                        </div>
                        <div className="artist-name">
                            {props.artistName}
                        </div>
                    </div>
                </div>
            </div>
            <hr style={{width: '95%'}}/>
        </>
    );
}

export default List;