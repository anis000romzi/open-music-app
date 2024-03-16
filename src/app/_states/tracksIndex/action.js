const ActionType = {
    RECEIVE_TRACKS_INDEX: 'RECEIVE_TRACKS_INDEX',
  };
  
  function receiveTracksIndexActionCreator(tracksIndex) {
    return {
      type: ActionType.RECEIVE_TRACKS_INDEX,
      payload: {
        tracksIndex,
      },
    };
  }
  
  function getTracksIndexQueue() {
    return async (dispatch) => {
      try {
        const tracksIndex = localStorage.getItem('tracks-queue-index');
        dispatch(receiveTracksIndexActionCreator(tracksIndex ? tracksIndex : 0));
      } catch (error) {
        alert(error.message);
      }
    };
  }
  
  function setTracksIndexQueue(tracksIndex) {
    return async (dispatch) => {
      try {
        localStorage.setItem('tracks-queue-index', tracksIndex);
        dispatch(getTracksIndexQueue());
      } catch (error) {
        alert(error.message);
      }
    };
  }
  
  export {
    ActionType,
    receiveTracksIndexActionCreator,
    getTracksIndexQueue,
    setTracksIndexQueue,
  };
  