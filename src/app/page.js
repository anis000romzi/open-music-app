'use client';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { asyncGetPopularAlbums } from './_states/popularAlbums/action';
import styles from './page.module.css';
import AlbumsList from './_components/albums/AlbumsList';

export default function Home() {
  const popularAlbums = useSelector((states) => states.popularAlbums);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(asyncGetPopularAlbums());
  }, [dispatch]);

  return (
    <main>
      <section className="popular-album">
        <h2>Popular Albums</h2>
        <AlbumsList albums={popularAlbums} />
      </section>
    </main>
  );
}
