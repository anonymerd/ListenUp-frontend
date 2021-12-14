export default class Song {
  constructor(id, name, artist, thumbnail, streamAddress, isSongLiked) {
    this.id = id;
    this.name = name;
    this.artist = artist;
    this.thumbnail = thumbnail;
    this.streamAddress = streamAddress;
    this.isLiked = isSongLiked;

    this.load = () => {
      this.audio = new Audio(this.streamAddress);

      // this.audio.addEventListener('canplaythrough', () )
    };

    this.setDuration = (duration) => {
      this.duration = duration;
    };

    this.getInfo = () => {
      return {
        id: this.id,
        name: this.name,
        artist: this.artist,
        thumbnail: this.thumbnail,
        streamAddress: this.streamAddress,
        isLiked: this.isLiked,
      };
    };
  }
}
