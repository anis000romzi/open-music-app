import LikedAlbumItem from './LikedAlbumItem';

function LikedAlbumsList({ albums }) {
  return (
    <div>
      {albums &&
        albums.map((album) => <LikedAlbumItem key={album.id} {...album} />)}
    </div>
  );
}

export default LikedAlbumsList;
