import styles from '../../_styles/song.module.css';
import { HiDotsVertical } from 'react-icons/hi';
import { CgPlayListAdd } from 'react-icons/cg';
import { CiFlag1 } from 'react-icons/ci';
import useOpenNav from '@/app/_hooks/useOpenNav';

function SongItem({ id, title, artist, onPlay, onOpen, setSong }) {
  const [dropdownRef, dropdownOpen, setDropdownOpen] = useOpenNav();

  return (
    <div className={styles.song_item} onClick={() => onPlay(id)}>
      <div className={styles.song_info}>
        <strong>{title}</strong>
        <p>{artist}</p>
      </div>
      <span ref={dropdownRef} className={styles.dropdown}>
        <button
          type="button"
          className={styles.show_dropdown_menu}
          onClick={(event) => {
            event.stopPropagation();
            setDropdownOpen((current) => !current);
          }}
        >
          <HiDotsVertical />
        </button>
        <div
          className={`${styles.dropdown_buttons} ${
            dropdownOpen ? styles.show : ''
          }`}
          id="myDropdown"
        >
          <button
            onClick={(event) => {
              onOpen();
              setSong(id);
              setDropdownOpen((current) => !current);
              event.stopPropagation();
            }}
          >
            <CgPlayListAdd /> Add to playlist
          </button>
          <button onClick={(event) => event.stopPropagation()}>
            <CiFlag1 />
            Report
          </button>
        </div>
      </span>
    </div>
  );
}

export default SongItem;
