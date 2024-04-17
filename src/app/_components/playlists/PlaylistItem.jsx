import { AiOutlineClose } from 'react-icons/ai';
import Link from 'next/link';
import styles from '../../_styles/playlist.module.css';

function PlaylistItem({ id, name, songs, onDelete }) {
  return (
    <div className={styles.playlist_item}>
      <div>
        <Link href={`playlist/${id}`}>
          <strong>{name}</strong>
          <p>{songs.length} song(s)</p>
        </Link>
      </div>
      <button
        onClick={(event) => {
          onDelete(id);
          event.stopPropagation();
        }}
      >
        <AiOutlineClose />
      </button>
    </div>
  );
}

export default PlaylistItem;
