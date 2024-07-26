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
        isPlaying: action.payload.status,
      };
    case ActionType.SET_QUEUE_POSITION:
      // Create a shallow copy of the queue array
      const newQueue = [...queue.queue];

      // Remove the element from the dragIndex
      const [removedElement] = newQueue.splice(action.payload.dragIndex, 1);

      // Insert the removed element at the hoverIndex
      newQueue.splice(action.payload.hoverIndex, 0, removedElement);
      return {
        ...queue,
        queue: newQueue,
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
