'use client';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import useInput from '@/app/_hooks/useInput';
import SongsList from '@/app/_components/songs/SongsList';
import AlbumsList from '@/app/_components/albums/AlbumsList';
import ArtistsList from '@/app/_components/artists/ArtistsList';
import { asyncGetPlaylists } from '@/app/_states/playlists/action';
import {
  asyncGetSongs,
  asyncLikeSong,
  asyncDeleteLikeSong,
} from '@/app/_states/songs/action';
import { asyncGetUsers } from '@/app/_states/users/action';
import { asyncGetAlbums } from '@/app/_states/albums/action';
import {
  setNewTracksQueue,
  setPlayingSongInQueue,
  setIsPlaying,
} from '@/app/_states/queue/action';
import { FaSearch } from 'react-icons/fa';
import styles from '../../_styles/style.module.css';
import inputStyles from '../../_styles/input.module.css';

function Search() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();

  const songs = useSelector((state) => state.songs);
  const albums = useSelector((state) => state.albums);
  const users = useSelector((state) => state.users);
  const playlists = useSelector((state) => state.playlists);
  const authUser = useSelector((state) => state.authUser);
  const [keyword, onKeywordChange] = useInput(searchParams.get('query') || '');

  useEffect(() => {
    if (authUser) {
      dispatch(asyncGetPlaylists());
    }
  }, [dispatch, authUser]);

  useEffect(() => {
    const query = searchParams.get('query');
    dispatch(asyncGetSongs(query));
    dispatch(asyncGetAlbums(query));
    dispatch(asyncGetUsers(query));
  }, [searchParams, dispatch]);

  const onSearch = (event) => {
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
  };

  const onLike = (id) => {
    dispatch(asyncLikeSong(id));
  };

  const onDeleteLike = (id) => {
    dispatch(asyncDeleteLikeSong(id));
  };

  return (
    <main className={styles.search_page}>
      <form onSubmit={onSearch} className={inputStyles.search_input}>
        <input
          type="text"
          placeholder="Search ..."
          id="query"
          name="query"
          value={keyword}
          onChange={onKeywordChange}
        />
        <button type="submit">
          <FaSearch />
        </button>
      </form>
      {albums.length > 0 && (
        <section>
          <h2>Albums</h2>
          <AlbumsList albums={albums} />
        </section>
      )}
      {users.length > 0 && (
        <section>
          <h2>Artists</h2>
          <ArtistsList artists={users} />
        </section>
      )}
      {songs.length > 0 && (
        <section>
          <h2>Songs</h2>
          <SongsList
            songs={songs}
            onPlayHandler={playSong}
            playlists={playlists}
            authUser={authUser?.id}
            onLike={onLike}
            onDeleteLike={onDeleteLike}
          />
        </section>
      )}
    </main>
  );
}

export default Search;
