import { HiDotsVertical } from 'react-icons/hi';
import { CgPlayListAdd } from 'react-icons/cg';
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai';
import { CiFlag1 } from 'react-icons/ci';
import Link from 'next/link';
import useOpenNav from '@/app/_hooks/useOpenNav';
import styles from '../../_styles/song.module.css';

function SongItem({
  id,
  title,
  artistid,
  artist,
  likes,
  onPlay,
  onOpen,
  setSong,
  authUser,
  onLike,
  onDeleteLike,
}) {
  const [dropdownRef, dropdownOpen, setDropdownOpen] = useOpenNav();
  const isSongLiked = likes && likes.includes(authUser);

  return (
    <div className={styles.song_item} onClick={() => onPlay(id)}>
      <div className={styles.song_info}>
        <strong>{title}</strong>
        <Link
          href={`/artist/${artistid}`}
          onClick={(event) => event.stopPropagation()}
        >
          {artist}
        </Link>
      </div>
      {authUser && (
        <div className={styles.song_buttons}>
          <button
            type="button"
            onClick={(event) => {
              if (isSongLiked) {
                onDeleteLike(id);
              } else {
                onLike(id);
              }
              event.stopPropagation();
            }}
          >
            {isSongLiked ? <AiFillHeart /> : <AiOutlineHeart />}
          </button>
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
      )}
    </div>
  );
}

export default SongItem;
