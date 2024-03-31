import styles from '../../_styles/song.module.css';
import { FaPlay } from 'react-icons/fa6';

function SongItem({ id, title, artist, onPlay }) {
  return (
    <div className={styles.song_item}>
      <div className={styles.song_info}>
        <strong>{title}</strong>
        <p>{artist}</p>
      </div>
      <button type="button" onClick={() => onPlay(id)}>
        <FaPlay />
      </button>
    </div>
  );
}

export default SongItem;
