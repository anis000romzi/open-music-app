import api from '@/app/_utils/api';

const ActionType = {
  SET_AUTH_USER: 'SET_AUTH_USER',
  UNSET_AUTH_USER: 'UNSET_AUTH_USER',
  ACTIVATE_AUTH_USER: 'ACTIVATE_AUTH_USER',
  CHANGE_EMAIL_AUTH_USER: 'CHANGE_EMAIL_AUTH_USER',
  EDIT_AUTH_USER: 'EDIT_AUTH_USER',
  CHANGE_PICTURE_AUTH_USER: 'CHANGE_PICTURE_AUTH_USER',
};

function setAuthUserActionCreator(authUser) {
  return {
    type: ActionType.SET_AUTH_USER,
    payload: {
      authUser,
    },
  };
}

function unsetAuthUserActionCreator() {
  return {
    type: ActionType.UNSET_AUTH_USER,
    payload: {
      authUser: null,
    },
  };
}

function activateAuthUserActionCreator(userId) {
  return {
    type: ActionType.ACTIVATE_AUTH_USER,
    payload: {
      userId,
    },
  };
}

function changeEmailAuthUserActionCreator(email) {
  return {
    type: ActionType.CHANGE_EMAIL_AUTH_USER,
    payload: {
      email,
    },
  };
}

function editAuthUserActionCreator(fullname, description) {
  return {
    type: ActionType.EDIT_AUTH_USER,
    payload: {
      fullname,
      description,
    },
  };
}

function changePictureAuthUserActionCreator(file) {
  return {
    type: ActionType.CHANGE_PICTURE_AUTH_USER,
    payload: {
      file,
    },
  };
}

function asyncSetAuthUser({ usernameOrEmail, password }) {
  return async (dispatch) => {
    try {
      const { refreshToken } = await api.login({ usernameOrEmail, password });
      api.putRefreshToken(refreshToken);
      const authUser = await api.getOwnProfile();

      dispatch(setAuthUserActionCreator(authUser));
    } catch (error) {
      alert(error.message);
    }
  };
}

function asyncUnsetAuthUser() {
  return async (dispatch) => {
    try {
      const refreshToken = api.getRefreshToken();
      api.logout(refreshToken);

      dispatch(unsetAuthUserActionCreator());
      api.putRefreshToken('');
    } catch (error) {
      alert(error.message);
    }
  };
}

function asyncActivateUser(userId, otp) {
  return async (dispatch) => {
    try {
      const message = await api.activateUser(userId, otp);
      alert(message);

      dispatch(activateAuthUserActionCreator(userId));
    } catch (error) {
      alert(error.message);
    }
  };
}

function asyncChangeEmailUser(userId, email) {
  return async (dispatch) => {
    try {
      await api.changeEmail(userId, email);

      dispatch(changeEmailAuthUserActionCreator(email));
    } catch (error) {
      alert(error.message);
    }
  };
}

function asyncEditAuthUser({ id, fullname, description }) {
  return async (dispatch) => {
    try {
      await api.editUser({ id, fullname, description });

      dispatch(editAuthUserActionCreator(fullname, description));
    } catch (error) {
      alert(error.message);
    }
  };
}

function asyncChangePictureAuthUser(id, file) {
  return async (dispatch) => {
    try {
      const { fileLocation } = await api.addUserPicture(id, file);

      dispatch(changePictureAuthUserActionCreator(fileLocation));
    } catch (error) {
      alert(error.message);
    }
  };
}

export {
  ActionType,
  setAuthUserActionCreator,
  unsetAuthUserActionCreator,
  activateAuthUserActionCreator,
  changeEmailAuthUserActionCreator,
  changePictureAuthUserActionCreator,
  asyncSetAuthUser,
  asyncUnsetAuthUser,
  asyncActivateUser,
  asyncChangeEmailUser,
  asyncEditAuthUser,
  asyncChangePictureAuthUser,
};
