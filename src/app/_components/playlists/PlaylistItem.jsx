import Link from 'next/link';
import Image from 'next/image';
import { FaRegTrashCan } from 'react-icons/fa6';
import styles from '../../_styles/playlist.module.css';
import defaultImage from '../../_assets/default-image.png';

function PlaylistItem({ id, name, songs, cover, onDelete }) {
  return (
    <div className={styles.playlist_item}>
      <button
        onClick={(event) => {
          onDelete(id);
          event.stopPropagation();
        }}
      >
        <FaRegTrashCan />
      </button>
      <div className={styles.playlist_info}>
        <Image src={cover || defaultImage} width={50} height={50} alt="Playlist cover" priority />
        <div>
          <Link href={`playlist/${id}`}>
            <strong>{name}</strong>
            <p>{songs.length} song(s)</p>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default PlaylistItem;
