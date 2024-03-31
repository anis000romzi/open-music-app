import AlbumItem from './AlbumItem';
import styles from '../../_styles/style.module.css'

function AlbumsList({ albums }) {
  return (
    <div className={styles.albums_list}>
      {albums && albums.map((album) => <AlbumItem key={album.id} {...album} />)}
    </div>
  );
}

export default AlbumsList;
