function SongItem({ id, title, artist, onPlay }) {
  return (
    <div className="song-item">
      <p>
        <strong>{title}</strong>
      </p>
      <p>{artist}</p>
      <button type="button" onClick={() => onPlay(id)}>PLAY</button>
    </div>
  );
}

export default SongItem;
