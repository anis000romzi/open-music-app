import { ActionType } from './action';

function usersReducer(users = [], action = {}) {
  switch (action.type) {
    case ActionType.RECEIVE_USERS:
      return action.payload.users;
    case ActionType.CLEAR_USERS:
        return [];
    default:
      return users;
  }
}

export default usersReducer;
