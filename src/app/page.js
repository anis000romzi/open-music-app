'use client';
import styles from './_styles/style.module.css';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { asyncGetPopularAlbums } from './_states/albums/action';
import { asyncGetPopularArtists } from './_states/users/action';
import { asyncGetPopularPlaylists } from './_states/playlists/action';
import {
  setNewTracksQueue,
  setPlayingSongInQueue,
  setIsPlaying,
} from './_states/queue/action';
import AlbumsList from './_components/albums/AlbumsList';
import ArtistsList from './_components/artists/ArtistsList';
import PopularPlaylistsList from './_components/playlists/PopularPlaylistsList';
import HistoryList from './_components/history/HistoryList';
import api from './_utils/api';

export default function Home() {
  const dispatch = useDispatch();
  const authUser = useSelector((states) => states.authUser);
  const albums = useSelector((states) => states.albums);
  const users = useSelector((states) => states.users);
  const playlists = useSelector((states) => states.playlists);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const history = await api.getHistory();
      setHistory(history);
    };

    dispatch(asyncGetPopularAlbums());
    dispatch(asyncGetPopularArtists());
    if (authUser) {
      dispatch(asyncGetPopularPlaylists());
      fetchData();
    }
  }, [dispatch, authUser]);

  const playSong = (songId) => {
    dispatch(setNewTracksQueue(history));
    dispatch(setPlayingSongInQueue(songId));
    dispatch(setIsPlaying(true));
  };

  return (
    <main>
      {history.length > 0 && (
        <section className="history">
          <h2 className={styles.popular_album}>History</h2>
          <HistoryList songs={history} onPlayHandler={playSong} />
        </section>
      )}
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
