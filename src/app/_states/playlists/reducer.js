import { ActionType } from './action';

function playlistsReducer(playlists = [], action = {}) {
  switch (action.type) {
    case ActionType.RECEIVE_PLAYLISTS:
      return action.payload.playlists;
    case ActionType.DELETE_PLAYLIST:
      return playlists.filter(
        (playlist) => playlist.id !== action.payload.playlistId
      );
    case ActionType.ADD_SONG_TO_PLAYLIST:
      return playlists.map((playlist) => {
        if (playlist.id === action.payload.playlistId) {
          return {
            ...playlist,
            songs: playlist.songs.concat([action.payload.songId]),
          };
        }
        return playlist;
      });
    case ActionType.DELETE_SONG_FROM_PLAYLIST:
      return playlists.map((playlist) => {
        if (playlist.id === action.payload.playlistId) {
          return {
            ...playlist,
            songs: playlist.songs.filter((id) => id !== action.payload.songId),
          };
        }
        return playlist;
      });
    default:
      return playlists;
  }
}

export default playlistsReducer;
