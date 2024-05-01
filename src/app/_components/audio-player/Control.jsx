import { useEffect, useRef, useCallback } from 'react';
import { FaPlay, FaPause } from 'react-icons/fa6';
import { BiSkipPrevious, BiSkipNext } from 'react-icons/bi';
import styles from '../../_styles/player.module.css';

function Controls({
  audioRef,
  progressBarRef,
  duration,
  setTimeProgress,
  handlePrevious,
  handleNext,
  isPlaying,
  togglePlayPause,
}) {
  const playAnimationRef = useRef();

  const repeat = useCallback(() => {
    const currentTime = audioRef.current ? audioRef.current.currentTime : 0;
    setTimeProgress(currentTime);
    if (progressBarRef.current) {
      progressBarRef.current.value = currentTime;
      progressBarRef.current.style.setProperty(
        '--range-progress',
        `${(progressBarRef.current.value / duration) * 100}%`
      );

      playAnimationRef.current = requestAnimationFrame(repeat);
    }
  }, [audioRef, duration, progressBarRef, setTimeProgress]);

  useEffect(() => {
    if (isPlaying) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
    playAnimationRef.current = requestAnimationFrame(repeat);
  }, [isPlaying, audioRef, repeat]);

  return (
    <div className={styles.controls_wrapper}>
      <div className={styles.control_buttons}>
        <button onClick={handlePrevious}>
          <BiSkipPrevious />
        </button>

        <button onClick={togglePlayPause}>
          {isPlaying ? <FaPause /> : <FaPlay />}
        </button>
        <button onClick={handleNext}>
          <BiSkipNext />
        </button>
      </div>
    </div>
  );
}

export default Controls;
