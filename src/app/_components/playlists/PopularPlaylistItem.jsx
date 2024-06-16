import Image from 'next/image';
import Link from 'next/link';
import styles from '../../_styles/playlist.module.css';
import defaultImage from '../../_assets/default-image.png';

function PopularPlaylistItem({ id, username, name, owner, cover }) {
  return (
    <div className={styles.popular_playlist_item}>
      <Link href={`/playlist/${id}`}>
        <Image
          className={styles.popular_playlist_cover}
          src={cover ? cover : defaultImage}
          width={130}
          height={130}
          alt="Playlist cover"
          priority
        />
      </Link>
      <p>{name}</p>
      <Link href={`/artist/${owner}`}>{username}</Link>
    </div>
  );
}

export default PopularPlaylistItem;
