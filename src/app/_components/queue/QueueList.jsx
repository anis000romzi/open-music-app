import QueueItem from './QueueItem';
import styles from '../../_styles/queue.module.css'

function QueueList({
  queue,
  onPlayHandler,
  onDeleteHandler,
  currentlyPlaying,
}) {
  return (
    <div className={styles.queue_list}>
      {queue &&
        queue.map((queue) => (
          <QueueItem
            key={queue.id}
            {...queue}
            onPlay={onPlayHandler}
            onDelete={onDeleteHandler}
            currentlyPlaying={currentlyPlaying}
          />
        ))}
    </div>
  );
}

export default QueueList;
