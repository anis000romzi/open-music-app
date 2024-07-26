import { useDragLayer } from 'react-dnd';
import styles from '../../_styles/queue.module.css';

function getItemStyles(initialOffset, currentOffset) {
  if (!initialOffset || !currentOffset) {
    return {
      display: 'none',
    };
  }

  let { x, y } = currentOffset;
  const transform = `translate(${x}px, ${y}px)`;
  return {
    transform,
    WebkitTransform: transform,
  };
}

const QueueItemDragLayer = () => {
  const {
    itemType,
    isDragging,
    item,
    initialOffset,
    currentOffset,
  } = useDragLayer((monitor) => ({
    item: monitor.getItem(),
    itemType: monitor.getItemType(),
    initialOffset: monitor.getInitialSourceClientOffset(),
    currentOffset: monitor.getSourceClientOffset(),
    isDragging: monitor.isDragging(),
  }));

  if (!isDragging) {
    return null;
  }

  return (
    <div className={styles.custom_drag_layer}>
      <div style={getItemStyles(initialOffset, currentOffset)}>
        <div className={styles.queue_item}>
          <div className={styles.queue_info}>
            <strong>{item.title}</strong>
            <p>{item.artist}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QueueItemDragLayer;
