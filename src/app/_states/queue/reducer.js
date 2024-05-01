import { ActionType } from './action';

function queueReducer(queue = {}, action = {}) {
  switch (action.type) {
    case ActionType.RECEIVE_QUEUE:
      return action.payload.queue;
    case ActionType.SET_PLAYING_SONG_IN_QUEUE:
      return {
        ...queue,
        currentlyPlaying: queue.queue.filter(
          (track) => track.id === action.payload.songId
        )[0],
      };
    case ActionType.SET_IS_PLAYING:
      return {
        ...queue,
        isPlaying: !queue.isPlaying,
      };
    case ActionType.DELETE_SONG_FROM_QUEUE:
      return {
        ...queue,
        queue: queue.queue.filter(
          (track) => track.id !== action.payload.songId
        ),
      };
    default:
      return queue;
  }
}

export default queueReducer;
