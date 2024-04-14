'use client';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import useInput from '@/app/_hooks/useInput';
import SongsList from '@/app/_components/songs/SongsList';
import { asyncGetPlaylists } from '@/app/_states/playlists/action';
import {
  setNewTracksQueue,
  setPlayingTrack,
  setIsPlaying,
} from '@/app/_states/tracks/action';
import styles from '../../_styles/input.module.css';
import api from '@/app/_utils/api';

function Search() {
  const pathname = usePathname();
  const dispatch = useDispatch();
  const router = useRouter();

  const [songs, setSongs] = useState([]);
  const playlists = useSelector((states) => states.playlists);

  const searchParams = useSearchParams();
  const [keyword, onKeywordChange] = useInput(searchParams.get('query') || '');

  useEffect(() => {
    dispatch(asyncGetPlaylists());
    const fetchData = async () => {
      const songs = await api.getSongs(searchParams.get('query'));
      setSongs(songs);
    };

    fetchData();
  }, [searchParams, dispatch]);

  const onSearch = async (event) => {
    event.preventDefault();
    const queryParam = { query: keyword };
    const params = new URLSearchParams(searchParams);

    Object.keys(queryParam).forEach((key) => {
      if (queryParam[key]) {
        params.set(key, queryParam[key]);
      } else {
        params.delete(key);
      }
    });

    const queryString = params.toString();
    const updatedPath = queryString ? `${pathname}?${queryString}` : pathname;

    router.push(updatedPath);

    const songs = await api.getSongs(searchParams.get('query'));
    setSongs(songs);
  };

  const playSong = (songId) => {
    dispatch(
      setNewTracksQueue(songs.songs.filter((song) => song.id === songId))
    );
    dispatch(setPlayingTrack(songId));
    dispatch(setIsPlaying());
    localStorage.setItem('tracks-queue-index', 0);
  };

  return (
    <main>
      <form onSubmit={onSearch} className={styles.search_input}>
        <input
          type="text"
          placeholder="Search ..."
          id="query"
          name="query"
          value={keyword}
          onChange={onKeywordChange}
        />
      </form>
      <section>
        <h2>Songs</h2>
        <SongsList
          songs={songs.songs}
          onPlayHandler={playSong}
          playlists={playlists}
        />
      </section>
    </main>
  );
}

export default Search;
