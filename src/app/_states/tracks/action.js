const ActionType = {
  RECEIVE_TRACKS: 'RECEIVE_TRACKS',
  SET_PLAYING_TRACK: 'SET_PLAYING_TRACK',
};

function receiveTracksActionCreator(tracks) {
  return {
    type: ActionType.RECEIVE_TRACKS,
    payload: {
      tracks,
    },
  };
}

function setPlayingTrackActionCreator(songId) {
  return {
    type: ActionType.SET_PLAYING_TRACK,
    payload: {
      songId,
    },
  };
}

function getTracksQueue() {
  return async (dispatch) => {
    try {
      const tracks = localStorage.getItem('tracks-queue');
      dispatch(receiveTracksActionCreator(tracks ? JSON.parse(tracks) : {}));
    } catch (error) {
      alert(error.message);
    }
  };
}

function setNewTracksQueue(tracks) {
  return async (dispatch) => {
    try {
      localStorage.setItem(
        'tracks-queue',
        JSON.stringify({ currentlyPlaying: tracks[0], tracks })
      );
      localStorage.setItem('tracks-queue-index', 0);
      dispatch(getTracksQueue());
    } catch (error) {
      alert(error.message);
    }
  };
}

function setPlayingTrack(songId) {
  return async (dispatch, getState) => {
    const { tracks } = getState();

    dispatch(setPlayingTrackActionCreator(songId));
    try {
      localStorage.setItem(
        'tracks-queue',
        JSON.stringify({
          ...tracks,
          currentlyPlaying: tracks.tracks.filter(
            (track) => track.id === songId
          )[0],
        })
      );
    } catch (error) {
      alert(error.message);
    }
  };
}

export {
  ActionType,
  receiveTracksActionCreator,
  setPlayingTrackActionCreator,
  getTracksQueue,
  setNewTracksQueue,
  setPlayingTrack,
};
