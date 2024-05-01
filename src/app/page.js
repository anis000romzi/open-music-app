'use client';
import styles from './_styles/style.module.css';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { asyncGetPopularAlbums } from './_states/albums/action';
import AlbumsList from './_components/albums/AlbumsList';

export default function Home() {
  const albums = useSelector((states) => states.albums);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(asyncGetPopularAlbums());
  }, [dispatch]);

  return (
    <main>
      <section className="popular-album">
        <h2 className={styles.popular_album}>Popular Albums</h2>
        <AlbumsList albums={albums} />
      </section>
      <section className="popular-artist">
        <h2 className={styles.popular_album}>Popular Artists</h2>
      </section>
    </main>
  );
}
