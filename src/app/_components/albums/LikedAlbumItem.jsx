import Image from 'next/image';
import Link from 'next/link';
import defaultImage from '../../_assets/default-image.png';
import styles from '../../_styles/album.module.css'

function LikedAlbumItem({ id, artist_id, name, artist, cover }) {
  return (
    <div className={styles.liked_album_item}>
      <Link href={`/album/${id}`}>
        <Image
          src={cover ? cover : defaultImage}
          width={70}
          height={70}
          alt="Album cover"
          priority
        />
      </Link>
      <div>
        <p>{name}</p>
        <Link href={`/artist/${artist_id}`}>{artist}</Link>
      </div>
    </div>
  );
}

export default LikedAlbumItem;
