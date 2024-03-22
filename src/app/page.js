'use client';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { asyncGetPopularAlbums } from './_states/popularAlbums/action';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';
import AlbumsList from './_components/albums/AlbumsList';

export default function Home() {
  const authUser = useSelector((states) => states.authUser);
  const popularAlbums = useSelector((states) => states.popularAlbums);

  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(asyncGetPopularAlbums());
  }, [dispatch]);

  return (
    <main>
      {authUser && (
        <>
          <button type="button" onClick={() => router.push('/album/new')}>
            New Album
          </button>
          <button type="button" onClick={() => router.push('/song/new')}>
            New Song
          </button>
        </>
      )}
      <section className="popular-album">
        <h2>Popular Albums</h2>
        <AlbumsList albums={popularAlbums} />
      </section>
    </main>
  );
}
