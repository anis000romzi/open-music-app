import { useRef } from 'react';
import PopularPlaylistItem from './PopularPlaylistItem';
import { FaChevronLeft } from 'react-icons/fa6';
import { FaChevronRight } from 'react-icons/fa6';
import styles from '../../_styles/playlist.module.css';

function PopularPlaylistsList({ playlists }) {
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
    <div className={styles.popular_playlists_list_container}>
      <div ref={ref} className={styles.popular_playlists_list}>
        {playlists &&
          playlists.map((playlist) => <PopularPlaylistItem key={playlist.id} {...playlist} />)}
      </div>
      <div className={styles.popular_playlists_list_buttons}>
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

export default PopularPlaylistsList;
