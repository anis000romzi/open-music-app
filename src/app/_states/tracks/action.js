const ActionType = {
  RECEIVE_TRACKS: 'RECEIVE_TRACKS',
};

function receiveTracksActionCreator(tracks) {
  return {
    type: ActionType.RECEIVE_TRACKS,
    payload: {
      tracks,
    },
  };
}

function getTracksQueue() {
  return async (dispatch) => {
    try {
      const tracks = localStorage.getItem('tracks-queue');
      dispatch(receiveTracksActionCreator(tracks ? JSON.parse(tracks) : []));
    } catch (error) {
      alert(error.message);
    }
  };
}

function setNewTracksQueue(tracks) {
  return async (dispatch) => {
    try {
      localStorage.setItem('tracks-queue', JSON.stringify(tracks));
      dispatch(getTracksQueue());
    } catch (error) {
      alert(error.message);
    }
  };
}

export {
  ActionType,
  receiveTracksActionCreator,
  getTracksQueue,
  setNewTracksQueue,
};
