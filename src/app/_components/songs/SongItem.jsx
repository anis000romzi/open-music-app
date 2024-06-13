import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Link from 'next/link';
import Image from 'next/image';
import { HiDotsVertical } from 'react-icons/hi';
import { CgPlayListAdd } from 'react-icons/cg';
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai';
import { CiFlag1 } from 'react-icons/ci';
import { LiaDownloadSolid } from 'react-icons/lia';
import { LuTrash2 } from 'react-icons/lu';
import useOpenNav from '@/app/_hooks/useOpenNav';
import OfflineAudioIdb from '@/app/_utils/offline-audio-idb';
import { formatTime } from '@/app/_utils/time-format';
import defaultImage from '../../_assets/default-image.png';
import styles from '../../_styles/song.module.css';

function SongItem({
  id,
  title,
  artist_id,
  artist,
  album_id,
  album,
  audio,
  duration,
  likes,
  cover,
  onPlay,
  onOpen,
  setSong,
  authUser,
  onLike,
  onDeleteLike,
}) {
  const { currentlyPlaying = {} } = useSelector((states) => states.queue);
  const [dropdownRef, dropdownOpen, setDropdownOpen] = useOpenNav();
  const [downloaded, setDownloaded] = useState(false);

  const isSongLiked = likes && likes.includes(authUser);

  useEffect(() => {
    const checkCachedAudio = async () => {
      if ('caches' in window) {
        const cache = await caches.open('audio-cache');
        const response = await cache.match(audio);
        setDownloaded(!!response);
      }
    };

    checkCachedAudio();
  }, [audio]);

  const downloadAudio = async () => {
    const response = await fetch(audio);
    const blob = await response.blob();

    if ('caches' in window) {
      const cache = await caches.open('audio-cache');
      await cache.put(audio, new Response(blob));
      await OfflineAudioIdb.putSong({ id, title, artist_id, artist, audio, likes, duration, cover });
      setDownloaded(true);
    }
  };

  const deleteDownloadedAudio = async () => {
    if ('caches' in window) {
      const cache = await caches.open('audio-cache');
      await cache.delete(audio);
      await OfflineAudioIdb.deleteSong(id);
      setDownloaded(false);
    }
  };

  const handleLikeClick = () => {
    if (isSongLiked) {
      onDeleteLike(id, isSongLiked);
    } else {
      onLike(id, isSongLiked);
    }
  };

  const handleAddToPlaylistClick = () => {
    onOpen();
    setSong(id);
    setDropdownOpen(false);
  };

  return (
    <div
      className={`${styles.song_item} ${currentlyPlaying.id === id ? styles.playing : ''}`}
      onClick={() => onPlay(id)}
    >
      <div className={styles.song_info}>
        <Image src={cover || defaultImage} width={50} height={50} alt="Album cover" priority />
        <div>
          <strong>{title}</strong>
          <Link href={`/artist/${artist_id}`} onClick={(event) => event.stopPropagation()}>
            {artist}
          </Link>
        </div>
      </div>
      <p className={styles.song_album}>
        {album || 'single'}
      </p>
      <p className={styles.song_duration}>{formatTime(duration)}</p>
      <div className={styles.song_buttons} onClick={(event) => event.stopPropagation()}>
        {authUser && (
          <button type="button" onClick={handleLikeClick}>
            {isSongLiked ? <AiFillHeart /> : <AiOutlineHeart />}
          </button>
        )}
        <span ref={dropdownRef} className={styles.dropdown}>
          <button type="button" className={styles.show_dropdown_menu} onClick={() => setDropdownOpen((current) => !current)}>
            <HiDotsVertical />
          </button>
          <div className={`${styles.dropdown_buttons} ${dropdownOpen ? styles.show : ''}`} id="myDropdown">
            {authUser && (
              <button onClick={handleAddToPlaylistClick}>
                <CgPlayListAdd /> Add to playlist
              </button>
            )}
            {downloaded ? (
              <button onClick={() => deleteDownloadedAudio()}>
                <LuTrash2 /> Delete Download
              </button>
            ) : (
              <button onClick={() => downloadAudio()}>
                <LiaDownloadSolid /> Download
              </button>
            )}
            {/* {authUser && (
              <button onClick={(event) => event.stopPropagation()}>
                <CiFlag1 /> Report
              </button>
            )} */}
          </div>
        </span>
      </div>
    </div>
  );
}

export default SongItem;
