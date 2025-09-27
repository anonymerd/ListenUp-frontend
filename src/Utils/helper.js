import Song from '../Models/Song';

/**
 * @description Maps the song details from JS Object to Song Object.
 * @param {Object[]} songs The list of songs(in JS Object form).
 * @returns {Song[]} The list of songs(in Song Object form).
 */
export const mapToSongObject = (songs) => {
  const songObjectList = songs.map((song) => {
    return new Song(song.id, {
      name: song.name,
      artist: song.artist,
      thumbnail: song.thumbnail,
      streamAddress: song.streamAddress,
      isLiked: song.isLiked,
    });
  });

  return songObjectList;
};
