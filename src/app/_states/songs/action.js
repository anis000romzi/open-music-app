import api from '@/app/_utils/api';

const ActionType = {
  RECEIVE_SONGS: 'RECEIVE_SONGS',
  LIKE_SONG: 'LIKE_SONG',
  DELETE_LIKE_SONG: 'DELETE_LIKE_SONG',
};

function receiveSongsActionCreator(songs) {
  return {
    type: ActionType.RECEIVE_SONGS,
    payload: {
      songs,
    },
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

function asyncGetSongs(title) {
  return async (dispatch) => {
    try {
      const songs = await api.getSongs(title);
      dispatch(receiveSongsActionCreator(songs));
    } catch (error) {
      alert(error.message);
    }
  };
}

function asyncGetLikedSongs() {
  return async (dispatch) => {
    try {
      const songs = await api.getLikedSongs();
      dispatch(receiveSongsActionCreator(songs));
    } catch (error) {
      alert(error.message);
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
      alert(error.message);
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
      alert(error.message);
      dispatch(likeSongActionCreator(songId, authUser.id));
    }
  };
}

export {
  ActionType,
  receiveSongsActionCreator,
  asyncGetSongs,
  asyncGetLikedSongs,
  asyncLikeSong,
  asyncDeleteLikeSong,
};
