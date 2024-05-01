import api from '@/app/_utils/api';

const ActionType = {
  RECEIVE_ALBUMS: 'RECEIVE_ALBUMS',
  CLEAR_ALBUMS: 'CLEAR_ALBUMS',
  EDIT_ALBUMS: 'EDIT_ALBUMS',
  CHANGE_COVER_ALBUMS: 'CHANGE_COVER_ALBUMS',
};

function receiveAlbumsActionCreator(albums) {
  return {
    type: ActionType.RECEIVE_ALBUMS,
    payload: {
      albums,
    },
  };
}

function clearAlbumsActionCreator() {
  return {
    type: ActionType.CLEAR_ALBUMS,
  };
}

function editAlbumsActionCreator({ id, name, year }) {
  return {
    type: ActionType.EDIT_ALBUMS,
    payload: {
      id,
      name,
      year,
    },
  };
}

function changeCoverAlbumsActionCreator(albumId, file) {
  return {
    type: ActionType.CHANGE_COVER_ALBUMS,
    payload: {
      albumId,
      file,
    },
  };
}

function asyncGetPopularAlbums() {
  return async (dispatch) => {
    dispatch(clearAlbumsActionCreator());
    try {
      const albums = await api.getPopularAlbums();
      dispatch(receiveAlbumsActionCreator(albums));
    } catch (error) {
      alert(error.message);
    }
  };
}

function asyncGetLikedAlbums() {
  return async (dispatch) => {
    dispatch(clearAlbumsActionCreator());
    try {
      const albums = await api.getLikedAlbums();
      dispatch(receiveAlbumsActionCreator(albums));
    } catch (error) {
      alert(error.message);
    }
  };
}

function asyncGetOwnedAlbums() {
  return async (dispatch) => {
    dispatch(clearAlbumsActionCreator());
    try {
      const albums = await api.getOwnedAlbums();
      dispatch(receiveAlbumsActionCreator(albums));
    } catch (error) {
      alert(error.message);
    }
  };
}

function asyncEditAlbum({ id, name, year }) {
  return async (dispatch) => {
    try {
      await api.editAlbum({ id, name, year });
      dispatch(editAlbumsActionCreator({ id, name, year }));
    } catch (error) {
      alert(error.message);
    }
  };
}

function asyncChangeCoverAlbums(id, file) {
  return async (dispatch) => {
    try {
      const { fileLocation } = await api.addAlbumCover(id, file);

      dispatch(changeCoverAlbumsActionCreator(id, fileLocation));
    } catch (error) {
      alert(error.message);
    }
  };
}

export {
  ActionType,
  receiveAlbumsActionCreator,
  editAlbumsActionCreator,
  changeCoverAlbumsActionCreator,
  asyncGetPopularAlbums,
  asyncGetLikedAlbums,
  asyncGetOwnedAlbums,
  asyncEditAlbum,
  asyncChangeCoverAlbums,
};
