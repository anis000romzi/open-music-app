'use client';
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import SongsList from '@/app/_components/songs/SongsList';
import {
  asyncReceiveAlbumDetail,
  asyncAlbumDetailLikeSong,
  asyncDeleteAlbumDetailLikeSong,
  asyncLikeAlbumDetail,
  asyncDeleteLikeAlbumDetail,
} from '@/app/_states/albumDetail/action';
import { asyncGetPlaylists } from '@/app/_states/playlists/action';
import {
  setNewTracksQueue,
  setPlayingSongInQueue,
  setIsPlaying,
} from '@/app/_states/queue/action';
import shuffle from '@/app/_utils/shuffle';
import { formatTimeString } from '@/app/_utils/time-format';
import { FaPlay, FaShuffle } from 'react-icons/fa6';
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai';
import styles from '../../../_styles/style.module.css';
import defaultImage from '../../../_assets/default-image.png';

function AlbumDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();

  const playlists = useSelector((state) => state.playlists);
  const albumDetail = useSelector((state) => state.albumDetail);
  const authUser = useSelector((state) => state.authUser);

  const [shuffleSongs, setShuffleSongs] = useState(false);

  const isAlbumLiked = albumDetail?.likes.includes(authUser?.id || '');

  useEffect(() => {
    if (authUser) dispatch(asyncGetPlaylists());
    dispatch(asyncReceiveAlbumDetail(id));
  }, [dispatch, id, authUser]);

  const playAllSong = (tracks) => {
    if (shuffleSongs) {
      dispatch(setNewTracksQueue(shuffle(tracks)));
    } else {
      dispatch(setNewTracksQueue(tracks));
    }
    dispatch(setIsPlaying(true));
  };

  const playSong = (songId) => {
    dispatch(setNewTracksQueue(albumDetail.songs));
    dispatch(setPlayingSongInQueue(songId));
    dispatch(setIsPlaying(true));
  };

  const handleLikeSong = (id, isLiked) => {
    dispatch(isLiked ? asyncDeleteAlbumDetailLikeSong(id) : asyncAlbumDetailLikeSong(id));
  };

  const handleLikeAlbum = (id, isLiked) => {
    dispatch(isLiked ? asyncDeleteLikeAlbumDetail(id) : asyncLikeAlbumDetail(id));
  };

  if (!albumDetail) return null;

  return (
    <main className={styles.album_detail_page}>
      <section className={styles.album_detail}>
        <div className={styles.album_cover}>
          <Image
            src={albumDetail.coverUrl || defaultImage}
            width={200}
            height={200}
            alt="Album cover"
            priority
          />
        </div>
        <div className={styles.album_info}>
          <h1>{albumDetail.name}</h1>
          <p>
            <strong>
              <Link href={`/artist/${albumDetail.artistId}`}>{albumDetail.artist}</Link>
            </strong>{' '}
            • {albumDetail.year}
          </p>
          <p>
            {albumDetail.songs.length} songs,{' '}
            {formatTimeString(albumDetail.songs.reduce((acc, song) => acc + song.duration, 0))}
          </p>
        </div>
        <div className={styles.album_buttons}>
          {authUser ? (
            <button
              className={styles.like_album_button}
              type="button"
              onClick={() => handleLikeAlbum(albumDetail.id, isAlbumLiked)}
            >
              {isAlbumLiked ? <AiFillHeart /> : <AiOutlineHeart />} <span>{albumDetail.likes.length}</span>
            </button>
          ) : (
            <button
              className={styles.like_album_button}
              type="button"
            >
              <AiFillHeart /> <span>{albumDetail.likes.length}</span>
            </button>
          )}
          <div>
            <button
              className={`${styles.shuffle_button} ${shuffleSongs ? styles.active : ''}`}
              type="button"
              onClick={() => setShuffleSongs((prev) => !prev)}
            >
              <FaShuffle />
            </button>
            <button
              className={styles.play_all_button}
              type="button"
              onClick={() => playAllSong(albumDetail.songs)}
            >
              <FaPlay />
            </button>
          </div>
        </div>
      </section>
      <SongsList
        songs={albumDetail.songs}
        onPlayHandler={playSong}
        playlists={playlists}
        authUser={authUser?.id}
        onLike={handleLikeSong}
        onDeleteLike={handleLikeSong}
      />
    </main>
  );
}

export default AlbumDetail;
