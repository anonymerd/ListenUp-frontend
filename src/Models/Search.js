import { mapToSongObject } from '../Utils/helper';
import { SERVER_ADDRESS } from '../Config/config';
import axios from 'axios';

export default class Search {
  /**
   * @description Search is a class that represent a single search action.
   * @constructor
   * @param {String} query The search query
   */
  constructor(query) {
    this.query = query;
  }

  /**
   * @description Retrieves and returns the search results from backend.
   * @param {String} userAuthToken Authorization Token required to query the backend.
   * @returns {Song[]} List of the songs based on the search query.
   */
  async getResults(userAuthToken) {
    // If the query is empty do nothing.
    if (!this.query) return;

    try {
      const response = await axios({
        method: 'POST',
        url: `${SERVER_ADDRESS}/search?q=${this.query}`,
        headers: {
          Authorization: `Bearer ${userAuthToken}`,
        },
      });

      if (response.data.success) {
        this.results = mapToSongObject(response.data.searchResults);
        return this.results;
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      console.error(error);
    }
  }
}
