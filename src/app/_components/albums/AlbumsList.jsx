import { useRef } from 'react';
import AlbumItem from './AlbumItem';
import { FaChevronLeft } from 'react-icons/fa6';
import { FaChevronRight } from 'react-icons/fa6';
import styles from '../../_styles/album.module.css';

function AlbumsList({ albums }) {
  const ref = useRef();

  const sideScroll = (element, direction, speed, distance, step) => {
    let scrollAmount = 0;
    let slideTimer = setInterval(function () {
      if (direction == 'left') {
        element.scrollLeft -= step;
      } else {
        element.scrollLeft += step;
      }
      scrollAmount += step;
      if (scrollAmount >= distance) {
        window.clearInterval(slideTimer);
      }
    }, speed);
  }

  return (
    <div className={styles.albums_list_container}>
      <div ref={ref} className={styles.albums_list}>
        {albums &&
          albums.map((album) => <AlbumItem key={album.id} {...album} />)}
      </div>
      <div className={styles.albums_list_buttons}>
        <button
          type="button"
          onClick={() => sideScroll(ref.current, 'left', 10, 400, 15)}
        >
          <FaChevronLeft />
        </button>
        <button
          type="button"
          onClick={() => sideScroll(ref.current, 'right', 10, 400, 15)}
        >
          <FaChevronRight />
        </button>
      </div>
    </div>
  );
}

export default AlbumsList;
