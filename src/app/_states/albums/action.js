import { toast } from 'react-toastify';
import api from '@/app/_utils/api';

const ActionType = {
  RECEIVE_ALBUMS: 'RECEIVE_ALBUMS',
  CLEAR_ALBUMS: 'CLEAR_ALBUMS',
  EDIT_ALBUMS: 'EDIT_ALBUMS',
  DELETE_ALBUMS: 'DELETE_ALBUMS',
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

function deleteAlbumsActionCreator(id) {
  return {
    type: ActionType.DELETE_ALBUMS,
    payload: {
      id,
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

function asyncGetAlbums(name) {
  return async (dispatch) => {
    try {
      const albums = await api.getAlbums(name);
      dispatch(receiveAlbumsActionCreator(albums));
    } catch (error) {
      toast.error(error.message);
    }
  };
}

function asyncGetPopularAlbums() {
  return async (dispatch) => {
    dispatch(clearAlbumsActionCreator());
    try {
      const albums = await api.getPopularAlbums();
      dispatch(receiveAlbumsActionCreator(albums));
    } catch (error) {
      toast.error(error.message);
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
      toast.error(error.message);
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
      toast.error(error.message);
    }
  };
}

function asyncEditAlbum({ id, name, year }) {
  return async (dispatch) => {
    try {
      await api.editAlbum({ id, name, year });
      dispatch(editAlbumsActionCreator({ id, name, year }));
    } catch (error) {
      toast.error(error.message);
    }
  };
}

function asyncDeleteAlbum(id) {
  return async (dispatch) => {
    try {
      await api.deleteAlbum(id);
      dispatch(deleteAlbumsActionCreator(id));
    } catch (error) {
      toast.error(error.message);
    }
  };
}

function asyncChangeCoverAlbums(id, file) {
  return async (dispatch) => {
    try {
      const { fileLocation } = await api.addAlbumCover(id, file);

      dispatch(changeCoverAlbumsActionCreator(id, fileLocation));
    } catch (error) {
      toast.error(error.message);
    }
  };
}

export {
  ActionType,
  receiveAlbumsActionCreator,
  editAlbumsActionCreator,
  deleteAlbumsActionCreator,
  changeCoverAlbumsActionCreator,
  asyncGetAlbums,
  asyncGetPopularAlbums,
  asyncGetLikedAlbums,
  asyncGetOwnedAlbums,
  asyncEditAlbum,
  asyncDeleteAlbum,
  asyncChangeCoverAlbums,
};
