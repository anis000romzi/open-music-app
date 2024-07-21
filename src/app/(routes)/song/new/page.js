'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import SongInput from '@/app/_components/inputs/SongInput';
import { toast } from 'react-toastify';
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
        throw new Error('Audio file cannot be empty');
      }

      if (audio.size > 100 * 1024 * 1024) {
        throw new Error('Audio file is too big');
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
      toast.error(error.message);
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
