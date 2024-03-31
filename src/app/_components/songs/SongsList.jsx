import SongItem from './SongItem';
import styles from '../../_styles/song.module.css'

function SongsList({ songs, onClickHandler }) {
  return (
    <div className={styles.song_list}>
      {songs && songs.map((song) => <SongItem key={song.id} {...song} onPlay={onClickHandler} />)}
    </div>
  );
}

export default SongsList;
