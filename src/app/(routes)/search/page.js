'use client';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { asyncGetSongs } from '@/app/_states/songs/action';
import useInput from '@/app/_hooks/useInput';
import SongsList from '@/app/_components/songs/SongsList';
import {
  setNewTracksQueue,
  setPlayingTrack,
} from '@/app/_states/tracks/action';

function Search() {
  const [keyword, onKeywordChange] = useInput('');
  const songs = useSelector((states) => states.songs);
  const { tracks = [] } = useSelector((states) => states.tracks);

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(asyncGetSongs(searchParams.get('query')));
  }, [searchParams, dispatch]);

  const onSearch = (event) => {
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
    dispatch(asyncGetSongs(searchParams.get('query')));
    event.preventDefault();
  };

  const playSong = (songId) => {
    dispatch(
      setNewTracksQueue(songs.songs.filter((song) => song.id === songId))
    );
    dispatch(setPlayingTrack(songId));
    localStorage.setItem(
      'tracks-queue-index',
      tracks.findIndex((track) => track.id === songId)
    );
  };

  return (
    <main>
      <h1>Search Page</h1>
      <form onSubmit={onSearch}>
        <input
          type="text"
          placeholder="Search ..."
          id="query"
          name="query"
          value={keyword}
          onChange={onKeywordChange}
        />
      </form>
      <SongsList songs={songs.songs} onClickHandler={playSong} />
    </main>
  );
}

export default Search;
