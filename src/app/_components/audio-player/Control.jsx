import { useEffect, useRef, useCallback } from 'react';
import { FaPlay, FaPause } from 'react-icons/fa6';
import { BiSkipPrevious, BiSkipNext } from 'react-icons/bi';
import { TfiLoop } from 'react-icons/tfi';
import { LuShuffle } from 'react-icons/lu';
import styles from '../../_styles/player.module.css';

function Controls({
  loop,
  setLoop,
  handlePrevious,
  handleNext,
  setTimeProgress,
  isPlaying,
  duration,
  audioRef,
  progressBarRef,
  progressBarRef2,
  togglePlayPause,
}) {
  const playAnimationRef = useRef();

  const repeat = useCallback(() => {
    if (audioRef.current) {
      const currentTime = audioRef.current.currentTime;
      setTimeProgress(currentTime);
      if (progressBarRef.current) {
        progressBarRef.current.value = currentTime;
        progressBarRef.current.style.setProperty(
          '--range-progress',
          `${(progressBarRef.current.value / duration) * 100}%`
        );
      }
      if (progressBarRef2.current) {
        progressBarRef2.current.value = currentTime;
        progressBarRef2.current.style.setProperty(
          '--range-progress',
          `${(progressBarRef2.current.value / duration) * 100}%`
        );
      }
      playAnimationRef.current = requestAnimationFrame(repeat);
    }
  }, [duration, progressBarRef, progressBarRef2, audioRef, setTimeProgress]);

  useEffect(() => {
    if (audioRef.current) {
      isPlaying ? audioRef.current.play() : audioRef.current.pause();
      playAnimationRef.current = requestAnimationFrame(repeat);
    }
  }, [isPlaying, repeat, audioRef]);

  return (
    <div
      className={styles.controls_wrapper}
      onClick={(event) => event.stopPropagation()}
    >
      <div className={styles.control_buttons}>
        <button className={styles.shuffle}>
          <LuShuffle />
        </button>
        <button onClick={handlePrevious}>
          <BiSkipPrevious />
        </button>
        <button onClick={togglePlayPause}>
          {isPlaying ? <FaPause /> : <FaPlay />}
        </button>
        <button onClick={handleNext}>
          <BiSkipNext />
        </button>
        <button
          className={`${styles.loop} ${loop ? styles.active : ''}`}
          onClick={(event) => {
            event.stopPropagation();
            setLoop((current) => !current);
          }}
        >
          <TfiLoop />
        </button>
      </div>
    </div>
  );
}

export default Controls;
