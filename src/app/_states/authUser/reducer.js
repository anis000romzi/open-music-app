import { ActionType } from './action';

function authUserReducer(authUser = null, action = {}) {
  switch (action.type) {
    case ActionType.SET_AUTH_USER:
      return action.payload.authUser;
    case ActionType.UNSET_AUTH_USER:
      return null;
    case ActionType.ACTIVATE_AUTH_USER:
      return {
        ...authUser,
        is_active: true,
      };
    case ActionType.CHANGE_EMAIL_AUTH_USER:
      return {
        ...authUser,
        email: action.payload.email,
      };
    case ActionType.EDIT_AUTH_USER:
      return {
        ...authUser,
        fullname: action.payload.fullname,
        username: action.payload.username,
        description: action.payload.description,
      };
    case ActionType.CHANGE_PICTURE_AUTH_USER:
      return {
        ...authUser,
        picture: action.payload.file,
      };
    default:
      return authUser;
  }
}

export default authUserReducer;
