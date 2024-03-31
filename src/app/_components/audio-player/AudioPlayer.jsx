'use client';
import { useRef, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setPlayingTrack, setIsPlaying } from '@/app/_states/tracks/action';
import DisplayTrack from './DisplayTrack';
import ProgressBar from './ProgressBar';
import Controls from './Control';
import styles from '../../_styles/player.module.css';
import DetailTrack from './DetailTrack';

function AudioPlayer() {
  const {
    currentlyPlaying = {},
    tracks = [],
    isPlaying,
  } = useSelector((states) => states.tracks);
  const [trackIndex, setTrackIndex] = useState(0);
  const [timeProgress, setTimeProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  // const [isPlaying, setIsPlaying] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const dispatch = useDispatch();

  const audioRef = useRef();
  const progressBarRef = useRef();

  useEffect(() => {
    setTrackIndex(
      tracks.findIndex((track) => track.id === currentlyPlaying.id)
    );
  }, [currentlyPlaying.id, tracks]);

  const handleNext = () => {
    if (trackIndex < tracks.length - 1) {
      setTrackIndex((prev) => {
        localStorage.setItem('tracks-queue-index', parseInt(prev) + 1);
        return parseInt(prev) + 1;
      });
      dispatch(setPlayingTrack(tracks[trackIndex + 1].id));
    }
  };

  const handlePrevious = () => {
    if (trackIndex !== 0) {
      setTrackIndex((prev) => {
        localStorage.setItem('tracks-queue-index', parseInt(prev) - 1);
        return parseInt(prev) - 1;
      });
      dispatch(setPlayingTrack(tracks[trackIndex - 1].id));
      localStorage.setItem('tracks-queue-index', trackIndex);
    }
  };

  const togglePlayPause = (event) => {
    event.stopPropagation();
    dispatch(setIsPlaying());
  };

  return (
    <div
      className={styles.audio_player}
      onClick={(event) => {
        if (event.target.nodeName === 'INPUT') {
          return;
        }
        setIsDetailOpen((current) => !current);
      }}
    >
      {tracks.length > 0 ? (
        <>
          <DetailTrack
            {...{
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
            }}
          />
          <DisplayTrack
            {...{
              currentlyPlaying,
              audioRef,
              setDuration,
              progressBarRef,
              handleNext,
              isPlaying,
              togglePlayPause,
            }}
          />
          <Controls
            {...{
              audioRef,
              progressBarRef,
              duration,
              setTimeProgress,
              handlePrevious,
              handleNext,
              isPlaying,
              setIsPlaying,
            }}
          />
          <ProgressBar
            {...{ progressBarRef, audioRef, timeProgress, duration }}
          />
        </>
      ) : (
        'Play a music!'
      )}
    </div>
  );
}

export default AudioPlayer;
