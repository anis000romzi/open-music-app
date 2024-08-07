import { ActionType } from './action';

function playlistDetailReducer(playlistDetail = null, action = {}) {
  switch (action.type) {
    case ActionType.RECEIVE_PLAYLIST_DETAIL:
      return action.payload.playlistDetail;
    case ActionType.CLEAR_PLAYLIST_DETAIL:
      return null;
    case ActionType.EDIT_PLAYLIST_DETAIL:
      return {
        ...playlistDetail,
        name: action.payload.name,
        is_public: action.payload.isPublic,
      };
    case ActionType.CHANGE_PLAYLIST_DETAIL_COVER:
      return {
        ...playlistDetail,
        cover: action.payload.file,
      };
    case ActionType.LIKE_PLAYLIST_DETAIL:
      return {
        ...playlistDetail,
        likes: playlistDetail.likes.concat([action.payload.userId]),
      };
    case ActionType.DELETE_LIKE_PLAYLIST_DETAIL:
      return {
        ...playlistDetail,
        likes: playlistDetail.likes.filter((id) => id !== action.payload.userId),
      };
    case ActionType.LIKE_PLAYLIST_DETAIL_SONG:
      return {
        ...playlistDetail,
        songs: playlistDetail.songs.map((song) => {
          if (song.id === action.payload.songId) {
            return {
              ...song,
              likes: song.likes.concat([action.payload.userId]),
            };
          }
          return song;
        }),
      };
    case ActionType.DELETE_PLAYLIST_DETAIL_LIKE_SONG:
      return {
        ...playlistDetail,
        songs: playlistDetail.songs.map((song) => {
          if (song.id === action.payload.songId) {
            return {
              ...song,
              likes: song.likes.filter((id) => id !== action.payload.userId),
            };
          }
          return song;
        }),
      };
    case ActionType.ADD_PLAYLIST_COLLABORATOR:
      return {
        ...playlistDetail,
        collaborators: playlistDetail.collaborators.concat([
          { id: action.payload.userId, username: action.payload.userName },
        ]),
      };
    case ActionType.DELETE_PLAYLIST_COLLABORATOR:
      return {
        ...playlistDetail,
        collaborators: playlistDetail.collaborators.filter(
          (collaborator) => collaborator.id !== action.payload.userId
        ),
      };
    default:
      return playlistDetail;
  }
}

export default playlistDetailReducer;
