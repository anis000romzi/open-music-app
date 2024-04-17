'use client';
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FaPlay, FaShuffle } from 'react-icons/fa6';
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
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
  setPlayingTrack,
  setIsPlaying,
} from '@/app/_states/tracks/action';
import SongsList from '@/app/_components/songs/SongsList';
import defaultImage from '../../../_assets/default-image.png';
import styles from '../../../_styles/style.module.css';

function AlbumDetail() {
  const [shuffle, setShuffle] = useState(false);
  const playlists = useSelector((states) => states.playlists);
  const albumDetail = useSelector((states) => states.albumDetail);
  const authUser = useSelector((states) => states.authUser);

  const dispatch = useDispatch();
  const { id } = useParams();

  const isAlbumLiked = albumDetail && albumDetail.likes.includes(authUser.id);

  useEffect(() => {
    dispatch(asyncGetPlaylists());
    dispatch(asyncReceiveAlbumDetail(id));
  }, [dispatch, id]);

  const playAll = (tracks) => {
    dispatch(setNewTracksQueue(tracks));
    dispatch(setIsPlaying());
  };

  const playTrack = (songId) => {
    dispatch(setNewTracksQueue(albumDetail.songs));
    dispatch(setPlayingTrack(songId));
    dispatch(setIsPlaying());
    localStorage.setItem(
      'tracks-queue-index',
      albumDetail.songs.findIndex((track) => track.id === songId)
    );
  };

  const onLikeSong = (id) => {
    dispatch(asyncAlbumDetailLikeSong(id));
  };

  const onDeleteLikeSong = (id) => {
    dispatch(asyncDeleteAlbumDetailLikeSong(id));
  };

  const onLikeAlbum = (id) => {
    dispatch(asyncLikeAlbumDetail(id));
  };

  const onDeleteLikeAlbum = (id) => {
    dispatch(asyncDeleteLikeAlbumDetail(id));
  };

  return (
    <main>
      {albumDetail && (
        <>
          <section className={styles.album_detail}>
            <Image
              src={albumDetail.coverUrl ? albumDetail.coverUrl : defaultImage}
              width={200}
              height={200}
              alt="Album cover"
              priority
            />
            <h1>{albumDetail.name}</h1>
            <p>
              <Link href={`/artist/${albumDetail.artistId}`}>
                {albumDetail.artist}
              </Link>{' '}
              - {albumDetail.year}
            </p>
            <div className={styles.album_detail_buttons}>
              <button
                className={styles.like_album_button}
                type="button"
                onClick={() => {
                  if (isAlbumLiked) {
                    onDeleteLikeAlbum(albumDetail.id);
                  } else {
                    onLikeAlbum(albumDetail.id);
                  }
                }}
              >
                {isAlbumLiked ? <AiFillHeart /> : <AiOutlineHeart />}
              </button>
              <div>
                <button
                  className={`${styles.shuffle_button} ${
                    shuffle ? styles.active : ''
                  }`}
                  type="button"
                  onClick={() => setShuffle((current) => !current)}
                >
                  <FaShuffle />
                </button>
                <button
                  className={styles.play_all_button}
                  type="button"
                  onClick={() => playAll(albumDetail.songs)}
                >
                  <FaPlay />
                </button>
              </div>
            </div>
          </section>
          <SongsList
            songs={albumDetail.songs}
            onPlayHandler={playTrack}
            playlists={playlists}
            authUser={authUser ? authUser.id : ''}
            onLike={onLikeSong}
            onDeleteLike={onDeleteLikeSong}
          />
        </>
      )}
    </main>
  );
}

export default AlbumDetail;
