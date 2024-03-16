const api = (() => {
  const BASE_URL = 'http://localhost:5000';
  let accessToken = null;

  function putRefreshToken(token) {
    localStorage.setItem('refresh-token', token);
  }

  function getRefreshToken() {
    return localStorage.getItem('refresh-token');
  }

  async function _fetchWithAuth(url, options = {}) {
    return fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${accessToken}`,
      },
    });
  }

  async function generateAccessToken(refreshToken) {
    const response = await fetch(`${BASE_URL}/authentications`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        refreshToken,
      }),
    });

    const responseJson = await response.json();
    const { status, message } = responseJson;

    if (status !== 'success') {
      throw new Error(message);
    }

    const {
      data: { accessToken: token },
    } = responseJson;

    accessToken = token;

    return token;
  }

  async function register({ email, username, fullname, password }) {
    const response = await fetch(`${BASE_URL}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        username,
        fullname,
        password,
      }),
    });

    const responseJson = await response.json();
    const { status, message } = responseJson;

    if (status !== 'success') {
      throw new Error(message);
    }

    const {
      data: { userId },
    } = responseJson;

    return userId;
  }

  async function sendActivationCode(userId) {
    const response = await fetch(`${BASE_URL}/authentications/verifications`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
      }),
    });

    const responseJson = await response.json();
    const { status, message } = responseJson;

    if (status !== 'success') {
      throw new Error(message);
    }

    return message;
  }

  async function activateUser(userId, otp) {
    const response = await fetch(`${BASE_URL}/users/${userId}/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        otp,
      }),
    });

    const responseJson = await response.json();
    const { status, message } = responseJson;

    if (status !== 'success') {
      throw new Error(message);
    }

    return message;
  }

  async function login({ usernameOrEmail, password }) {
    const response = await fetch(`${BASE_URL}/authentications`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        usernameOrEmail,
        password,
      }),
    });

    const responseJson = await response.json();
    const { status, message } = responseJson;

    if (status !== 'success') {
      throw new Error(message);
    }

    const {
      data: { accessToken: token, refreshToken },
    } = responseJson;

    accessToken = token;

    return { token, refreshToken };
  }

  async function logout(refreshToken) {
    const response = await fetch(`${BASE_URL}/authentications`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        refreshToken,
      }),
    });

    const responseJson = await response.json();
    const { status, message } = responseJson;

    if (status !== 'success') {
      throw new Error(message);
    }
  }

  async function requestResetPassword(email) {
    const response = await fetch(`${BASE_URL}/authentications/forgotpassword`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
      }),
    });

    const responseJson = await response.json();
    const { status, message } = responseJson;

    if (status !== 'success') {
      throw new Error(message);
    }

    return responseJson.data.userId;
  }

  async function resetPassword({ userId, password, otp }) {
    const response = await fetch(`${BASE_URL}/users/${userId}/resetpassword`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        otp,
        password,
      }),
    });

    const responseJson = await response.json();
    const { status, message } = responseJson;

    if (status !== 'success') {
      throw new Error(message);
    }
  }

  // only change email when user is not active
  async function changeEmail(userId, email) {
    const response = await fetch(`${BASE_URL}/users/${userId}/editemail`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
      }),
    });

    const responseJson = await response.json();
    const { status, message } = responseJson;

    if (status !== 'success') {
      throw new Error(message);
    }
  }

  async function getOwnProfile() {
    const response = await _fetchWithAuth(`${BASE_URL}/users/me`);

    const responseJson = await response.json();
    const { status, message } = responseJson;

    if (status !== 'success') {
      throw new Error(message);
    }

    const {
      data: { users },
    } = responseJson;

    return users;
  }

  async function getPopularAlbums() {
    const response = await fetch(`${BASE_URL}/albums/popular`);

    const responseJson = await response.json();
    const { status, message } = responseJson;

    if (status !== 'success') {
      throw new Error(message);
    }

    const {
      data: { albums },
    } = responseJson;

    return albums;
  }

  async function getAlbumById(albumId) {
    const response = await fetch(`${BASE_URL}/albums/${albumId}`);

    const responseJson = await response.json();
    const { status, message } = responseJson;

    if (status !== 'success') {
      throw new Error(message);
    }

    const {
      data: { album },
    } = responseJson;

    return album;
  }

  async function getUserById(id) {
    const response = await fetch(`${BASE_URL}/users/${id}`);

    const responseJson = await response.json();
    const { status, message } = responseJson;

    if (status !== 'success') {
      throw new Error(message);
    }

    const { data } = responseJson;

    return data;
  }

  return {
    putRefreshToken,
    getRefreshToken,
    generateAccessToken,
    register,
    sendActivationCode,
    activateUser,
    login,
    logout,
    requestResetPassword,
    resetPassword,
    changeEmail,
    getOwnProfile,
    getPopularAlbums,
    getAlbumById,
    getUserById,
  };
})();

export default api;
