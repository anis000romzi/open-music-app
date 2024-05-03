import Image from 'next/image';
import Link from 'next/link';
import styles from '../../_styles/album.module.css';
import defaultImage from '../../_assets/default-image.png';

function AlbumItem({ id, artist_id, name, artist, cover }) {
  return (
    <div className={styles.album_item}>
      <Link href={`/album/${id}`}>
        <Image
          className={styles.album_cover}
          src={cover ? cover : defaultImage}
          width={130}
          height={130}
          alt="Album cover"
          priority
        />
      </Link>
      <p>{name}</p>
      <Link href={`/artist/${artist_id}`}>{artist}</Link>
    </div>
  );
}

export default AlbumItem;
