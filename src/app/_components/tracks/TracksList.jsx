import TrackItem from './TrackItem';
import styles from '../../_styles/track.module.css'

function TracksList({
  tracks,
  onPlayHandler,
  onDeleteHandler,
  currentlyPlaying,
}) {
  return (
    <div className={styles.track_list}>
      {tracks &&
        tracks.map((track) => (
          <TrackItem
            key={track.id}
            {...track}
            onPlay={onPlayHandler}
            onDelete={onDeleteHandler}
            currentlyPlaying={currentlyPlaying}
          />
        ))}
    </div>
  );
}

export default TracksList;
