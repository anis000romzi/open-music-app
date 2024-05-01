import { useState, useEffect, useRef, useCallback } from 'react';
import { FaVolumeXmark, FaVolumeLow, FaVolumeHigh } from 'react-icons/fa6';
import styles from '../../_styles/player.module.css';

function Volume({ audioRef }) {
  const [volume, setVolume] = useState(60);
  const [muteVolume, setMuteVolume] = useState(false);

  useEffect(() => {
    if (audioRef) {
      audioRef.current.volume = volume / 100;
      audioRef.current.muted = muteVolume;
    }
  }, [volume, audioRef, muteVolume]);

  return (
    <div
      className={styles.volume_audio}
      onClick={(event) => event.preventDefault()}
    >
      <button
        onClick={() => {
          setMuteVolume((prev) => !prev);
        }}
      >
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
        onChange={() => {
          setVolume(event.target.value);
        }}
        style={{
          background: `linear-gradient(to right, #FFFFFF ${volume}%, #212121 ${volume}%)`,
        }}
      />
    </div>
  );
}

export default Volume;
