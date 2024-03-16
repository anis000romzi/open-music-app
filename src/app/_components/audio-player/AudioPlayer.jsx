'use client';
import { useRef, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import DisplayTrack from './DisplayTrack';
import ProgressBar from './ProgressBar';
import Controls from './Control';

function AudioPlayer() {
  const tracks = useSelector((states) => states.tracks);
  const [trackIndex, setTrackIndex] = useState(
    parseInt(localStorage.getItem('tracks-queue-index')) || 0
  );
  const [currentTrack, setCurrentTrack] = useState(tracks[trackIndex]);
  const [timeProgress, setTimeProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const audioRef = useRef();
  const progressBarRef = useRef();

  useEffect(() => {
    setCurrentTrack(tracks[trackIndex]);
  }, [tracks, trackIndex]);

  const handleNext = () => {
    if (trackIndex < tracks.length - 1) {
      setTrackIndex((prev) => {
        localStorage.setItem('tracks-queue-index', parseInt(prev) + 1);
        return parseInt(prev) + 1;
      });
      setCurrentTrack(tracks[trackIndex + 1]);
    }

    if (trackIndex >= tracks.length - 1) {
      setIsPlaying(false);
    }
  };

  return (
    <div
      className="audio-player"
      style={{ position: 'fixed', bottom: '0', width: '100%' }}
    >
      {tracks.length > 0 ? (
        <>
          <DisplayTrack
            {...{
              currentTrack,
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
              tracks,
              trackIndex,
              setTrackIndex,
              setCurrentTrack,
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
