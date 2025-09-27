export default class Queue {
  /**
   * @description Queue is a class that represents a list of Songs.
   * @constructor
   * @param {Song[]} songList The list of the songs that will make up the queue.
   */
  constructor(songList = []) {
    this.songList = songList;
    this.currentSongNumber = 0;
  }

  /**
   * @description Adds a song in the queue.
   * @param {Song} song The song which is to be added in the queue.
   */
  addSong(song) {
    this.songList.push(song);
  }

  /**
   * @description Updates a song in the Song List.
   * @param {String} id The id of the song which is to be updated.
   * @param {Song} newSong The updated song
   */
  updateSong(id, newSong) {
    this.songList.forEach((song) => {
      if (song.id == id) song = Object.create(newSong);
    });
  }

  /**
   * @description Returns the current song.
   * @returns {Song} The current song.
   */
  getCurrentSong() {
    return this.songList[this.currentSongNumber];
  }

  /**
   * @description Returns the next song.
   * @returns {Song} The next song.
   */
  getNextSong() {
    if (
      this.currentSongNumber >= 0 &&
      this.currentSongNumber < this.songList.length - 1
    ) {
      this.currentSongNumber++;
      return this.getCurrentSong();
    } else {
      console.log('No next song!!!');
      return null;
    }
  }

  /**
   * @description Returns the previous song.
   * @returns {Song} The previous song.
   */
  getPrevSong() {
    if (
      this.currentSongNumber > 0 &&
      this.currentSongNumber < this.songList.length
    ) {
      this.currentSongNumber--;
      return this.getCurrentSong();
    } else {
      console.log('No previous song!!!');
      return null;
    }
  }
}
