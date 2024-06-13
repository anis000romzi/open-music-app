import { FaPlay, FaPause } from 'react-icons/fa6';
import Image from 'next/image';
import styles from '../../_styles/player.module.css';
import defaultImage from '../../_assets/default-image.png';

function DisplayTrack({
  currentlyPlaying,
  audioRef,
  loop,
  handleNext,
  isPlaying,
  togglePlayPause,
}) {
  return (
    <div className={styles.track}>
      <audio
        id="audio"
        src={currentlyPlaying?.audio || null}
        ref={audioRef}
        onEnded={loop ? () => { audioRef.current.currentTime = 0; audioRef.current.play(); } : handleNext}
      />
      <div className={styles.info}>
        <Image
          src={currentlyPlaying.cover || defaultImage}
          width={45}
          height={45}
          alt="Cover"
        />
        <div>
          <p className={styles.title}>{currentlyPlaying.title || '--'}</p>
          <p className={styles.artist}>{currentlyPlaying.artist || '--'}</p>
        </div>
      </div>
      <button className={styles.play_button_mobile} onClick={(event) => {
        event.stopPropagation();
        togglePlayPause();
      }}>
        {isPlaying ? <FaPause /> : <FaPlay />}
      </button>
    </div>
  );
}

export default DisplayTrack;
