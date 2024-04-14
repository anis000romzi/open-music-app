import PlaylistItem from './PlaylistItem';

function PlaylistsList({ playlists }) {
  return (
    <section>
      {playlists.map((playlist) => (
        <PlaylistItem key={playlist.id} {...playlist} />
      ))}
    </section>
  );
}

export default PlaylistsList;
