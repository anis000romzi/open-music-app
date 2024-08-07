import { toast } from 'react-toastify';
import api from '@/app/_utils/api';

const ActionType = {
  RECEIVE_SONGS: 'RECEIVE_SONGS',
  CLEAR_SONGS: 'CLEAR_SONGS',
  LIKE_SONG: 'LIKE_SONG',
  DELETE_LIKE_SONG: 'DELETE_LIKE_SONG',
  EDIT_SONGS: 'EDIT_SONGS',
  DELETE_SONGS: 'DELETE_SONGS',
  CHANGE_COVER_SONGS: 'CHANGE_COVER_SONGS',
};

function receiveSongsActionCreator(songs) {
  return {
    type: ActionType.RECEIVE_SONGS,
    payload: {
      songs,
    },
  };
}

function clearSongsActionCreator(songs) {
  return {
    type: ActionType.CLEAR_SONGS,
  };
}

function likeSongActionCreator(songId, userId) {
  return {
    type: ActionType.LIKE_SONG,
    payload: {
      songId,
      userId,
    },
  };
}

function deleteLikeSongActionCreator(songId, userId) {
  return {
    type: ActionType.DELETE_LIKE_SONG,
    payload: {
      songId,
      userId,
    },
  };
}

function editSongsActionCreator({
  id,
  title,
  year,
  genre,
  genre_id,
  duration,
  album,
  album_id,
}) {
  return {
    type: ActionType.EDIT_SONGS,
    payload: {
      id,
      title,
      year,
      genre,
      genre_id,
      duration,
      album,
      album_id,
    },
  };
}

function deleteSongsActionCreator(id) {
  return {
    type: ActionType.DELETE_SONGS,
    payload: {
      id,
    },
  };
}

function changeCoverSongsActionCreator(songId, file) {
  return {
    type: ActionType.CHANGE_COVER_SONGS,
    payload: {
      songId,
      file,
    },
  };
}

function asyncGetSongs(title) {
  return async (dispatch) => {
    dispatch(clearSongsActionCreator());
    try {
      const songs = await api.getSongs(title);
      dispatch(receiveSongsActionCreator(songs));
    } catch (error) {
      toast.error(error.message);
    }
  };
}

function asyncGetPopularSongs() {
  return async (dispatch) => {
    dispatch(clearSongsActionCreator());
    try {
      const songs = await api.getPopularSongs();
      dispatch(receiveSongsActionCreator(songs));
    } catch (error) {
      toast.error(error.message);
    }
  };
}

function asyncGetSongsByGenre(genre) {
  return async (dispatch) => {
    dispatch(clearSongsActionCreator());
    try {
      const songs = await api.getSongsByGenre(genre);
      dispatch(receiveSongsActionCreator(songs));
    } catch (error) {
      toast.error(error.message);
    }
  };
}

function asyncGetLikedSongs() {
  return async (dispatch) => {
    dispatch(clearSongsActionCreator());
    try {
      const songs = await api.getLikedSongs();
      dispatch(receiveSongsActionCreator(songs));
    } catch (error) {
      toast.error(error.message);
    }
  };
}

function asyncGetOwnedSongs() {
  return async (dispatch) => {
    dispatch(clearSongsActionCreator());
    try {
      const songs = await api.getOwnedSongs();
      dispatch(receiveSongsActionCreator(songs));
    } catch (error) {
      toast.error(error.message);
    }
  };
}

function asyncLikeSong(songId) {
  return async (dispatch, getState) => {
    const { authUser } = getState();
    dispatch(likeSongActionCreator(songId, authUser.id));
    try {
      await api.likeSong(songId);
    } catch (error) {
      toast.error(error.message);
      dispatch(deleteLikeSongActionCreator(songId, authUser.id));
    }
  };
}

function asyncDeleteLikeSong(songId) {
  return async (dispatch, getState) => {
    const { authUser } = getState();
    dispatch(deleteLikeSongActionCreator(songId, authUser.id));
    try {
      await api.deleteLikeSong(songId);
    } catch (error) {
      toast.error(error.message);
      dispatch(likeSongActionCreator(songId, authUser.id));
    }
  };
}

function asyncEditSong({
  id,
  title,
  year,
  genre,
  genre_id,
  duration,
  album,
  album_id,
}) {
  return async (dispatch) => {
    try {
      await api.editSong({
        id,
        title,
        year,
        genre: genre_id,
        duration,
        albumId: album_id,
      });
      dispatch(
        editSongsActionCreator({
          id,
          title,
          year,
          genre,
          genre_id,
          duration,
          album,
          album_id,
        })
      );
    } catch (error) {
      toast.error(error.message);
    }
  };
}

function asyncDeleteSong(id) {
  return async (dispatch) => {
    try {
      await api.deleteSong(id);
      dispatch(deleteSongsActionCreator(id));
    } catch (error) {
      toast.error(error.message);
    }
  };
}

function asyncChangeCoverSongs(id, file) {
  return async (dispatch) => {
    try {
      const { fileLocation } = await api.addSongCover(id, file);

      dispatch(changeCoverSongsActionCreator(id, fileLocation));
    } catch (error) {
      toast.error(error.message);
    }
  };
}

export {
  ActionType,
  receiveSongsActionCreator,
  editSongsActionCreator,
  deleteSongsActionCreator,
  changeCoverSongsActionCreator,
  asyncGetSongs,
  asyncGetPopularSongs,
  asyncGetSongsByGenre,
  asyncGetLikedSongs,
  asyncGetOwnedSongs,
  asyncLikeSong,
  asyncDeleteLikeSong,
  asyncEditSong,
  asyncDeleteSong,
  asyncChangeCoverSongs,
};
