import PlaylistItem from './PlaylistItem';
import styles from '../../_styles/playlist.module.css';

function PlaylistsList({ playlists, onDeletePlaylist }) {
  return (
    <div className={styles.playlist_list}>
      {playlists.map((playlist) => (
        <PlaylistItem
          key={playlist.id}
          {...playlist}
          onDelete={onDeletePlaylist}
        />
      ))}
    </div>
  );
}

export default PlaylistsList;
