import { useRef } from 'react';
import { useDraggable } from 'react-use-draggable-scroll';
import ArtistItem from './ArtistItem';
import styles from '../../_styles/artist.module.css';

function ArtistsList({ artists }) {
  const ref = useRef();
  const { events } = useDraggable(ref);

  return (
    <div className={styles.artists_list} {...events} ref={ref}>
      {artists &&
        artists.map((artist) => <ArtistItem key={artist.id} {...artist} />)}
    </div>
  );
}

export default ArtistsList;
