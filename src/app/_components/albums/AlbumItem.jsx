import styles from '../../_styles/style.module.css';
import Image from 'next/image';
import Link from 'next/link';
import defaultImage from '../../_assets/default-image.png';

function AlbumItem({ id, artistid, name, artist, cover }) {
  return (
    <div className={styles.album_item}>
      <Link href={`/album/${id}`}>
        <Image
          className={styles.album_cover}
          src={cover ? cover : defaultImage}
          width={150}
          height={150}
          alt="Album cover"
          priority
        />
      </Link>
      <p>{name}</p>
      <Link href={`/artist/${artistid}`}>{artist}</Link>
    </div>
  );
}

export default AlbumItem;
