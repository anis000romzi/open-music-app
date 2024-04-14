import api from '@/app/_utils/api';

const ActionType = {
  RECEIVE_PLAYLIST_DETAIL: 'RECEIVE_PLAYLIST_DETAIL',
  CLEAR_PLAYLIST_DETAIL: 'CLEAR_PLAYLIST_DETAIL',
};

function receivePlaylistDetailActionCreator(playlistDetail) {
  return {
    type: ActionType.RECEIVE_PLAYLIST_DETAIL,
    payload: {
      playlistDetail,
    },
  };
}

function clearPlaylistDetailActionCreator(playlistDetail) {
  return {
    type: ActionType.CLEAR_PLAYLIST_DETAIL,
    payload: {
      playlistDetail,
    },
  };
}

function asyncReceivePlaylistDetail(playlistId) {
  return async (dispatch) => {
    dispatch(clearPlaylistDetailActionCreator());
    try {
      const playlistDetail = await api.getPlaylistById(playlistId);
      dispatch(receivePlaylistDetailActionCreator(playlistDetail));
    } catch (error) {
      alert(error.message);
    }
  };
}

export {
  ActionType,
  receivePlaylistDetailActionCreator,
  clearPlaylistDetailActionCreator,
  asyncReceivePlaylistDetail,
};
