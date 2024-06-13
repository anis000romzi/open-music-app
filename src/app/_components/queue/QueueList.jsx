import QueueItem from './QueueItem';
import styles from '../../_styles/track.module.css'

function QueueList({
  queue,
  onPlayHandler,
  onDeleteHandler,
  currentlyPlaying,
}) {
  return (
    <div className={styles.track_list}>
      {queue &&
        queue.map((track) => (
          <QueueItem
            key={track.id}
            {...track}
            onPlay={onPlayHandler}
            onDelete={onDeleteHandler}
            currentlyPlaying={currentlyPlaying}
          />
        ))}
    </div>
  );
}

export default QueueList;
