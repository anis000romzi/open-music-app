import { useState, useEffect } from 'react';
import { FaVolumeXmark, FaVolumeLow, FaVolumeHigh } from 'react-icons/fa6';
import styles from '../../_styles/player.module.css';

function Volume({ audioRef }) {
  const [volume, setVolume] = useState(60);
  const [muteVolume, setMuteVolume] = useState(false);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
      audioRef.current.muted = muteVolume;
    }
  }, [volume, audioRef, muteVolume]);

  const toggleMute = () => setMuteVolume((prev) => !prev);
  const handleVolumeChange = (event) => setVolume(event.target.value);

  const getVolumeIcon = () => {
    if (muteVolume || volume < 5) return <FaVolumeXmark />;
    if (volume < 50) return <FaVolumeLow />;
    return <FaVolumeHigh />;
  };

  return (
    <div className={styles.volume_audio}>
      <button onClick={toggleMute}>{getVolumeIcon()}</button>
      <input
        type="range"
        min={0}
        max={100}
        value={volume}
        onChange={handleVolumeChange}
        style={{
          background: `linear-gradient(to right, #FFFFFF ${volume}%, #212121 ${volume}%)`,
        }}
      />
    </div>
  );
}

export default Volume;
