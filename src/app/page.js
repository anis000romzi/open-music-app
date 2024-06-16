'use client';
import styles from './_styles/style.module.css';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { asyncGetPopularAlbums } from './_states/albums/action';
import { asyncGetPopularArtists } from './_states/users/action';
import { asyncGetPopularPlaylists } from './_states/playlists/action';
import AlbumsList from './_components/albums/AlbumsList';
import ArtistsList from './_components/artists/ArtistsList';
import PopularPlaylistsList from './_components/playlists/PopularPlaylistsList';

export default function Home() {
  const dispatch = useDispatch();
  const authUser = useSelector((states) => states.authUser);
  const albums = useSelector((states) => states.albums);
  const users = useSelector((states) => states.users);
  const playlists = useSelector((states) => states.playlists);

  useEffect(() => {
    dispatch(asyncGetPopularAlbums());
    dispatch(asyncGetPopularArtists());
    if (authUser) {
      dispatch(asyncGetPopularPlaylists());
    }
  }, [dispatch, authUser]);

  return (
    <main>
      {albums.length > 0 && (
        <section className="popular-album">
          <h2 className={styles.popular_album}>Popular Albums</h2>
          <AlbumsList albums={albums} />
        </section>
      )}
      {users.length > 0 && (
        <section className="popular-artist">
          <h2 className={styles.popular_album}>Popular Artists</h2>
          <ArtistsList artists={users} />
        </section>
      )}
      {authUser && playlists.length > 0 && (
        <section className="popular-playlist">
          <h2 className={styles.popular_album}>Popular playlists</h2>
          <PopularPlaylistsList playlists={playlists} />
        </section>
      )}
    </main>
  );
}
