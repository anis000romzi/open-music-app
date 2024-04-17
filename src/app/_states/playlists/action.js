import api from '@/app/_utils/api';

const ActionType = {
  RECEIVE_PLAYLISTS: 'RECEIVE_PLAYLISTS',
  ADD_PLAYLIST: 'ADD_PLAYLIST',
  DELETE_PLAYLIST: 'DELETE_PLAYLIST',
  ADD_SONG_TO_PLAYLIST: 'ADD_SONG_TO_PLAYLIST',
  DELETE_SONG_FROM_PLAYLIST: 'DELETE_SONG_FROM_PLAYLIST',
};

function receivePlaylistsActionCreator(playlists) {
  return {
    type: ActionType.RECEIVE_PLAYLISTS,
    payload: {
      playlists,
    },
  };
}

function addPlaylistActionCreator(playlist) {
  return {
    type: ActionType.ADD_PLAYLIST,
    payload: {
      playlist,
    },
  };
}

function deletePlaylistActionCreator(playlistId) {
  return {
    type: ActionType.DELETE_PLAYLIST,
    payload: {
      playlistId,
    },
  };
}

function addSongToPlaylistActionCreator(playlistId, songId) {
  return {
    type: ActionType.ADD_SONG_TO_PLAYLIST,
    payload: {
      playlistId,
      songId,
    },
  };
}

function deleteSongFromPlaylistActionCreator(playlistId, songId) {
  return {
    type: ActionType.DELETE_SONG_FROM_PLAYLIST,
    payload: {
      playlistId,
      songId,
    },
  };
}

function asyncGetPlaylists() {
  return async (dispatch) => {
    try {
      const playlists = await api.getPlaylists();
      dispatch(receivePlaylistsActionCreator(playlists));
    } catch (error) {
      console.log(error)
      alert(error.message);
    }
  };
}

function asyncAddPlaylist(name) {
  return async (dispatch) => {
    try {
      await api.createPlaylist(name);
      const playlists = await api.getPlaylists();
      dispatch(receivePlaylistsActionCreator(playlists));
    } catch (error) {
      alert(error.message);
    }
  };
}

function asyncDeletePlaylist(playlistId) {
  return async (dispatch) => {
    try {
      await api.deletePlaylist(playlistId)
      dispatch(deletePlaylistActionCreator(playlistId));
    } catch (error) {
      alert(error.message);
    }
  };
}

function asyncAddSongToPlaylist(playlistId, songId) {
  return async (dispatch) => {
    dispatch(addSongToPlaylistActionCreator(playlistId, songId));
    try {
      await api.addSongToPlaylist(playlistId, songId);
    } catch (error) {
      alert(error.message);
      dispatch(deleteSongFromPlaylistActionCreator(playlistId, songId));
    }
  };
}

function asyncDeleteSongFromPlaylist(playlistId, songId) {
  return async (dispatch) => {
    dispatch(deleteSongFromPlaylistActionCreator(playlistId, songId));
    try {
      await api.deleteSongFromPlaylist(playlistId, songId);
    } catch (error) {
      alert(error.message);
      dispatch(addSongToPlaylistActionCreator(playlistId, songId));
    }
  };
}

export {
  ActionType,
  receivePlaylistsActionCreator,
  deletePlaylistActionCreator,
  addSongToPlaylistActionCreator,
  deleteSongFromPlaylistActionCreator,
  asyncGetPlaylists,
  asyncAddPlaylist,
  asyncDeletePlaylist,
  asyncAddSongToPlaylist,
  asyncDeleteSongFromPlaylist,
};
