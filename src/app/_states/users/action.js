import api from '@/app/_utils/api';

const ActionType = {
  RECEIVE_USERS: 'RECEIVE_USERS',
};

function receiveUsersActionCreator(users) {
  return {
    type: ActionType.RECEIVE_USERS,
    payload: {
      users,
    },
  };
}

function asyncGetPopularArtists() {
  return async (dispatch) => {
    try {
      const artists = await api.getPopularArtists();
      dispatch(receiveUsersActionCreator(artists));
    } catch (error) {
      alert(error.message);
    }
  };
}

function asyncRegisterUser({ email, username, fullname, password }) {
  return async () => {
    try {
      await api.register({ email, username, fullname, password });
    } catch (error) {
      alert(error.message);
    }
  };
}

export {
  ActionType,
  receiveUsersActionCreator,
  asyncGetPopularArtists,
  asyncRegisterUser,
};
