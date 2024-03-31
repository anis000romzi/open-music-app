'use client';
import styles from './_styles/style.module.css';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { asyncGetPopularAlbums } from './_states/popularAlbums/action';
import AlbumsList from './_components/albums/AlbumsList';

export default function Home() {
  const popularAlbums = useSelector((states) => states.popularAlbums);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(asyncGetPopularAlbums());
  }, [dispatch]);

  return (
    <main className={styles.main}>
      <section className="popular-album">
        <h2 className={styles.popular_album}>Popular Albums</h2>
        <AlbumsList albums={popularAlbums} />
      </section>
    </main>
  );
}
