'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { FaVolumeXmark, FaVolumeLow, FaVolumeHigh } from 'react-icons/fa6';
import { useDispatch } from 'react-redux';
import { BiSkipPrevious, BiSkipNext } from 'react-icons/bi';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import Image from 'next/image';
import {
  setNewTracksQueue,
  setPlayingSongInQueue,
  setIsPlaying,
} from '@/app/_states/queue/action';
import TracksList from '../tracks/TracksList';
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
  isDetailOpen,
  queue,
  deleteTrackFromQueue,
}) {
  const [volume, setVolume] = useState(60);
  const [muteVolume, setMuteVolume] = useState(false);

  const dispatch = useDispatch();

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

  const playTrack = (songId) => {
    dispatch(setNewTracksQueue(queue));
    dispatch(setPlayingSongInQueue(songId));
    dispatch(setIsPlaying());
    localStorage.setItem(
      'tracks-queue-index',
      queue.findIndex((track) => track.id === songId)
    );
  };

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
    <div
      onClick={(event) => event.stopPropagation()}
      className={`${styles.detail_track} ${isDetailOpen ? styles.open : ''}`}
    >
      <Tabs className="Tabs">
        <TabList>
          <Tab>Info</Tab>
          <Tab>Queue</Tab>
        </TabList>
        <TabPanel>
          <div className={styles.detail_track_info}>
            <div className={styles.info}>
              <Image
                src={
                  currentlyPlaying.cover ? currentlyPlaying.cover : defaultImage
                }
                width={200}
                height={200}
                alt="Cover"
              />
              <p className={styles.detail_track_title}>
                {currentlyPlaying ? currentlyPlaying.title : '--'}
              </p>
              <p className={styles.detail_track_artist}>
                {currentlyPlaying ? currentlyPlaying.artist : '--'}
              </p>
            </div>
            <div className={styles.controls_detail}>
              <button onClick={handlePrevious}>
                <BiSkipPrevious />
              </button>
              <button onClick={handleNext}>
                <BiSkipNext />
              </button>
            </div>
            <div className={styles.volume_detail}>
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
        </TabPanel>
        <TabPanel>
          <TracksList
            tracks={queue}
            onPlayHandler={playTrack}
            onDeleteHandler={deleteTrackFromQueue}
            currentlyPlaying={currentlyPlaying}
          />
        </TabPanel>
      </Tabs>
    </div>
  );
}

export default DetailTrack;
