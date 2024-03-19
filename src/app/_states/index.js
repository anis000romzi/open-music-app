import { configureStore } from '@reduxjs/toolkit';
import authUserReducer from './authUser/reducer';
import isPreloadReducer from './isPreload/reducer';
import usersReducer from './users/reducer';
import userDetailReducer from './userDetail/reducer';
import popularAlbumsReducer from './popularAlbums/reducer';
import albumDetailReducer from './albumDetail/reducer';
import tracksReducer from './tracks/reducer';

const store = configureStore({
  reducer: {
    authUser: authUserReducer,
    isPreload: isPreloadReducer,
    users: usersReducer,
    userDetail: userDetailReducer,
    popularAlbums: popularAlbumsReducer,
    albumDetail: albumDetailReducer,
    tracks: tracksReducer,
  },
});

export default store;
