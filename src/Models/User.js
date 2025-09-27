import { mapToSongObject } from '../Utils/helper';
import { SERVER_ADDRESS } from '../Config/config';
import axios from 'axios';

export default class User {
  /**
   * @description User is a class that represent a single (;_;) user entity.
   * @constructor
   * @param {String} email E-mail of the user that is used to uniquely identify them.
   * @param {Object} properties Identifies additional properties(name, icon) of the user.
   */

  constructor(email, { name, icon } = {}) {
    this.email = email;
    this.name = name;
    this.icon = icon;
  }

  /**
   * @description Retrieves and returns current user's Liked songs.
   * @param {String} userAuthToken Authorization Token required to query the backend.
   * @returns {Song[]} List of current user's liked songs
   */
  async getLikedSongs(userAuthToken) {
    try {
      const response = await axios({
        method: 'GET',
        url: `${SERVER_ADDRESS}/user/like`,
        headers: {
          Authorization: `Bearer ${userAuthToken}`,
        },
      });

      if (response.data.success) {
        this.likedSongs = mapToSongObject(response.data.likedSongs);
        return this.likedSongs;
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      console.error(error);
    }
  }

  /**
   * Add the given song the list of user's liked songs.
   * @param {String} userAuthToken Authorization Token required to query the backend.
   * @param {Song} song The song which is to be added to the list of liked song.
   */
  async addToLikedSongs(userAuthToken, song) {
    try {
      const response = await axios({
        method: 'PUT',
        url: `${SERVER_ADDRESS}/user/like`,
        data: {
          songId: song.id,
        },
        headers: {
          Authorization: `Bearer ${userAuthToken}`,
        },
      });

      if (response.data.success) {
        return true;
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.error(error);
    }
  }
  /**
   * Remove the given song from the list of user's liked songs.
   * @param {String} userAuthToken Authorization Token required to query the backend.
   * @param {Song} song The song which is to be removed from the list of liked song.
   */
  async removeFromLikedSongs(userAuthToken, song) {
    try {
      const response = await axios({
        method: 'DELETE',
        url: `${SERVER_ADDRESS}/user/like`,
        data: {
          songId: song.id,
        },
        headers: {
          Authorization: `Bearer ${userAuthToken}`,
        },
      });

      if (response.data.success) {
        return true;
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.error(error);
    }
  }
}
