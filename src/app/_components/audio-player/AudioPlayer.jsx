'use client';
import { useRef, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  setPlayingSongInQueue,
  setIsPlaying,
  deleteSongFromQueue,
} from '@/app/_states/queue/action';
import DisplayTrack from './DisplayTrack';
import DetailTrack from './DetailTrack';
import ProgressBar from './ProgressBar';
import Controls from './Control';
import Volume from './Volume';
import styles from '../../_styles/player.module.css';

function AudioPlayer() {
  const dispatch = useDispatch();
  const {
    currentlyPlaying = {},
    queue = [],
    isPlaying,
  } = useSelector((states) => states.queue);

  const [trackIndex, setTrackIndex] = useState(0);
  const [timeProgress, setTimeProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const audioRef = useRef();
  const progressBarRef = useRef();

  useEffect(() => {
    setTrackIndex(queue.findIndex((track) => track.id === currentlyPlaying.id));
  }, [currentlyPlaying.id, queue]);

  const handleNext = (event) => {
    event.stopPropagation();
    if (trackIndex < queue.length - 1) {
      localStorage.setItem(
        'tracks-queue-index',
        queue.findIndex((track) => track.id === currentlyPlaying.id) + 1
      );
      setTrackIndex(
        queue.findIndex((track) => track.id === currentlyPlaying.id) + 1
      );
      dispatch(setPlayingSongInQueue(queue[trackIndex + 1].id));
    }
  };

  const handlePrevious = (event) => {
    event.stopPropagation();
    if (trackIndex !== 0) {
      localStorage.setItem(
        'tracks-queue-index',
        queue.findIndex((track) => track.id === currentlyPlaying.id) - 1
      );
      setTrackIndex(
        queue.findIndex((track) => track.id === currentlyPlaying.id) - 1
      );
      dispatch(setPlayingSongInQueue(queue[trackIndex - 1].id));
    }
  };

  const deleteTrackFromQueue = (songId) => {
    dispatch(deleteSongFromQueue(songId));
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
      {queue.length > 0 ? (
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
              queue,
              deleteTrackFromQueue,
            }}
          />
          <div className={styles.music_bar}>
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
            <div className={styles.music_control}>
              <Controls
                {...{
                  audioRef,
                  progressBarRef,
                  duration,
                  setTimeProgress,
                  handlePrevious,
                  handleNext,
                  isPlaying,
                  togglePlayPause,
                }}
              />
              <ProgressBar
                {...{ progressBarRef, audioRef, timeProgress, duration }}
              />
            </div>
            <Volume audioRef={audioRef} />
          </div>
        </>
      ) : (
        'Play a music!'
      )}
    </div>
  );
}

export default AudioPlayer;
