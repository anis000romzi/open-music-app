'use client';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AlbumInput from '@/app/_components/inputs/AlbumInput';
import { toast } from 'react-toastify';
import api from '@/app/_utils/api';
import styles from '../../../_styles/style.module.css';

function NewAlbum() {
  const router = useRouter();
  const [creating, setCreating] = useState(false);

  const authUser = useSelector((state) => state.authUser);

  if (!authUser || !authUser.is_active) {
    router.push('/');
    return null;
  }

  const addAlbum = async (name, year, file) => {
    try {
      setCreating(true);
      if (file && file.size > 512000) {
        throw new Error('File is too big');
      }

      const { albumId } = await api.createAlbum(name, year);
      if (file) {
        await api.addAlbumCover(albumId, file);
      }

      router.push('/');
      toast.success(<Link href={`/album/${albumId}`} style={{ textDecoration: 'underline' }}>Album created: {name}</Link>);
    } catch (error) {
      setCreating(false)
      toast.error(error.message);
    }
  };

  return (
    <main className={styles.new_album_page}>
      <h1>New Album</h1>
      <AlbumInput creating={creating} addAlbum={addAlbum} />
    </main>
  );
}

export default NewAlbum;
