import api from '@/app/_utils/api';

const ActionType = {
  RECEIVE_SONGS: 'RECEIVE_SONGS',
};

function receiveSongsActionCreator(songs) {
  return {
    type: ActionType.RECEIVE_SONGS,
    payload: {
      songs,
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

export { ActionType, receiveSongsActionCreator, asyncGetSongs };
