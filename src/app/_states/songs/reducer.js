import { ActionType } from './action';

function songsReducer(songs = [], action = {}) {
  switch (action.type) {
    case ActionType.RECEIVE_SONGS:
      return action.payload.songs;
    case ActionType.LIKE_SONG:
      return songs.map((song) => {
        if (song.id === action.payload.songId) {
          return {
            ...song,
            likes: song.likes.concat([action.payload.userId]),
          };
        }
        return song;
      });
    case ActionType.DELETE_LIKE_SONG:
      return songs.map((song) => {
        if (song.id === action.payload.songId) {
          return {
            ...song,
            likes: song.likes.filter((id) => id !== action.payload.userId),
          };
        }
        return song;
      });
    default:
      return songs;
  }
}

export default songsReducer;
