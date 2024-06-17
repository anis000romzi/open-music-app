'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import SongInput from '@/app/_components/inputs/SongInput';
import api from '@/app/_utils/api';
import styles from '../../../_styles/style.module.css';

function NewSong() {
  const router = useRouter();
  const authUser = useSelector((state) => state.authUser);

  const [ownedAlbums, setOwnedAlbums] = useState([]);
  const [genres, setGenres] = useState([]);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const albums = await api.getAlbumsByArtist(authUser.id);
      const genres = await api.getGenres();
      setOwnedAlbums(albums);
      setGenres(genres);
    };

    fetchData();
  }, [authUser.id]);

  if (!authUser || !authUser.is_active) {
    redirect('/');
    return null;
  }

  const addSong = async ({ title, year, genre, duration, albumId, audio, cover }) => {
    try {
      setCreating(true);
      if (!audio) {
        throw new Error('Audio cannot be empty');
      }

      if (audio.size > 51200000) {
        throw new Error('Audio is too big');
      }

      const { songId } = await api.createSong({
        title,
        year,
        genre,
        duration,
        albumId,
      });
      await api.addSongAudio(songId, audio);

      if (cover) {
        await api.addSongCover(songId, cover);
      }

      router.push('/');
    } catch (error) {
      setCreating(false);
      alert(error);
    }
  };

  return (
    <main className={styles.new_song_page}>
      <h1>New Song</h1>
      <SongInput creating={creating} addSong={addSong} ownedAlbums={ownedAlbums} genres={genres} />
    </main>
  );
}

export default NewSong;
