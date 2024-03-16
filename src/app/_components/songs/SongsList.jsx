import SongItem from './SongItem';

function SongsList({ songs }) {
  return (
    <div className="songs-list">
      {songs && songs.map((song) => <SongItem key={song.id} {...song} />)}
    </div>
  );
}

export default SongsList;
