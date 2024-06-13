import { AiOutlineClose } from 'react-icons/ai';
import styles from '../../_styles/track.module.css';

function QueueItem({ id, title, artist, onPlay, onDelete, currentlyPlaying }) {
  return (
    <div className={styles.track_item} onClick={() => onPlay(id)}>
      <div className={styles.track_info}>
        <strong>{title}</strong>
        <p>{artist}</p>
      </div>
      {id === currentlyPlaying.id ? (
        <p>PLAYING</p>
      ) : (
        <>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onDelete(id);
            }}
          >
            <AiOutlineClose />
          </button>
        </>
      )}
    </div>
  );
}

export default QueueItem;
