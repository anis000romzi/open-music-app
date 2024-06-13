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
  isPlaying,
  togglePlayPause,
}) {
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
