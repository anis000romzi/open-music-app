'use client';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  asyncGetOwnedAlbums,
  asyncEditAlbum,
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

  return (
    <main>
      <h1>Your Albums</h1>
      {albums && (
        <>
          <p>{albums.length} album(s)</p>
          <EditableAlbumsList albums={albums} changeCover={changeCoverAlbum} editAlbum={editAlbum} />
        </>
      )}
    </main>
  );
}

export default EditAlbums;
