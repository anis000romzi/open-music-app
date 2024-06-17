import api from '@/app/_utils/api';

const ActionType = {
  RECEIVE_USER_DETAIL: 'RECEIVE_USER_DETAIL',
  CLEAR_USER_DETAIL: 'CLEAR_USER_DETAIL',
  FOLLOW_USER_DETAIL: 'FOLLOW_USER_DETAIL',
  UNFOLLOW_USER_DETAIL: 'UNFOLLOW_USER_DETAIL',
  LIKE_USER_DETAIL_SINGLES: 'LIKE_USER_DETAIL_SINGLES',
  DELETE_LIKE_USER_DETAIL_SINGLES: 'DELETE_LIKE_USER_DETAIL_SINGLES'
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

function likeUserDetailSingleActionCreator(songId, userId) {
  return {
    type: ActionType.LIKE_USER_DETAIL_SINGLES,
    payload: {
      songId,
      userId,
    },
  };
}

function deleteUserDetailLikeSingleActionCreator(songId, userId) {
  return {
    type: ActionType.DELETE_LIKE_USER_DETAIL_SINGLES,
    payload: {
      songId,
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

function asyncUserDetailLikeSingle(songId) {
  return async (dispatch, getState) => {
    const { authUser } = getState();
    dispatch(likeUserDetailSingleActionCreator(songId, authUser.id));
    try {
      await api.likeSong(songId);
    } catch (error) {
      alert(error.message);
      dispatch(deleteUserDetailLikeSingleActionCreator(songId, authUser.id));
    }
  };
}

function asyncDeleteUserDetailLikeSingle(songId) {
  return async (dispatch, getState) => {
    const { authUser } = getState();
    dispatch(deleteUserDetailLikeSingleActionCreator(songId, authUser.id));
    try {
      await api.deleteLikeSong(songId);
    } catch (error) {
      alert(error.message);
      dispatch(likeUserDetailSingleActionCreator(songId, authUser.id));
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
  asyncUserDetailLikeSingle,
  asyncDeleteUserDetailLikeSingle,
};
