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
    default:
      return authUser;
  }
}

export default authUserReducer;
