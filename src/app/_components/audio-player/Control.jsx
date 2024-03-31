import { useState, useEffect, useRef, useCallback } from 'react';
import {
  FaPlay,
  FaPause,
  FaVolumeXmark,
  FaVolumeLow,
  FaVolumeHigh,
} from 'react-icons/fa6';
import styles from '../../_styles/player.module.css';

function Controls({
  audioRef,
  progressBarRef,
  duration,
  setTimeProgress,
  handlePrevious,
  handleNext,
  isPlaying,
  setIsPlaying,
}) {
  const [volume, setVolume] = useState(60);
  const [muteVolume, setMuteVolume] = useState(false);

  const togglePlayPause = () => {
    setIsPlaying((prev) => !prev);
  };

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

  useEffect(() => {
    if (audioRef) {
      audioRef.current.volume = volume / 100;
      audioRef.current.muted = muteVolume;
    }
  }, [volume, audioRef, muteVolume]);

  return (
    <div className={styles.controls_wrapper}>
      <div className="controls">
        <button onClick={handlePrevious}>PREVIOUS</button>

        <button onClick={togglePlayPause}>
          {isPlaying ? <FaPause /> : <FaPlay />}
        </button>
        <button onClick={handleNext}>NEXT</button>
      </div>
      <div className="volume">
        <button onClick={() => setMuteVolume((prev) => !prev)}>
          {muteVolume || volume < 5 ? (
            <FaVolumeXmark />
          ) : volume < 50 ? (
            <FaVolumeLow />
          ) : (
            <FaVolumeHigh />
          )}
        </button>
        <input
          type="range"
          min={0}
          max={100}
          value={volume}
          onChange={(e) => setVolume(e.target.value)}
          style={{
            background: `linear-gradient(to right, #FFFFFF ${volume}%, #212121 ${volume}%)`,
          }}
        />
      </div>
    </div>
  );
}

export default Controls;
