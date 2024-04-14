const ActionType = {
  RECEIVE_TRACKS: 'RECEIVE_TRACKS',
  SET_PLAYING_TRACK: 'SET_PLAYING_TRACK',
  DELETE_TRACK: 'DELETE_TRACK',
  SET_IS_PLAYING: 'SET_IS_PLAYING',
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

function deleteTrackActionCreator(songId) {
  return {
    type: ActionType.DELETE_TRACK,
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
        JSON.stringify({
          currentlyPlaying: tracks[0],
          tracks,
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
          isPlaying: false,
        })
      );
    } catch (error) {
      alert(error.message);
    }
  };
}

function deleteTrack(songId) {
  return async (dispatch, getState) => {
    const { tracks } = getState();

    dispatch(deleteTrackActionCreator(songId));
    try {
      localStorage.setItem(
        'tracks-queue',
        JSON.stringify({
          ...tracks,
          tracks: tracks.tracks.filter((track) => track.id !== songId),
        })
      );
    } catch (error) {
      alert(error.message);
    }
  };
}

function setIsPlaying() {
  return async (dispatch, getState) => {
    const { tracks } = getState();

    dispatch(setIsPlayingActionCreator());
    try {
      localStorage.setItem(
        'tracks-queue',
        JSON.stringify({
          ...tracks,
          isPlaying: !tracks.isPlaying,
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
  setIsPlaying,
  deleteTrack,
};
