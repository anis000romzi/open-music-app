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
    if (accessToken) {
      if (isTokenExpired(accessToken)) {
        await generateAccessToken(getRefreshToken());
      }
    }

    return fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${accessToken}`,
      },
    });
  }

  function isTokenExpired(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );

    const { iat } = JSON.parse(jsonPayload);
    const expired = Math.floor(Date.now() / 1000) - iat;
    return expired > 1800;
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

  async function editUser({ id, fullname, description }) {
    const response = await _fetchWithAuth(`${BASE_URL}/users/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fullname,
        description,
      }),
    });

    const responseJson = await response.json();
    const { status, message } = responseJson;

    if (status !== 'success') {
      throw new Error(message);
    }
  }

  async function addUserPicture(id, file) {
    const formData = new FormData();
    formData.append('picture', file);

    const response = await _fetchWithAuth(`${BASE_URL}/users/${id}/pictures`, {
      method: 'POST',
      body: formData,
    });

    const responseJson = await response.json();
    const { status, message } = responseJson;

    if (status !== 'success') {
      throw new Error(message);
    }

    const { data } = responseJson;

    return data;
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

  async function getPopularArtists() {
    const response = await fetch(`${BASE_URL}/users/popular`);

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

  async function getFollowedArtists() {
    const response = await _fetchWithAuth(`${BASE_URL}/users/followed`);

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

  async function followUser(userId) {
    const response = await _fetchWithAuth(
      `${BASE_URL}/users/${userId}/follow`,
      {
        method: 'POST',
      }
    );

    const responseJson = await response.json();
    const { status, message } = responseJson;

    if (status !== 'success') {
      throw new Error(message);
    }
  }

  async function unfollowUser(userId) {
    const response = await _fetchWithAuth(
      `${BASE_URL}/users/${userId}/follow`,
      {
        method: 'DELETE',
      }
    );

    const responseJson = await response.json();
    const { status, message } = responseJson;

    if (status !== 'success') {
      throw new Error(message);
    }
  }

  async function getGenres() {
    const response = await fetch(`${BASE_URL}/genres`);

    const responseJson = await response.json();
    const { status, message } = responseJson;

    if (status !== 'success') {
      throw new Error(message);
    }

    const {
      data: { genres },
    } = responseJson;

    return genres;
  }

  async function getAlbums(query) {
    const response = await fetch(
      `${BASE_URL}/albums?name=${query}&artist=${query}`
    );

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

  async function getLikedAlbums() {
    const response = await _fetchWithAuth(`${BASE_URL}/albums/liked`);

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

  async function likeAlbum(albumId) {
    const response = await _fetchWithAuth(
      `${BASE_URL}/albums/${albumId}/likes`,
      {
        method: 'POST',
      }
    );

    const responseJson = await response.json();
    const { status, message } = responseJson;

    if (status !== 'success') {
      throw new Error(message);
    }
  }

  async function deleteLikeAlbum(albumId) {
    const response = await _fetchWithAuth(
      `${BASE_URL}/albums/${albumId}/likes`,
      {
        method: 'DELETE',
      }
    );

    const responseJson = await response.json();
    const { status, message } = responseJson;

    if (status !== 'success') {
      throw new Error(message);
    }
  }

  async function getAlbumsByArtist(userId) {
    const response = await fetch(`${BASE_URL}/albums/artist/${userId}`);

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

  async function getOwnedAlbums() {
    const response = await _fetchWithAuth(`${BASE_URL}/albums/me`);

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

  async function getUsers(query) {
    const response = await fetch(
      `${BASE_URL}/users?fullname=${query}&username=${query}`
    );

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

  async function getUserById(id) {
    const response = await fetch(`${BASE_URL}/users/${id}`, {
      cache: 'no-store',
    });

    const responseJson = await response.json();
    const { status, message } = responseJson;

    if (status !== 'success') {
      throw new Error(message);
    }

    const { data } = responseJson;

    return data;
  }

  async function getSongs(query) {
    const response = await fetch(
      `${BASE_URL}/songs?title=${query}&artist=${query}`
    );

    const responseJson = await response.json();
    const { status, message } = responseJson;

    if (status !== 'success') {
      throw new Error(message);
    }

    const {
      data: { songs },
    } = responseJson;

    return songs;
  }

  async function getSongsByGenre(query) {
    const response = await fetch(
      `${BASE_URL}/songs?genre=${query}`
    );

    const responseJson = await response.json();
    const { status, message } = responseJson;

    if (status !== 'success') {
      throw new Error(message);
    }

    const {
      data: { songs },
    } = responseJson;

    return songs;
  }

  async function getLikedSongs(query) {
    const response = await _fetchWithAuth(`${BASE_URL}/songs/liked`);

    const responseJson = await response.json();
    const { status, message } = responseJson;

    if (status !== 'success') {
      throw new Error(message);
    }

    const {
      data: { songs },
    } = responseJson;

    return songs;
  }

  async function getSongById(songId) {
    const response = await fetch(`${BASE_URL}/songs/${songId}`);

    const responseJson = await response.json();
    const { status, message } = responseJson;

    if (status !== 'success') {
      throw new Error(message);
    }

    const {
      data: { song },
    } = responseJson;

    return song;
  }

  async function getOwnedSongs() {
    const response = await _fetchWithAuth(`${BASE_URL}/songs/me`);

    const responseJson = await response.json();
    const { status, message } = responseJson;

    if (status !== 'success') {
      throw new Error(message);
    }

    const {
      data: { songs },
    } = responseJson;

    return songs;
  }

  async function getOwnedSingles() {
    const response = await _fetchWithAuth(`${BASE_URL}/songs/me/singles`);

    const responseJson = await response.json();
    const { status, message } = responseJson;

    if (status !== 'success') {
      throw new Error(message);
    }

    const {
      data: { songs },
    } = responseJson;

    return songs;
  }

  async function likeSong(id) {
    const response = await _fetchWithAuth(`${BASE_URL}/songs/${id}/likes`, {
      method: 'POST',
    });

    const responseJson = await response.json();
    const { status, message } = responseJson;

    if (status !== 'success') {
      throw new Error(message);
    }
  }

  async function deleteLikeSong(id) {
    const response = await _fetchWithAuth(`${BASE_URL}/songs/${id}/likes`, {
      method: 'DELETE',
    });

    const responseJson = await response.json();
    const { status, message } = responseJson;

    if (status !== 'success') {
      throw new Error(message);
    }
  }

  async function addHistory(songId) {
    const response = await _fetchWithAuth(`${BASE_URL}/history`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        songId
      }),
    });

    const responseJson = await response.json();
    const { status, message } = responseJson;

    if (status !== 'success') {
      throw new Error(message);
    }
  }

  async function getHistory() {
    const response = await _fetchWithAuth(`${BASE_URL}/history`);

    const responseJson = await response.json();
    const { status, message } = responseJson;

    if (status !== 'success') {
      throw new Error(message);
    }

    const {
      data: { history },
    } = responseJson;

    return history;
  }

  async function createAlbum(name, year) {
    const response = await _fetchWithAuth(`${BASE_URL}/albums`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        year,
      }),
    });

    const responseJson = await response.json();
    const { status, message } = responseJson;

    if (status !== 'success') {
      throw new Error(message);
    }

    const { data } = responseJson;

    return data;
  }

  async function editAlbum({ id, name, year }) {
    const response = await _fetchWithAuth(`${BASE_URL}/albums/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        year,
      }),
    });

    const responseJson = await response.json();
    const { status, message } = responseJson;

    if (status !== 'success') {
      throw new Error(message);
    }
  }

  async function deleteAlbum(id) {
    const response = await _fetchWithAuth(`${BASE_URL}/albums/${id}`, {
      method: 'DELETE',
    });

    const responseJson = await response.json();
    const { status, message } = responseJson;

    if (status !== 'success') {
      throw new Error(message);
    }
  }

  async function addAlbumCover(id, file) {
    const formData = new FormData();
    formData.append('cover', file);

    const response = await _fetchWithAuth(`${BASE_URL}/albums/${id}/covers`, {
      method: 'POST',
      body: formData,
    });

    const responseJson = await response.json();
    const { status, message } = responseJson;

    if (status !== 'success') {
      throw new Error(message);
    }

    const { data } = responseJson;

    return data;
  }

  async function createSong({ title, year, genre, duration, albumId }) {
    const response = await _fetchWithAuth(`${BASE_URL}/songs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title,
        year,
        genre,
        duration,
        albumId,
      }),
    });

    const responseJson = await response.json();
    const { status, message } = responseJson;

    if (status !== 'success') {
      throw new Error(message);
    }

    const { data } = responseJson;

    return data;
  }

  async function editSong({ id, title, year, genre, duration, albumId }) {
    const response = await _fetchWithAuth(`${BASE_URL}/songs/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title,
        year,
        genre,
        duration,
        albumId,
      }),
    });

    const responseJson = await response.json();
    const { status, message } = responseJson;

    if (status !== 'success') {
      throw new Error(message);
    }
  }

  async function deleteSong(id) {
    const response = await _fetchWithAuth(`${BASE_URL}/songs/${id}`, {
      method: 'DELETE',
    });

    const responseJson = await response.json();
    const { status, message } = responseJson;

    if (status !== 'success') {
      throw new Error(message);
    }
  }

  async function addSongAudio(id, file) {
    const formData = new FormData();
    formData.append('audio', file);

    const response = await _fetchWithAuth(`${BASE_URL}/songs/${id}/audios`, {
      method: 'POST',
      body: formData,
    });

    const responseJson = await response.json();
    const { status, message } = responseJson;

    if (status !== 'success') {
      throw new Error(message);
    }

    const { data } = responseJson;

    return data;
  }

  async function addSongCover(id, file) {
    const formData = new FormData();
    formData.append('cover', file);

    const response = await _fetchWithAuth(`${BASE_URL}/songs/${id}/covers`, {
      method: 'POST',
      body: formData,
    });

    const responseJson = await response.json();
    const { status, message } = responseJson;

    if (status !== 'success') {
      throw new Error(message);
    }

    const { data } = responseJson;

    return data;
  }

  async function createPlaylist(name, isPublic) {
    const response = await _fetchWithAuth(`${BASE_URL}/playlists`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        isPublic,
      }),
    });

    const responseJson = await response.json();
    const { status, message } = responseJson;

    if (status !== 'success') {
      throw new Error(message);
    }

    const { data } = responseJson;

    return data;
  }

  async function editPlaylist({ id, name, isPublic }) {
    const response = await _fetchWithAuth(`${BASE_URL}/playlists/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        isPublic,
      }),
    });

    const responseJson = await response.json();
    const { status, message } = responseJson;

    if (status !== 'success') {
      throw new Error(message);
    }
  }

  async function addPlaylistCollaborator(playlistId, userId) {
    const response = await _fetchWithAuth(`${BASE_URL}/collaborations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        playlistId,
        userId,
      }),
    });

    const responseJson = await response.json();
    const { status, message } = responseJson;

    if (status !== 'success') {
      throw new Error(message);
    }

    const { data } = responseJson;

    return data;
  }

  async function deletePlaylistCollaborator(playlistId, userId) {
    const response = await _fetchWithAuth(`${BASE_URL}/collaborations`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        playlistId,
        userId,
      }),
    });

    const responseJson = await response.json();
    const { status, message } = responseJson;

    if (status !== 'success') {
      throw new Error(message);
    }
  }

  async function deletePlaylist(id) {
    const response = await _fetchWithAuth(`${BASE_URL}/playlists/${id}`, {
      method: 'DELETE',
    });

    const responseJson = await response.json();
    const { status, message } = responseJson;

    if (status !== 'success') {
      throw new Error(message);
    }
  }

  async function addPlaylistCover(id, file) {
    const formData = new FormData();
    formData.append('cover', file);

    const response = await _fetchWithAuth(
      `${BASE_URL}/playlists/${id}/covers`,
      {
        method: 'POST',
        body: formData,
      }
    );

    const responseJson = await response.json();
    const { status, message } = responseJson;

    if (status !== 'success') {
      throw new Error(message);
    }

    const { data } = responseJson;

    return data;
  }

  async function getPlaylists() {
    const response = await _fetchWithAuth(`${BASE_URL}/playlists`);

    const responseJson = await response.json();
    const { status, message } = responseJson;

    if (status !== 'success') {
      throw new Error(message);
    }

    const {
      data: { playlists },
    } = responseJson;

    return playlists;
  }

  async function getPopularPlaylists() {
    const response = await _fetchWithAuth(`${BASE_URL}/playlists/popular`);

    const responseJson = await response.json();
    const { status, message } = responseJson;

    if (status !== 'success') {
      throw new Error(message);
    }

    const {
      data: { playlists },
    } = responseJson;

    return playlists;
  }

  async function getPlaylistById(id) {
    const response = await _fetchWithAuth(`${BASE_URL}/playlists/${id}`);

    const responseJson = await response.json();
    const { status, message } = responseJson;

    if (status !== 'success') {
      throw new Error(message);
    }

    const {
      data: { playlist },
    } = responseJson;

    return playlist;
  }

  async function likePlaylist(id) {
    const response = await _fetchWithAuth(`${BASE_URL}/playlists/${id}/likes`, {
      method: 'POST',
    });

    const responseJson = await response.json();
    const { status, message } = responseJson;

    if (status !== 'success') {
      throw new Error(message);
    }
  }

  async function deleteLikePlaylist(id) {
    const response = await _fetchWithAuth(`${BASE_URL}/playlists/${id}/likes`, {
      method: 'DELETE',
    });

    const responseJson = await response.json();
    const { status, message } = responseJson;

    if (status !== 'success') {
      throw new Error(message);
    }
  }

  async function addSongToPlaylist(id, songId) {
    const response = await _fetchWithAuth(`${BASE_URL}/playlists/${id}/songs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        songId,
      }),
    });

    const responseJson = await response.json();
    const { status, message } = responseJson;

    if (status !== 'success') {
      throw new Error(message);
    }
  }

  async function deleteSongFromPlaylist(id, songId) {
    const response = await _fetchWithAuth(`${BASE_URL}/playlists/${id}/songs`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        songId,
      }),
    });

    const responseJson = await response.json();
    const { status, message } = responseJson;

    if (status !== 'success') {
      throw new Error(message);
    }
  }

  async function report({ songId, reason, detail }) {
    const response = await _fetchWithAuth(`${BASE_URL}/reports`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        songId,
        reason,
        detail,
      }),
    });

    const responseJson = await response.json();
    const { status, message } = responseJson;

    if (status !== 'success') {
      throw new Error(message);
    }
  }

  return {
    putRefreshToken,
    getRefreshToken,
    generateAccessToken,
    register,
    editUser,
    addUserPicture,
    sendActivationCode,
    activateUser,
    login,
    logout,
    requestResetPassword,
    resetPassword,
    changeEmail,
    getPopularArtists,
    getFollowedArtists,
    getOwnProfile,
    followUser,
    unfollowUser,
    getUsers,
    getUserById,
    getGenres,
    getAlbums,
    getPopularAlbums,
    getLikedAlbums,
    getAlbumById,
    likeAlbum,
    deleteLikeAlbum,
    getAlbumsByArtist,
    getOwnedAlbums,
    getSongs,
    getSongsByGenre,
    getOwnedSongs,
    getLikedSongs,
    getSongById,
    getOwnedSingles,
    likeSong,
    deleteLikeSong,
    addHistory,
    getHistory,
    createAlbum,
    editAlbum,
    deleteAlbum,
    addAlbumCover,
    createSong,
    editSong,
    deleteSong,
    addSongAudio,
    addSongCover,
    createPlaylist,
    editPlaylist,
    addPlaylistCollaborator,
    deletePlaylistCollaborator,
    deletePlaylist,
    addPlaylistCover,
    getPopularPlaylists,
    getPlaylists,
    getPlaylistById,
    addSongToPlaylist,
    deleteSongFromPlaylist,
    report,
  };
})();

export default api;
