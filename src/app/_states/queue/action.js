import { toast } from "react-toastify";
const ActionType = {
  RECEIVE_QUEUE: 'RECEIVE_QUEUE',
  SET_PLAYING_SONG_IN_QUEUE: 'SET_PLAYING_SONG_IN_QUEUE',
  DELETE_SONG_FROM_QUEUE: 'DELETE_SONG_FROM_QUEUE',
  SET_IS_PLAYING: 'SET_IS_PLAYING',
};

function receiveQueueActionCreator(queue) {
  return {
    type: ActionType.RECEIVE_QUEUE,
    payload: {
      queue,
    },
  };
}

function setPlayingSongInQueueActionCreator(songId) {
  return {
    type: ActionType.SET_PLAYING_SONG_IN_QUEUE,
    payload: {
      songId,
    },
  };
}

function deleteSongFromQueueActionCreator(songId) {
  return {
    type: ActionType.DELETE_SONG_FROM_QUEUE,
    payload: {
      songId,
    },
  };
}

function setIsPlayingActionCreator(status) {
  return {
    type: ActionType.SET_IS_PLAYING,
    payload: {
      status
    }
  };
}

function setNewTracksQueue(queue) {
  return async (dispatch) => {
    try {
      dispatch(
        receiveQueueActionCreator({
          currentlyPlaying: queue[0],
          queue,
          isPlaying: false,
        })
      );
    } catch (error) {
      toast.error(error.message);
    }
  };
}

function setPlayingSongInQueue(songId) {
  return async (dispatch) => {
    try {
      dispatch(setPlayingSongInQueueActionCreator(songId));
    } catch (error) {
      toast.error(error.message);
    }
  };
}

function deleteSongFromQueue(songId) {
  return async (dispatch) => {
    try {
      dispatch(deleteSongFromQueueActionCreator(songId));
    } catch (error) {
      toast.error(error.message);
    }
  };
}

function setIsPlaying(status) {
  return async (dispatch) => {
    try {
      dispatch(setIsPlayingActionCreator(status));
    } catch (error) {
      toast.error(error.message);
    }
  };
}

export {
  ActionType,
  receiveQueueActionCreator,
  setPlayingSongInQueueActionCreator,
  setNewTracksQueue,
  setPlayingSongInQueue,
  setIsPlaying,
  deleteSongFromQueue,
};
