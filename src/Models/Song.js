import { mapToSongObject } from '../Utils/helper';
import { SERVER_ADDRESS } from '../Config/config';
import axios from 'axios';

export default class Song {
  /**
   * @description Song is a class that represents a single song with all of its properties.
   * @constructor
   * @param  {String} id The unique identifier of the song.
   * @param  {Object} properties Identifies additional properties(name, artist, thumbnail, streamAddress, isLiked) of the song.
   */
  constructor(id, { name, artist, thumbnail, streamAddress, isLiked } = {}) {
    this.id = id;
    this.name = name;
    this.artist = artist;
    this.thumbnail = thumbnail;
    this.streamAddress = streamAddress;
    this.isLiked = isLiked;
  }

  /**
   * @description Loads the song.
   */
  load() {
    // Creating a new audio element and storing it into the class instance.
    this.audio = new Audio(this.streamAddress);
  }

  /**
   * @description Sets the duration of the song.
   * @param {Number} duration The length of the song.
   */
  setDuration(duration) {
    this.duration = duration;
  }

  /**
   * @description Returns the information about the song.
   * @returns {Object} The object containing all the details of the song.
   */
  getInfo() {
    const songData = {
      id: this.id,
      name: this.name,
      artist: this.artist,
      thumbnail: this.thumbnail,
      streamAddress: this.streamAddress,
      isLiked: this.isLiked,
    };

    return songData;
  }

  /**
   * @description Marks the song as Liked.
   */
  like() {
    this.isLiked = true;
  }

  /**
   * @description Marks the song as Unliked.
   */
  unlike() {
    this.isLiked = false;
  }

  /**
   * @description Retrieves the recommended songs of this song.
   * @param {String} userAuthToken Authorization Token required to query the backend.
   * @returns {Song[]} List of recommended songs.
   */
  async getRecommendations(userAuthToken) {
    try {
      const response = await axios({
        url: `${SERVER_ADDRESS}/suggestions/${this.id}`,
        headers: {
          Authorization: `Bearer ${userAuthToken}`,
        },
      });

      if (response.data.success) {
        console.log(this.recomendations);
        this.recomendations = mapToSongObject(response.data.suggestions);
        return this.recomendations;
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      console.error(error);
    }
  }
}
