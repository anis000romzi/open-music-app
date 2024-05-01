import EditableAlbumItem from './EditableAlbumItem';

function EditableAlbumsList({ albums, changeCover, editAlbum }) {
  return (
    <div className="">
      {albums &&
        albums.map((album) => (
          <EditableAlbumItem
            key={album.id}
            {...album}
            changeCover={changeCover}
            editAlbum={editAlbum}
          />
        ))}
    </div>
  );
}

export default EditableAlbumsList;
