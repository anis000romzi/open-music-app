import api from '@/app/_utils/api';

const ActionType = {
  RECEIVE_ALBUM_DETAIL: 'RECEIVE_ALBUM_DETAIL',
  CLEAR_ALBUM_DETAIL: 'CLEAR_ALBUM_DETAIL',
  LIKE_ALBUM_DETAIL_SONG: 'LIKE_ALBUM_DETAIL_SONG',
  DELETE_ALBUM_DETAIL_LIKE_SONG: 'DELETE_LIKE_SONG',
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

function likeAlbumDetailSongActionCreator(songId, userId) {
  return {
    type: ActionType.LIKE_ALBUM_DETAIL_SONG,
    payload: {
      songId,
      userId,
    },
  };
}

function deleteAlbumDetailLikeSongActionCreator(songId, userId) {
  return {
    type: ActionType.DELETE_ALBUM_DETAIL_LIKE_SONG,
    payload: {
      songId,
      userId,
    },
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

function asyncAlbumDetailLikeSong(songId) {
  return async (dispatch, getState) => {
    const { authUser } = getState();
    dispatch(likeAlbumDetailSongActionCreator(songId, authUser.id));
    try {
      await api.likeSong(songId);
    } catch (error) {
      alert(error.message);
      dispatch(deleteAlbumDetailLikeSongActionCreator(songId, authUser.id));
    }
  };
}

function asyncDeleteAlbumDetailLikeSong(songId) {
  return async (dispatch, getState) => {
    const { authUser } = getState();
    dispatch(deleteAlbumDetailLikeSongActionCreator(songId, authUser.id));
    try {
      await api.deleteLikeSong(songId);
    } catch (error) {
      alert(error.message);
      dispatch(likeAlbumDetailSongActionCreator(songId, authUser.id));
    }
  };
}

export {
  ActionType,
  receiveAlbumDetailActionCreator,
  clearAlbumDetailActionCreator,
  asyncReceiveAlbumDetail,
  asyncAlbumDetailLikeSong,
  asyncDeleteAlbumDetailLikeSong,
};
