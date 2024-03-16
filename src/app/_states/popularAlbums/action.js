import api from '@/app/_utils/api';

const ActionType = {
  RECEIVE_POPULAR_ALBUMS: 'RECEIVE_POPULAR_ALBUMS',
};

function receivePopularAlbumsActionCreator(albums) {
  return {
    type: ActionType.RECEIVE_POPULAR_ALBUMS,
    payload: {
      albums,
    },
  };
}

function asyncGetPopularAlbums() {
  return async (dispatch) => {
    try {
      const albums = await api.getPopularAlbums();
      dispatch(receivePopularAlbumsActionCreator(albums));
    } catch (error) {
      alert(error.message);
    }
  };
}

export { ActionType, receivePopularAlbumsActionCreator, asyncGetPopularAlbums };
