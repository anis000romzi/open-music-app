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

function setIsPlayingActionCreator() {
  return {
    type: ActionType.SET_IS_PLAYING,
  };
}

function getTracksQueue() {
  return async (dispatch) => {
    try {
      const queue = localStorage.getItem('tracks-queue');
      dispatch(receiveQueueActionCreator(queue ? JSON.parse(queue) : {}));
    } catch (error) {
      alert(error.message);
    }
  };
}

function setNewTracksQueue(queue) {
  return async (dispatch) => {
    try {
      localStorage.setItem(
        'tracks-queue',
        JSON.stringify({
          currentlyPlaying: queue[0],
          queue,
          isPlaying: false,
        })
      );
      localStorage.setItem('tracks-queue-index', 0);
      dispatch(getTracksQueue());
    } catch (error) {
      alert(error.message);
    }
  };
}

function setPlayingSongInQueue(songId) {
  return async (dispatch, getState) => {
    const { queue } = getState();

    dispatch(setPlayingSongInQueueActionCreator(songId));
    try {
      localStorage.setItem(
        'tracks-queue',
        JSON.stringify({
          ...queue,
          currentlyPlaying: queue.queue.filter(
            (track) => track.id === songId
          )[0],
          isPlaying: false,
        })
      );
    } catch (error) {
      alert(error.message);
    }
  };
}

function deleteSongFromQueue(songId) {
  return async (dispatch, getState) => {
    const { queue } = getState();

    dispatch(deleteSongFromQueueActionCreator(songId));
    try {
      localStorage.setItem(
        'tracks-queue',
        JSON.stringify({
          ...queue,
          queue: queue.queue.filter((track) => track.id !== songId),
        })
      );
    } catch (error) {
      alert(error.message);
    }
  };
}

function setIsPlaying() {
  return async (dispatch, getState) => {
    const { queue } = getState();

    dispatch(setIsPlayingActionCreator());
    try {
      localStorage.setItem(
        'tracks-queue',
        JSON.stringify({
          ...queue,
          isPlaying: !queue.isPlaying,
        })
      );
    } catch (error) {
      alert(error.message);
    }
  };
}

export {
  ActionType,
  receiveQueueActionCreator,
  setPlayingSongInQueueActionCreator,
  getTracksQueue,
  setNewTracksQueue,
  setPlayingSongInQueue,
  setIsPlaying,
  deleteSongFromQueue,
};
