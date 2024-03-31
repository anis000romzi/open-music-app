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
    default:
      return tracks;
  }
}

export default tracksReducer;
