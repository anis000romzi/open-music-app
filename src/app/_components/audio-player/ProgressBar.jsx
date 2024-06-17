import { formatTime } from '@/app/_utils/time-format';
import styles from '../../_styles/player.module.css';

function ProgressBar({ progressBarRef, audioRef, timeProgress, duration }) {
  const handleProgressChange = () => {
    audioRef.current.currentTime = progressBarRef.current.value;
  };

  return (
    <div
      className={styles.progress}
      onClick={(event) => event.stopPropagation()}
    >
      <span className={`${styles.time} current`}>
        {formatTime(timeProgress)}
      </span>
      <div className={styles.time_mobile}>
        <span>
          {formatTime(timeProgress)}
        </span>
        <span>{formatTime(duration)}</span>
      </div>
      <input
        type="range"
        ref={progressBarRef}
        defaultValue="0"
        onChange={handleProgressChange}
      />
      <span className={styles.time}>{formatTime(duration)}</span>
    </div>
  );
}

export default ProgressBar;
