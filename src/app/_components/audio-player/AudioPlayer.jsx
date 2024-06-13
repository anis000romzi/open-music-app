'use client';
import { useRef, useState, useEffect, useCallback, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import useOpenNav from '@/app/_hooks/useOpenNav';
import { CSSTransition } from 'react-transition-group';
import DisplayTrack from './DisplayTrack';
import DetailTrack from './DetailTrack';
import ProgressBar from './ProgressBar';
import Controls from './Control';
import Volume from './Volume';
import { setPlayingSongInQueue, setIsPlaying, deleteSongFromQueue } from '@/app/_states/queue/action';
import { LuSettings } from 'react-icons/lu';
import { RiSpeedLine } from 'react-icons/ri';
import { FaAngleLeft } from 'react-icons/fa6';
import styles from '../../_styles/player.module.css';

function AudioPlayer() {
  const dispatch = useDispatch();
  const { currentlyPlaying = {}, queue = [], isPlaying } = useSelector((state) => state.queue);
  
  const [trackIndex, setTrackIndex] = useState(0);
  const [timeProgress, setTimeProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [loop, setLoop] = useState(false);
  const [activeSettingMenu, setActiveSettingMenu] = useState('main');
  const [menuHeight, setMenuHeight] = useState(null);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);

  const audioRef = useRef();
  const progressBarRef = useRef();
  const progressBarRef2 = useRef();
  const playAnimationRef = useRef();
  const [dropdownRef, dropdownOpen, setDropdownOpen] = useOpenNav();

  const repeat = useCallback(() => {
    if (audioRef.current) {
      const currentTime = audioRef.current.currentTime;
      setTimeProgress(currentTime);
      const progressPercent = `${(currentTime / duration) * 100}%`;
      if (progressBarRef.current) progressBarRef.current.style.setProperty('--range-progress', progressPercent);
      if (progressBarRef2.current) progressBarRef2.current.style.setProperty('--range-progress', progressPercent);
      playAnimationRef.current = requestAnimationFrame(repeat);
    }
  }, [duration]);

  useEffect(() => {
    const onLoadedMetadata = () => {
      const seconds = audioRef.current.duration;
      setDuration(seconds);
      if (progressBarRef.current) progressBarRef.current.max = seconds;
      if (progressBarRef2.current) progressBarRef2.current.max = seconds;
    };

    const checkCachedAudio = async () => {
      if ('caches' in window) {
        const cache = await caches.open('audio-cache');
        const response = await cache.match(currentlyPlaying.audio);
        if (response) {
          const blob = await response.blob();
          const objectUrl = URL.createObjectURL(blob);
          audioRef.current.src = objectUrl;
        }
      }
    };

    const currentAudioRef = audioRef.current;
    if (currentAudioRef) {
      currentAudioRef.addEventListener('loadedmetadata', onLoadedMetadata);
      checkCachedAudio();
    }

    return () => {
      if (currentAudioRef) currentAudioRef.removeEventListener('loadedmetadata', onLoadedMetadata);
    };
  }, [currentlyPlaying.audio]);

  useEffect(() => {
    if (audioRef.current) {
      isPlaying ? audioRef.current.play() : audioRef.current.pause();
      playAnimationRef.current = requestAnimationFrame(repeat);
    }
  }, [isPlaying, repeat]);

  useEffect(() => {
    setTrackIndex(queue.findIndex((track) => track.id === currentlyPlaying.id));
  }, [currentlyPlaying.id, queue]);

  useEffect(() => {
    if (dropdownRef.current?.firstChild) {
      setMenuHeight(dropdownRef.current.firstChild.offsetHeight);
    }
  }, [dropdownRef]);

  const calcHeight = (el) => setMenuHeight(el.offsetHeight);

  const handleTrackChange = useCallback((newIndex) => {
    const newTrackId = queue[newIndex]?.id;
    if (newTrackId) {
      setTrackIndex(newIndex);
      dispatch(setPlayingSongInQueue(newTrackId));
      dispatch(setIsPlaying(true));
    }
  }, [dispatch, queue]);

  const handleNext = useCallback(() => handleTrackChange(trackIndex + 1), [handleTrackChange, trackIndex]);
  const handlePrevious = useCallback(() => handleTrackChange(trackIndex - 1), [handleTrackChange, trackIndex]);
  const togglePlayPause = useCallback(() => dispatch(setIsPlaying(!isPlaying)), [dispatch, isPlaying]);

  const handleDetailOpen = (e) => {
    if (e.target.nodeName !== 'INPUT') setIsDetailOpen((prev) => !prev);
  };

  const handleSpeedChange = (speed) => {
    setPlaybackSpeed(speed);
    if (audioRef.current) audioRef.current.playbackRate = speed;
  };

  const speedOptions = useMemo(() => [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2], []);

  return queue.length > 0 ? (
    <div className={styles.audio_player} onClick={handleDetailOpen}>
      <DetailTrack
        currentlyPlaying={currentlyPlaying}
        progressBarRef={progressBarRef2}
        timeProgress={timeProgress}
        duration={duration}
        audioRef={audioRef}
        handlePrevious={handlePrevious}
        handleNext={handleNext}
        isPlaying={isPlaying}
        isDetailOpen={isDetailOpen}
        setIsDetailOpen={setIsDetailOpen}
        queue={queue}
        deleteTrackFromQueue={(songId) => dispatch(deleteSongFromQueue(songId))}
        togglePlayPause={togglePlayPause}
      />
      <div className={styles.music_bar}>
        <DisplayTrack
          currentlyPlaying={currentlyPlaying}
          audioRef={audioRef}
          setDuration={setDuration}
          progressBarRef={progressBarRef}
          loop={loop}
          handleNext={handleNext}
          isPlaying={isPlaying}
          togglePlayPause={togglePlayPause}
        />
        <div className={styles.music_control}>
          <Controls
            loop={loop}
            setLoop={setLoop}
            handlePrevious={handlePrevious}
            handleNext={handleNext}
            isPlaying={isPlaying}
            togglePlayPause={togglePlayPause}
          />
          <ProgressBar progressBarRef={progressBarRef} audioRef={audioRef} timeProgress={timeProgress} duration={duration} />
        </div>
        <div className={styles.music_setting} onClick={(e) => e.stopPropagation()}>
          <span className={styles.dropdown}>
            <button type="button" onClick={() => setDropdownOpen((prev) => !prev)}>
              <LuSettings />
            </button>
            <div ref={dropdownRef} className={`${styles.dropdown_buttons} ${dropdownOpen ? styles.show : ''}`} style={{ height: menuHeight }} id="myDropdown">
              <CSSTransition in={activeSettingMenu === 'main'} timeout={500} classNames="menu-primary" unmountOnExit onEnter={calcHeight}>
                <div>
                  <button onClick={() => setActiveSettingMenu('speed')}>
                    <RiSpeedLine /> Playback Speed
                  </button>
                </div>
              </CSSTransition>
              <CSSTransition in={activeSettingMenu === 'speed'} timeout={500} classNames="menu-secondary" unmountOnExit onEnter={calcHeight}>
                <div>
                  <button onClick={() => setActiveSettingMenu('main')}>
                    <FaAngleLeft /> Back
                  </button>
                  {speedOptions.map((speed) => (
                    <button key={speed} onClick={() => handleSpeedChange(speed)}>
                      {speed === 1 ? 'Normal' : `${speed}x`}
                    </button>
                  ))}
                </div>
              </CSSTransition>
            </div>
          </span>
          <Volume audioRef={audioRef} />
        </div>
      </div>
    </div>
  ) : null;
}

export default AudioPlayer;
