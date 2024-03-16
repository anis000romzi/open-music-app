function SongItem({ id, title, username }) {
  return (
    <div className="song-item">
      <p>
        <strong>{title}</strong>
      </p>
      <p>{username}</p>
      <button type="button">PLAY</button>
    </div>
  );
}

export default SongItem;
