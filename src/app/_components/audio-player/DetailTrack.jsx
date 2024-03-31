import { useState, useEffect, useRef, useCallback } from 'react';
import {
  FaCaretLeft,
  FaCaretRight,
  FaVolumeXmark,
  FaVolumeLow,
  FaVolumeHigh,
} from 'react-icons/fa6';
import Image from 'next/image';
import styles from '../../_styles/player.module.css';
import defaultImage from '../../_assets/default-image.png';

function DetailTrack({
  currentlyPlaying,
  audioRef,
  progressBarRef,
  duration,
  setTimeProgress,
  handlePrevious,
  handleNext,
  isPlaying,
  setIsPlaying,
  isDetailOpen,
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
    <>
      <div
        onClick={(event) => event.stopPropagation()}
        className={`${styles.detail_track} ${isDetailOpen ? styles.open : ''}`}
      >
        <div className="detail_track_info">
          <Image src={defaultImage} width={200} height={200} alt="Cover" />
          <p className={styles.detail_track_title}>
            {currentlyPlaying ? currentlyPlaying.title : '--'}
          </p>
          <p className={styles.detail_track_artist}>
            {currentlyPlaying ? currentlyPlaying.artist : '--'}
          </p>
        </div>
        <div className={styles.controls}>
          <button onClick={handlePrevious}>
            <FaCaretLeft />
          </button>
          <button onClick={handleNext}>
            <FaCaretRight />
          </button>
        </div>
        <div className={styles.volume}>
          <button onClick={() => setMuteVolume((prev) => !prev)}>
            {muteVolume || volume < 5 ? (
              <FaVolumeXmark />
            ) : volume < 55 ? (
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
    </>
  );
}

export default DetailTrack;
