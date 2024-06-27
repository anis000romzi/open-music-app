import HistoryItem from './HistoryItem';
import styles from '../../_styles/history.module.css';

function HistoryList({ songs, onPlayHandler }) {
  return (
    <>
      <div className={styles.history_list}>
        {songs &&
          songs.slice(0, 4).map((song) => (
            <HistoryItem key={song.id} {...song} onPlay={onPlayHandler} />
          ))}
      </div>
    </>
  );
}

export default HistoryList;
