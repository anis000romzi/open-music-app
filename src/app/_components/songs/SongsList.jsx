import SongItem from './SongItem';

function SongsList({ songs, onClickHandler }) {
  return (
    <div className="songs-list">
      {songs && songs.map((song) => <SongItem key={song.id} {...song} onPlay={onClickHandler} />)}
    </div>
  );
}

export default SongsList;
