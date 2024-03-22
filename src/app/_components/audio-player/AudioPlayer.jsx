'use client';
import { useRef, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setPlayingTrack } from '@/app/_states/tracks/action';
import DisplayTrack from './DisplayTrack';
import ProgressBar from './ProgressBar';
import Controls from './Control';

function AudioPlayer() {
  const { currentlyPlaying = {}, tracks = [] } = useSelector(
    (states) => states.tracks
  );
  const [trackIndex, setTrackIndex] = useState(0);
  const [timeProgress, setTimeProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

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

  return (
    <div
      className="audio-player"
      style={{
        position: 'fixed',
        bottom: '0',
        width: '100%',
        backgroundColor: 'black',
      }}
    >
      {tracks.length > 0 ? (
        <>
          <DisplayTrack
            {...{
              currentlyPlaying,
              audioRef,
              setDuration,
              progressBarRef,
              handleNext,
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
