'use client';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FaPlay } from 'react-icons/fa6';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { asyncReceiveAlbumDetail } from '@/app/_states/albumDetail/action';
import {
  getTracksQueue,
  setNewTracksQueue,
  setPlayingTrack,
  setIsPlaying,
} from '@/app/_states/tracks/action';
import SongsList from '@/app/_components/songs/SongsList';
import defaultImage from '../../../_assets/default-image.png';
import styles from '../../../_styles/style.module.css';

function AlbumDetail() {
  const albumDetail = useSelector((states) => states.albumDetail);
  const { tracks = [] } = useSelector((states) => states.tracks);

  const dispatch = useDispatch();
  const { id } = useParams();

  useEffect(() => {
    dispatch(asyncReceiveAlbumDetail(id));
    dispatch(getTracksQueue());
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
      tracks.findIndex((track) => track.id === songId)
    );
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
            />
            <h1>{albumDetail.name}</h1>
            <p>
              <Link href={`/artist/${albumDetail.artistId}`}>
                {albumDetail.artist}
              </Link>{' '}
              - {albumDetail.year}
            </p>
            <button type="button" onClick={() => playAll(albumDetail.songs)}>
              <FaPlay />
            </button>
          </section>
          <SongsList songs={albumDetail.songs} onClickHandler={playTrack} />
        </>
      )}
    </main>
  );
}

export default AlbumDetail;
