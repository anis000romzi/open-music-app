import Image from 'next/image';
import Link from 'next/link';
import defaultImage from '../../_assets/default-image.png';
import styles from '../../_styles/artist.module.css';

function ArtistItem({ id, fullname, username, picture }) {
  return (
    <div className={styles.artist_item}>
      <Link href={`/artist/${id}`}>
        <Image
          src={picture ? picture : defaultImage}
          width={100}
          height={100}
          alt="Profile picture"
          priority
        />
      </Link>
      <p>{fullname}</p>
      <span>@{username}</span>
    </div>
  );
}

export default ArtistItem;
