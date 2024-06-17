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
    case ActionType.LIKE_USER_DETAIL_SINGLES:
      return {
        ...userDetail,
        singles: userDetail.singles.map((song) => {
          if (song.id === action.payload.songId) {
            return {
              ...song,
              likes: song.likes.concat([action.payload.userId]),
            };
          }
          return song;
        }),
      };
    case ActionType.DELETE_LIKE_USER_DETAIL_SINGLES:
      return {
        ...userDetail,
        singles: userDetail.singles.map((song) => {
          if (song.id === action.payload.songId) {
            return {
              ...song,
              likes: song.likes.filter((id) => id !== action.payload.userId),
            };
          }
          return song;
        }),
      };
    default:
      return userDetail;
  }
}

export default userDetailReducer;
