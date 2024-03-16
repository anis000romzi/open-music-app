import api from '@/app/_utils/api';

const ActionType = {
  RECEIVE_USER_DETAIL: 'RECEIVE_USER_DETAIL',
  CLEAR_USER_DETAIL: 'CLEAR_USER_DETAIL',
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

export {
  ActionType,
  receiveUserDetailActionCreator,
  clearUserDetailActionCreator,
  asyncReceiveUserDetail,
};
