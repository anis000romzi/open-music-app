import api from '@/app/_utils/api';

const ActionType = {
  RECEIVE_USER_DETAIL: 'RECEIVE_USER_DETAIL',
  CLEAR_USER_DETAIL: 'CLEAR_USER_DETAIL',
  FOLLOW_USER_DETAIL: 'FOLLOW_USER_DETAIL',
  UNFOLLOW_USER_DETAIL: 'UNFOLLOW_USER_DETAIL',
};

function receiveUserDetailActionCreator(userDetail) {
  return {
    type: ActionType.RECEIVE_USER_DETAIL,
    payload: {
      userDetail,
    },
  };
}

function clearUserDetailActionCreator() {
  return {
    type: ActionType.CLEAR_USER_DETAIL,
  };
}

function followUserDetailActionCreator(userId) {
  return {
    type: ActionType.FOLLOW_USER_DETAIL,
    payload: {
      userId,
    },
  };
}

function unfollowUserDetailActionCreator(userId) {
  return {
    type: ActionType.UNFOLLOW_USER_DETAIL,
    payload: {
      userId,
    },
  };
}

function asyncReceiveUserDetail(userId) {
  return async (dispatch) => {
    dispatch(clearUserDetailActionCreator());
    try {
      const userDetail = await api.getUserById(userId);
      dispatch(receiveUserDetailActionCreator(userDetail));
    } catch (error) {
      alert(error.message);
    }
  };
}

function asyncFollowUserDetail(userId) {
  return async (dispatch, getState) => {
    const { authUser } = getState();
    dispatch(followUserDetailActionCreator(authUser.id));
    try {
      await api.followUser(userId);
    } catch (error) {
      alert(error.message);
      dispatch(unfollowUserDetailActionCreator(authUser.id));
    }
  };
}

function asyncUnfollowUserDetail(userId) {
  return async (dispatch, getState) => {
    const { authUser } = getState();
    dispatch(unfollowUserDetailActionCreator(authUser.id));
    try {
      await api.unfollowUser(userId);
    } catch (error) {
      alert(error.message);
      dispatch(followUserDetailActionCreator(authUser.id));
    }
  };
}

export {
  ActionType,
  receiveUserDetailActionCreator,
  clearUserDetailActionCreator,
  followUserDetailActionCreator,
  unfollowUserDetailActionCreator,
  asyncReceiveUserDetail,
  asyncFollowUserDetail,
  asyncUnfollowUserDetail,
};
