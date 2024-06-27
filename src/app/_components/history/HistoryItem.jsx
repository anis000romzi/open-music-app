import { useSelector } from 'react-redux';
import Image from 'next/image';
import defaultImage from '../../_assets/default-image.png';
import styles from '../../_styles/history.module.css';

function HistoryItem({ id, title, artist_id, artist, cover, onPlay }) {
  const { currentlyPlaying = {} } = useSelector((states) => states.queue);

  return (
    <div
      className={`${styles.history_item} ${
        currentlyPlaying.id === id ? styles.playing : ''
      }`}
      onClick={() => onPlay(id)}
    >
      <Image
        src={cover || defaultImage}
        width={50}
        height={50}
        alt="Song cover"
        priority
      />
      <div>
        <strong>{title}</strong>
        <p>{artist}</p>
      </div>
    </div>
  );
}

export default HistoryItem;
