import { toast } from 'react-toastify';
import api from '@/app/_utils/api';

const ActionType = {
  RECEIVE_PLAYLISTS: 'RECEIVE_PLAYLISTS',
  CLEAR_PLAYLISTS: 'CLEAR_PLAYLISTS',
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

function clearPlaylistsActionCreator() {
  return {
    type: ActionType.CLEAR_PLAYLISTS,
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
    dispatch(clearPlaylistsActionCreator());
    try {
      const playlists = await api.getPlaylists();
      dispatch(receivePlaylistsActionCreator(playlists));
    } catch (error) {
      toast.error(error.message);
    }
  };
}

function asyncSearchPlaylists(name) {
  return async (dispatch) => {
    try {
      const playlists = await api.searchPlaylists(name);
      dispatch(receivePlaylistsActionCreator(playlists));
    } catch (error) {
      toast.error(error.message);
    }
  };
}

function asyncGetPopularPlaylists() {
  return async (dispatch) => {
    dispatch(clearPlaylistsActionCreator());
    try {
      const playlists = await api.getPopularPlaylists();
      dispatch(receivePlaylistsActionCreator(playlists));
    } catch (error) {
      toast.error(error.message);
    }
  };
}

function asyncAddPlaylist(name, isPublic) {
  return async (dispatch) => {
    try {
      await api.createPlaylist(name, isPublic);
      const playlists = await api.getPlaylists();
      dispatch(receivePlaylistsActionCreator(playlists));
    } catch (error) {
      toast.error(error.message);
    }
  };
}

function asyncDeletePlaylist(playlistId) {
  return async (dispatch) => {
    try {
      await api.deletePlaylist(playlistId);
      dispatch(deletePlaylistActionCreator(playlistId));
    } catch (error) {
      toast.error(error.message);
    }
  };
}

function asyncAddSongToPlaylist(playlistId, songId) {
  return async (dispatch) => {
    dispatch(addSongToPlaylistActionCreator(playlistId, songId));
    try {
      await api.addSongToPlaylist(playlistId, songId);
    } catch (error) {
      toast.error(error.message);
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
      toast.error(error.message);
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
  asyncSearchPlaylists,
  asyncGetPopularPlaylists,
  asyncAddPlaylist,
  asyncDeletePlaylist,
  asyncAddSongToPlaylist,
  asyncDeleteSongFromPlaylist,
};
