import { useRef } from 'react';
import ArtistItem from './ArtistItem';
import { FaChevronLeft } from 'react-icons/fa6';
import { FaChevronRight } from 'react-icons/fa6';
import styles from '../../_styles/artist.module.css';

function ArtistsList({ artists }) {
  const ref = useRef();

  function sideScroll(element, direction, speed, distance, step) {
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
    <div className={styles.artists_list_container}>
      <div ref={ref} className={styles.artists_list}>
        {artists &&
          artists.map((artist) => <ArtistItem key={artist.id} {...artist} />)}
      </div>
      <div className={styles.artists_list_buttons}>
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

export default ArtistsList;
