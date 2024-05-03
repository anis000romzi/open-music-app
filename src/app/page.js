'use client';
import styles from './_styles/style.module.css';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { asyncGetPopularAlbums } from './_states/albums/action';
import { asyncGetPopularArtists } from './_states/users/action';
import AlbumsList from './_components/albums/AlbumsList';
import ArtistsList from './_components/artists/ArtistsList';

export default function Home() {
  const dispatch = useDispatch();
  const albums = useSelector((states) => states.albums);
  const users = useSelector((states) => states.users);

  useEffect(() => {
    dispatch(asyncGetPopularAlbums());
    dispatch(asyncGetPopularArtists());
  }, [dispatch]);

  return (
    <main>
      <section className="popular-album">
        <h2 className={styles.popular_album}>Popular Albums</h2>
        <AlbumsList albums={albums} />
      </section>
      <section className="popular-artist">
        <h2 className={styles.popular_album}>Popular Artists</h2>
        <ArtistsList artists={users} />
      </section>
    </main>
  );
}
