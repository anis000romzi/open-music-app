import { ActionType } from './action';

function userDetailReducer(userDetail = null, action = {}) {
  switch (action.type) {
    case ActionType.RECEIVE_USER_DETAIL:
      return action.payload.userDetail;
    case ActionType.CLEAR_USER_DETAIL:
      return null;
    default:
      return userDetail;
  }
}

export default userDetailReducer;
