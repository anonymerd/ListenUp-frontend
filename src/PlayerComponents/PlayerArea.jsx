import React, { Component } from 'react';
import './MainPlayer.css';
import homeIcon from '../assets/icons/home_icon.png';
import searchIcon from '../assets/icons/search_icon.png';
import thumbnail from '../assets/images/img1.jpg';
import history from '../history';
import Player from '../HomepageComponents/Player/Player';
import Options from './player-components/Options';
import List from './player-components/List';

export default class PlayerArea extends Component {

    state = {
        musicListSaved: []
    }

    switchPage = () => {
        history.push('/');
    }

    // functions for button Component sent in props to Options.jsx
    showSaved = () => {
        console.log('bkc');
        var savedArray = [];
        savedArray.push(
            {
                songName: 'chal hat behen ki lodi',
                artistName: 'rohit bisht',
                songThumbnail: 'https://www.biography.com/.image/ar_1:1%2Cc_fill%2Ccs_srgb%2Cg_face%2Cq_auto:good%2Cw_300/MTQ3NjM5MTEzMTc5MjEwODI2/eminem_photo_by_dave_j_hogan_getty_images_entertainment_getty_187596325.jpg'
            }
        );
        savedArray.push(
            {
                songName: 'chal hat behen ki lodi part-2',
                artistName: 'rohit bisht',
                songThumbnail: 'https://www.biography.com/.image/ar_1:1%2Cc_fill%2Ccs_srgb%2Cg_face%2Cq_auto:good%2Cw_300/MTQ3NjM5MTEzMTc5MjEwODI2/eminem_photo_by_dave_j_hogan_getty_images_entertainment_getty_187596325.jpg'
            }
        );
        savedArray.push(
            {
                songName: 'chal hat behen ki lodi part-3 deluxe',
                artistName: 'rohit bisht',
                songThumbnail: 'https://www.biography.com/.image/ar_1:1%2Cc_fill%2Ccs_srgb%2Cg_face%2Cq_auto:good%2Cw_300/MTQ3NjM5MTEzMTc5MjEwODI2/eminem_photo_by_dave_j_hogan_getty_images_entertainment_getty_187596325.jpg'
            }
        );
        this.setState({
            musicListSaved:savedArray
        });
    }
    showRecommended = () => {
        console.log('bkc2');
    }
    showShared = () => {
        console.log('bkc3');
    }

    render() {

        const musicSaved = [];
        const savedListObj = this.state.musicListSaved;
        for(var i=0;i<savedListObj.length; i++) {
            musicSaved.push(<List songName={savedListObj[i].songName}
            artistName={savedListObj[i].artistName}
            thumbnail={savedListObj[i].songThumbnail}
            />);
        }
        return (
           <div className="player-wrapper">
               <div className="inner-wrapper">
                   <div className="left-section">
                        <div className="home-button">
                            <img src={homeIcon} width="20px" onClick={this.switchPage}/>
                        </div>
                        <div className="music-info"> 
                            <div className="thumbnail" style={{backgroundImage: `url(${thumbnail})`}}></div>
                            <div className="artist-name">
                                Eminem
                            </div>
                            <div className="song-name">
                                The Slim Shady
                            </div>
                        </div>
                        <div className="player">
                            <Player/>
                        </div>
                   </div>
                   <div className="right-section">
                        <div className="search-bar">
                            <form action='#'>
                                <input type="text" placeholder="Search for Songs!" className="search-box"></input>
                                <button className="search-button">
                                    <img src={searchIcon} width="18px"/>
                                </button>
                            </form>
                        </div>
                        <div className="options">
                            <Options value = "saved" func = {this.showSaved}/> 
                            <Options value = "Recommended" func = {this.showRecommended}/>
                            <Options value = "Shared" func = {this.showShared}/>
                        </div>
                        <div className="lists">
                            {musicSaved}
                        </div>
                   </div>   
               </div>
           </div>
        );
    }
}
