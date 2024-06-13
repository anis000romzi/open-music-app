'use client';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  asyncGetOwnedAlbums,
  asyncEditAlbum,
  asyncDeleteAlbum,
  asyncChangeCoverAlbums,
} from '@/app/_states/albums/action';
import EditableAlbumsList from '@/app/_components/albums/EditableAlbumsList';

function EditAlbums() {
  const dispatch = useDispatch();
  const albums = useSelector((states) => states.albums);

  useEffect(() => {
    dispatch(asyncGetOwnedAlbums());
  }, [dispatch]);

  const changeCoverAlbum = (id, file) => {
    dispatch(asyncChangeCoverAlbums(id, file));
  };

  const editAlbum = ({ id, name, year }) => {
    dispatch(asyncEditAlbum({ id, name, year }));
  };

  const deleteAlbum = (id) => {
    dispatch(asyncDeleteAlbum(id));
  };

  return (
    <main>
      {albums && (
        <EditableAlbumsList
          albums={albums}
          changeCover={changeCoverAlbum}
          editAlbum={editAlbum}
          deleteAlbum={deleteAlbum}
        />
      )}
    </main>
  );
}

export default EditAlbums;
