function SongItem({ id, title, username, onPlay }) {
  return (
    <div className="song-item">
      <p>
        <strong>{title}</strong>
      </p>
      <p>{username}</p>
      <button type="button" onClick={() => onPlay(id)}>PLAY</button>
    </div>
  );
}

export default SongItem;
