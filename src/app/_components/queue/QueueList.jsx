import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { setQueuePosition } from '@/app/_states/queue/action';
import QueueItem from './QueueItem';
import styles from '../../_styles/queue.module.css';

function QueueList({
  queue,
  onPlayHandler,
  onDeleteHandler,
  currentlyPlaying,
}) {
  const dispatch = useDispatch();

  const moveCard = useCallback((dragIndex, hoverIndex) => {
    dispatch(setQueuePosition(dragIndex, hoverIndex));
  }, [dispatch]);

  return (
    <div className={styles.queue_list}>
      {queue &&
        queue.map((queue, index) => (
      <QueueItem
        key={queue.id}
        {...queue}
        onPlay={onPlayHandler}
        onDelete={onDeleteHandler}
        currentlyPlaying={currentlyPlaying}
        index={index}
        moveCard={moveCard}
      />
        ))}
    </div>
  );
}

export default QueueList;
