'use client';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { asyncReceiveAlbumDetail } from '@/app/_states/albumDetail/action';
import { getTracksQueue, setNewTracksQueue } from '@/app/_states/tracks/action';
import SongsList from '@/app/_components/songs/SongsList';
import defaultImage from '../../../_assets/default-image.png';

function AlbumDetail() {
  const albumDetail = useSelector((states) => states.albumDetail);

  const dispatch = useDispatch();
  const { id } = useParams();

  useEffect(() => {
    dispatch(asyncReceiveAlbumDetail(id));
    dispatch(getTracksQueue());
  }, [dispatch, id]);

  const setQueue = (tracks) => {
    dispatch(setNewTracksQueue(tracks));
  };

  return (
    <main>
      {albumDetail && (
        <div>
          <section>
            <Image
              src={albumDetail.cover ? albumDetail.cover : defaultImage}
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
            <button type="button" onClick={() => setQueue(albumDetail.songs)}>
              PLAY ALL
            </button>
          </section>
          <SongsList songs={albumDetail.songs} />
        </div>
      )}
    </main>
  );
}

export default AlbumDetail;
