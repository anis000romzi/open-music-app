import api from '@/app/_utils/api';

const ActionType = {
  RECEIVE_ALBUM_DETAIL: 'RECEIVE_ALBUM_DETAIL',
  CLEAR_ALBUM_DETAIL: 'CLEAR_ALBUM_DETAIL',
};

function receiveAlbumDetailActionCreator(albumDetail) {
  return {
    type: ActionType.RECEIVE_ALBUM_DETAIL,
    payload: {
      albumDetail,
    },
  };
}

function clearAlbumDetailActionCreator() {
  return {
    type: ActionType.CLEAR_ALBUM_DETAIL,
  };
}

function asyncReceiveAlbumDetail(albumId) {
  return async (dispatch) => {
    dispatch(clearAlbumDetailActionCreator());
    try {
      const albumDetail = await api.getAlbumById(albumId);
      dispatch(receiveAlbumDetailActionCreator(albumDetail));
    } catch (error) {
      alert(error.message);
    }
  };
}

export {
  ActionType,
  receiveAlbumDetailActionCreator,
  clearAlbumDetailActionCreator,
  asyncReceiveAlbumDetail,
};
