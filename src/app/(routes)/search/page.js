'use client';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import useInput from '@/app/_hooks/useInput';
import SongsList from '@/app/_components/songs/SongsList';
import { asyncGetPlaylists } from '@/app/_states/playlists/action';
import {
  asyncGetSongs,
  asyncLikeSong,
  asyncDeleteLikeSong,
} from '@/app/_states/songs/action';
import {
  setNewTracksQueue,
  setPlayingSongInQueue,
  setIsPlaying,
} from '@/app/_states/queue/action';
import styles from '../../_styles/input.module.css';

function Search() {
  const pathname = usePathname();
  const dispatch = useDispatch();
  const router = useRouter();

  const songs = useSelector((states) => states.songs);
  const playlists = useSelector((states) => states.playlists);
  const authUser = useSelector((states) => states.authUser);

  const searchParams = useSearchParams();
  const [keyword, onKeywordChange] = useInput(searchParams.get('query') || '');

  useEffect(() => {
    if (authUser) {
      dispatch(asyncGetPlaylists());
    }
  }, [dispatch, authUser]);

  useEffect(() => {
    dispatch(asyncGetSongs(searchParams.get('query')));
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
  };

  const playSong = (songId) => {
    dispatch(setNewTracksQueue(songs.filter((song) => song.id === songId)));
    dispatch(setPlayingSongInQueue(songId));
    dispatch(setIsPlaying());
    localStorage.setItem('tracks-queue-index', 0);
  };

  const onLike = (id) => {
    dispatch(asyncLikeSong(id));
  };

  const onDeleteLike = (id) => {
    dispatch(asyncDeleteLikeSong(id));
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
        {songs.length > 0 && (
          <>
            <SongsList
              songs={songs}
              onPlayHandler={playSong}
              playlists={playlists}
              authUser={authUser ? authUser.id : ''}
              onLike={onLike}
              onDeleteLike={onDeleteLike}
            />
          </>
        )}
      </section>
    </main>
  );
}

export default Search;
