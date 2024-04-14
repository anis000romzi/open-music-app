import { ActionType } from './action';

function tracksReducer(tracks = {}, action = {}) {
  switch (action.type) {
    case ActionType.RECEIVE_TRACKS:
      return action.payload.tracks;
    case ActionType.SET_PLAYING_TRACK:
      return {
        ...tracks,
        currentlyPlaying: tracks.tracks.filter(
          (track) => track.id === action.payload.songId
        )[0],
      };
    case ActionType.SET_IS_PLAYING:
      return {
        ...tracks,
        isPlaying: !tracks.isPlaying,
      };
    case ActionType.DELETE_TRACK:
      return {
        ...tracks,
        tracks: tracks.tracks.filter(
          (track) => track.id !== action.payload.songId
        ),
      };
    default:
      return tracks;
  }
}

export default tracksReducer;
