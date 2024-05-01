import api from '@/app/_utils/api';

const ActionType = {
  RECEIVE_ALBUM_DETAIL: 'RECEIVE_ALBUM_DETAIL',
  CLEAR_ALBUM_DETAIL: 'CLEAR_ALBUM_DETAIL',
  LIKE_ALBUM_DETAIL: 'LIKE_ALBUM_DETAIL',
  DELETE_LIKE_ALBUM_DETAIL: 'DELETE_LIKE_ALBUM_DETAIL',
  LIKE_ALBUM_DETAIL_SONG: 'LIKE_ALBUM_DETAIL_SONG',
  DELETE_ALBUM_DETAIL_LIKE_SONG: 'DELETE_ALBUM_DETAIL_LIKE_SONG',
  DELETE_SONG_FROM_ALBUM: 'DELETE_SONG_FROM_ALBUM',
  ADD_SONGS_TO_ALBUM: 'ADD_SONGS_TO_ALBUM',
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

function likeAlbumDetailActionCreator(userId) {
  return {
    type: ActionType.LIKE_ALBUM_DETAIL,
    payload: {
      userId,
    },
  };
}

function deleteLikeAlbumDetailActionCreator(userId) {
  return {
    type: ActionType.DELETE_LIKE_ALBUM_DETAIL,
    payload: {
      userId,
    },
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

function deleteSongFromAlbumActionCreator(songId) {
  return {
    type: ActionType.DELETE_SONG_FROM_ALBUM,
    payload: {
      songId,
    },
  };
}

function addSongsToAlbumActionCreator(songs) {
  return {
    type: ActionType.ADD_SONGS_TO_ALBUM,
    payload: {
      songs,
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

function asyncLikeAlbumDetail(albumId) {
  return async (dispatch, getState) => {
    const { authUser } = getState();
    dispatch(likeAlbumDetailActionCreator(authUser.id));
    try {
      await api.likeAlbum(albumId);
    } catch (error) {
      alert(error.message);
      dispatch(deleteLikeAlbumDetailActionCreator(authUser.id));
    }
  };
}

function asyncDeleteLikeAlbumDetail(albumId) {
  return async (dispatch, getState) => {
    const { authUser } = getState();
    dispatch(deleteLikeAlbumDetailActionCreator(authUser.id));
    try {
      await api.deleteLikeAlbum(albumId);
    } catch (error) {
      alert(error.message);
      dispatch(likeAlbumDetailActionCreator(authUser.id));
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

function asyncDeleteSongFromAlbum(songId) {
  return async (dispatch, getState) => {
    const { albumDetail } = getState();
    const song = albumDetail.songs.filter((song) => song.id === songId);
    try {
      const { id, title, year, genre_id, duration } = song[0];
      await api.editSong({
        id,
        title,
        year,
        genre: genre_id,
        duration,
        albumId: null,
      });
      dispatch(deleteSongFromAlbumActionCreator(songId));
    } catch (error) {
      alert(error.message);
    }
  };
}

function asyncAddSongsToAlbum(songs) {
  return async (dispatch, getState) => {
    const { albumDetail } = getState();
    try {
      await Promise.all(
        songs.map(async (song) => {
          const { id, title, year, genre_id, duration } = song;
          await api.editSong({
            id,
            title,
            year,
            genre: genre_id,
            duration,
            albumId: albumDetail.id,
          });
        })
      );
      dispatch(addSongsToAlbumActionCreator(songs));
    } catch (error) {
      alert(error.message);
    }
  };
}

export {
  ActionType,
  receiveAlbumDetailActionCreator,
  clearAlbumDetailActionCreator,
  likeAlbumDetailActionCreator,
  deleteLikeAlbumDetailActionCreator,
  asyncReceiveAlbumDetail,
  asyncLikeAlbumDetail,
  asyncDeleteLikeAlbumDetail,
  asyncAlbumDetailLikeSong,
  asyncDeleteAlbumDetailLikeSong,
  asyncDeleteSongFromAlbum,
  asyncAddSongsToAlbum,
};
