import api from '@/app/_utils/api';

const ActionType = {
  RECEIVE_PLAYLIST_DETAIL: 'RECEIVE_PLAYLIST_DETAIL',
  CLEAR_PLAYLIST_DETAIL: 'CLEAR_PLAYLIST_DETAIL',
  EDIT_PLAYLIST_DETAIL: 'EDIT_PLAYLIST_DETAIL',
  CHANGE_PLAYLIST_DETAIL_COVER: 'CHANGE_PLAYLIST_DETAIL_COVER',
  LIKE_PLAYLIST_DETAIL_SONG: 'LIKE_PLAYLIST_DETAIL_SONG',
  DELETE_PLAYLIST_DETAIL_LIKE_SONG: 'DELETE_PLAYLIST_DETAIL_LIKE_SONG',
  ADD_PLAYLIST_COLLABORATOR: 'ADD_PLAYLIST_COLLABORATOR',
  DELETE_PLAYLIST_COLLABORATOR: 'DELETE_PLAYLIST_COLLABORATOR',
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

function changeCoverPlaylistDetailActionCreator(file) {
  return {
    type: ActionType.CHANGE_PLAYLIST_DETAIL_COVER,
    payload: {
      file,
    },
  };
}

function likePlaylistDetailSongActionCreator(songId, userId) {
  return {
    type: ActionType.LIKE_PLAYLIST_DETAIL_SONG,
    payload: {
      songId,
      userId,
    },
  };
}

function deletePlaylistDetailLikeSongActionCreator(songId, userId) {
  return {
    type: ActionType.DELETE_PLAYLIST_DETAIL_LIKE_SONG,
    payload: {
      songId,
      userId,
    },
  };
}

function editPlaylistDetailActionCreator(name, isPublic) {
  return {
    type: ActionType.EDIT_PLAYLIST_DETAIL,
    payload: {
      name,
      isPublic
    },
  };
}

function addPlaylistCollaboratorActionCreator(userId, userName) {
  return {
    type: ActionType.ADD_PLAYLIST_COLLABORATOR,
    payload: {
      userId,
      userName,
    },
  };
}

function deletePlaylistCollaboratorActionCreator(userId) {
  return {
    type: ActionType.DELETE_PLAYLIST_COLLABORATOR,
    payload: {
      userId,
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

function asyncEditPlaylistDetail({ playlistId, name, isPublic }) {
  return async (dispatch) => {
    try {
      await api.editPlaylist({ id: playlistId, name, isPublic });
      dispatch(editPlaylistDetailActionCreator(name, isPublic));
    } catch (error) {
      alert(error.message);
    }
  };
}

function asyncChangeCoverPlaylistDetail(id, file) {
  return async (dispatch) => {
    try {
      const { fileLocation } = await api.addPlaylistCover(id, file);

      dispatch(changeCoverPlaylistDetailActionCreator(fileLocation));
    } catch (error) {
      alert(error.message);
    }
  };
}

function asyncPlaylistDetailLikeSong(songId) {
  return async (dispatch, getState) => {
    const { authUser } = getState();
    dispatch(likePlaylistDetailSongActionCreator(songId, authUser.id));
    try {
      await api.likeSong(songId);
    } catch (error) {
      alert(error.message);
      dispatch(deletePlaylistDetailLikeSongActionCreator(songId, authUser.id));
    }
  };
}

function asyncDeletePlaylistDetailLikeSong(songId) {
  return async (dispatch, getState) => {
    const { authUser } = getState();
    dispatch(deletePlaylistDetailLikeSongActionCreator(songId, authUser.id));
    try {
      await api.deleteLikeSong(songId);
    } catch (error) {
      alert(error.message);
      dispatch(likePlaylistDetailSongActionCreator(songId, authUser.id));
    }
  };
}

function asyncAddPlaylistCollaborator({ playlistId, userId, userName }) {
  return async (dispatch) => {
    dispatch(addPlaylistCollaboratorActionCreator(userId, userName));
    try {
      await api.addPlaylistCollaborator(playlistId, userId);
    } catch (error) {
      alert(error.message);
    }
  };
}

function asyncDeletePlaylistCollaborator(playlistId, userId) {
  return async (dispatch) => {
    dispatch(deletePlaylistCollaboratorActionCreator(userId));
    try {
      await api.deletePlaylistCollaborator(playlistId, userId);
    } catch (error) {
      alert(error.message);
    }
  };
}

export {
  ActionType,
  receivePlaylistDetailActionCreator,
  clearPlaylistDetailActionCreator,
  editPlaylistDetailActionCreator,
  changeCoverPlaylistDetailActionCreator,
  addPlaylistCollaboratorActionCreator,
  deletePlaylistCollaboratorActionCreator,
  asyncReceivePlaylistDetail,
  asyncEditPlaylistDetail,
  asyncChangeCoverPlaylistDetail,
  asyncPlaylistDetailLikeSong,
  asyncDeletePlaylistDetailLikeSong,
  asyncAddPlaylistCollaborator,
  asyncDeletePlaylistCollaborator,
};
