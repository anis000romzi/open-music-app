import Image from 'next/image';
import Link from 'next/link';
import defaultImage from '../../_assets/default-image.png';

function AlbumItem({ id, artistid, name, artist, cover }) {
  return (
    <div className="album-item">
      <Link href={`/album/${id}`}>
        <Image
          src={cover ? cover : defaultImage}
          width={170}
          height={170}
          alt="Album cover"
        />
      </Link>
      <p>{name}</p>
      <Link href={`/artist/${artistid}`}>{artist}</Link>
    </div>
  );
}

export default AlbumItem;
