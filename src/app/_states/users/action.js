import { toast } from 'react-toastify';
import api from '@/app/_utils/api';

const ActionType = {
  RECEIVE_USERS: 'RECEIVE_USERS',
  CLEAR_USERS: 'CLEAR_USERS',
};

function receiveUsersActionCreator(users) {
  return {
    type: ActionType.RECEIVE_USERS,
    payload: {
      users,
    },
  };
}

function clearUsersActionCreator() {
  return {
    type: ActionType.CLEAR_USERS,
  };
}

function asyncGetUsers(query) {
  return async (dispatch) => {
    try {
      const artists = await api.getUsers(query);
      dispatch(receiveUsersActionCreator(artists));
    } catch (error) {
      toast.error(error.message);
    }
  };
}

function asyncGetPopularArtists() {
  return async (dispatch) => {
    dispatch(clearUsersActionCreator());
    try {
      const artists = await api.getPopularArtists();
      dispatch(receiveUsersActionCreator(artists));
    } catch (error) {
      toast.error(error.message);
    }
  };
}

function asyncGetFollowedArtists() {
  return async (dispatch) => {
    dispatch(clearUsersActionCreator());
    try {
      const artists = await api.getFollowedArtists();
      dispatch(receiveUsersActionCreator(artists));
    } catch (error) {
      toast.error(error.message);
    }
  };
}

function asyncRegisterUser({ email, username, fullname, password }) {
  return async () => {
    try {
      await api.register({ email, username, fullname, password });
    } catch (error) {
      toast.error(error.message);
    }
  };
}

export {
  ActionType,
  receiveUsersActionCreator,
  asyncGetUsers,
  asyncGetPopularArtists,
  asyncGetFollowedArtists,
  asyncRegisterUser,
};
