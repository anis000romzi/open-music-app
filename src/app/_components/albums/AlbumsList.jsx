import { useRef } from 'react';
import { useDraggable } from 'react-use-draggable-scroll';
import AlbumItem from './AlbumItem';
import styles from '../../_styles/album.module.css';

function AlbumsList({ albums }) {
  const ref = useRef();
  const { events } = useDraggable(ref);

  return (
    <div className={styles.albums_list} {...events} ref={ref}>
      {albums && albums.map((album) => <AlbumItem key={album.id} {...album} />)}
    </div>
  );
}

export default AlbumsList;
