import AlbumItem from './AlbumItem';

function AlbumsList({ albums }) {
  return (
    <div className="albums-list">
      {albums && albums.map((album) => <AlbumItem key={album.id} {...album} />)}
    </div>
  );
}

export default AlbumsList;
