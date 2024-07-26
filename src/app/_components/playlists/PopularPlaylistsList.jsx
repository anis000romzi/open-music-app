import { useRef, useState, useEffect } from 'react';
import PopularPlaylistItem from './PopularPlaylistItem';
import { FaChevronLeft } from 'react-icons/fa6';
import { FaChevronRight } from 'react-icons/fa6';
import styles from '../../_styles/playlist.module.css';

function PopularPlaylistsList({ playlists }) {
  const ref = useRef();
  const [isOverflowing, setIsOverflowing] = useState(false);

  useEffect(() => {
    const checkOverflow = () => {
      if (ref.current) {
        setIsOverflowing(ref.current.scrollWidth > ref.current.clientWidth);
      }
    };

    checkOverflow();
    window.addEventListener('resize', checkOverflow);

    return () => {
      window.removeEventListener('resize', checkOverflow);
    };
  }, []);

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
      {isOverflowing && (
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
      )}
    </div>
  );
}

export default PopularPlaylistsList;
