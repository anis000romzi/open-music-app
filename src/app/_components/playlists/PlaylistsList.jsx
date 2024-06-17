import PlaylistItem from './PlaylistItem';
import styles from '../../_styles/playlist.module.css';

function PlaylistsList({ authUser, playlists, onDeletePlaylist }) {
  return (
    <div className={styles.playlist_list}>
      {playlists.map((playlist) => (
        <PlaylistItem
          key={playlist.id}
          authUser={authUser}
          {...playlist}
          onDelete={onDeletePlaylist}
        />
      ))}
    </div>
  );
}

export default PlaylistsList;
