import EditableSongItem from './EditableSongItem';

function EditableSongsList({
  songs,
  changeCover,
  editSong,
  albumsOption,
  genresOption,
}) {
  return (
    <div>
      {songs &&
        songs.map((song) => (
          <EditableSongItem
            key={song.id}
            {...song}
            changeCover={changeCover}
            editSong={editSong}
            albumsOption={albumsOption}
            genresOption={genresOption}
          />
        ))}
    </div>
  );
}

export default EditableSongsList;
