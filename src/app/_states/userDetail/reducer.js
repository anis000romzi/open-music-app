import { ActionType } from './action';

function userDetailReducer(userDetail = null, action = {}) {
  switch (action.type) {
    case ActionType.RECEIVE_USER_DETAIL:
      return action.payload.userDetail;
    case ActionType.CLEAR_USER_DETAIL:
      return null;
    case ActionType.FOLLOW_USER_DETAIL:
      return {
        ...userDetail,
        followers: userDetail.followers.concat([action.payload.userId]),
      };
    case ActionType.UNFOLLOW_USER_DETAIL:
      return {
        ...userDetail,
        followers: userDetail.followers.filter(
          (id) => id !== action.payload.userId
        ),
      };
    default:
      return userDetail;
  }
}

export default userDetailReducer;
