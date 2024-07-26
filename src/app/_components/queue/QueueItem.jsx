import { useRef, useEffect } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { AiOutlineClose } from 'react-icons/ai';
import styles from '../../_styles/queue.module.css';

function QueueItem({
  id,
  title,
  artist,
  onPlay,
  onDelete,
  currentlyPlaying,
  index,
  moveCard,
}) {
  const ref = useRef(null);
  const [{ handlerId }, drop] = useDrop({
    accept: 'queue-item',
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) {
        return;
      }
      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      moveCard(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag, preview] = useDrag({
    type: 'queue-item',
    item: () => {
      // Add no-select class to disable text selection
      document.body.classList.add(styles.no_select);

      return { id, index, title, artist };
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    end: () => {
      // Remove no-select class when dragging ends
      document.body.classList.remove(styles.no_select);
    },
  });

  useEffect(() => {
    // Clean up the no-select class if the component unmounts during a drag
    return () => {
      document.body.classList.remove(styles.no_select);
    };
  }, []);

  const opacity = isDragging ? 0 : 1;
  drag(drop(ref));

  return (
    <div
      ref={ref}
      style={{ opacity }}
      className={`${styles.queue_item} ${
        currentlyPlaying.id === id ? styles.playing : ''
      }`}
      onClick={() => onPlay(id)}
      data-handler-id={handlerId}
    >
      <div className={styles.queue_info}>
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
