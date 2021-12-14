export default class Song {
  constructor(id, name, artist, thumbnail, streamAddress, isSongLiked) {
    this.id = id;
    this.name = name;
    this.artist = artist;
    this.thumbnail = thumbnail;
    this.streamAddress = streamAddress;
    this.isSongLiked = isSongLiked;
  }
}
