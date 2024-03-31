import { FaPlay, FaPause } from 'react-icons/fa6';
import styles from '../../_styles/player.module.css';

function DisplayTrack({
  currentlyPlaying,
  audioRef,
  setDuration,
  progressBarRef,
  handleNext,
  isPlaying,
  togglePlayPause,
}) {
  const onLoadedMetadata = () => {
    const seconds = audioRef.current.duration;
    setDuration(seconds);
    progressBarRef.current.max = seconds;
  };

  return (
    <div className={styles.track}>
      <audio
        src={currentlyPlaying ? currentlyPlaying.audio : null}
        ref={audioRef}
        onLoadedMetadata={onLoadedMetadata}
        onEnded={handleNext}
      />
      <div className="audio-info">
        <p className={styles.title}>
          {currentlyPlaying ? currentlyPlaying.title : '--'}
        </p>
        <p className={styles.artist}>
          {currentlyPlaying ? currentlyPlaying.artist : '--'}
        </p>
      </div>
      <button className={styles.play_button_mobile} onClick={togglePlayPause}>
        {isPlaying ? <FaPause /> : <FaPlay />}
      </button>
    </div>
  );
}

export default DisplayTrack;
