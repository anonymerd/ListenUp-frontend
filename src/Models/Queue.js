export default class Queue {
  constructor(songList) {
    this.songList = songList;
    this.currentSong = -1;

    this.getCurrentSong = () => {
      if (this.currentSong > -1 && this.currentSong < this.songList.length()) {
        return this.songList[this.currentSong];
      } else {
        return null;
      }
    };

    this.getNextSong = () => {
      if (
        this.currentSong >= -1 &&
        this.currentSong < this.songList.length() - 1
      ) {
        return this.songList[++this.currentSong];
      } else {
        return null;
      }
    };

    this.getPrevSong = () => {
      if (this.currentSong > 0 && this.currentSong <= this.songList.length()) {
        return this.songList[--this.currentSong];
      } else {
        return null;
      }
    };
  }
}
