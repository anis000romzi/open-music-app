'use client';
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  asyncGetOwnedSongs,
  asyncEditSong,
  asyncChangeCoverSongs,
} from '@/app/_states/songs/action';
import api from '@/app/_utils/api';
import EditableSongsList from '@/app/_components/songs/EditableSongsList';

function EditSongs() {
  const dispatch = useDispatch();
  const songs = useSelector((states) => states.songs);
  const authUser = useSelector((states) => states.authUser);

  const [ownedAlbums, setOwnedAlbums] = useState([]);
  const [genres, setGenres] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const albums = await api.getAlbumsByArtist(authUser.id);
      const genres = await api.getGenres();

      setOwnedAlbums(albums);
      setGenres(genres);
    };

    fetchData();
    dispatch(asyncGetOwnedSongs());
  }, [dispatch, authUser.id]);

  const changeCoverSong = (id, file) => {
    dispatch(asyncChangeCoverSongs(id, file));
  };

  const editSong = ({
    id,
    title,
    year,
    genre,
    genre_id,
    duration,
    album,
    album_id,
  }) => {
    dispatch(
      asyncEditSong({
        id,
        title,
        year,
        genre,
        genre_id,
        duration,
        album,
        album_id,
      })
    );
  };

  return (
    <main>
      <h1>Your Songs</h1>
      {songs && (
        <EditableSongsList
          songs={songs}
          changeCover={changeCoverSong}
          editSong={editSong}
          albumsOption={ownedAlbums}
          genresOption={genres}
        />
      )}
    </main>
  );
}

export default EditSongs;
