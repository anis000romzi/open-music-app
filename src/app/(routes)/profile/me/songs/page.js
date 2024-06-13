'use client';
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  asyncGetOwnedSongs,
  asyncEditSong,
  asyncDeleteSong,
  asyncChangeCoverSongs,
} from '@/app/_states/songs/action';
import { asyncGetOwnedAlbums } from '@/app/_states/albums/action';
import api from '@/app/_utils/api';
import EditableSongsList from '@/app/_components/songs/EditableSongsList';

function EditSongs() {
  const dispatch = useDispatch();
  const songs = useSelector((states) => states.songs);
  const albums = useSelector((states) => states.albums);
  const authUser = useSelector((states) => states.authUser);

  const [genres, setGenres] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const genres = await api.getGenres();

      setGenres(genres);
    };

    fetchData();
    dispatch(asyncGetOwnedAlbums());
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

  const deleteSong = (id) => {
    dispatch(asyncDeleteSong(id));
  };

  return (
    <main>
      {songs && (
        <EditableSongsList
          songs={songs}
          changeCover={changeCoverSong}
          editSong={editSong}
          deleteSong={deleteSong}
          albumsOption={albums}
          genresOption={genres}
        />
      )}
    </main>
  );
}

export default EditSongs;
