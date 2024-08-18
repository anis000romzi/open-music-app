'use client';
import { useDispatch } from 'react-redux';
import Volume from './Volume';
import QueueList from '../queue/QueueList';
import QueueItemDragLayer from '../queue/QueueItemDragLayer';
import ProgressBar from './ProgressBar';
import Image from 'next/image';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { DndProvider } from 'react-dnd';
import { TouchBackend } from 'react-dnd-touch-backend';
import {
  setNewTracksQueue,
  setPlayingSongInQueue,
  setIsPlaying,
} from '@/app/_states/queue/action';
import { FaPlay, FaPause, FaAngleDown } from 'react-icons/fa6';
import { BiSkipPrevious, BiSkipNext } from 'react-icons/bi';
import { TfiLoop } from 'react-icons/tfi';
import { LuShuffle } from 'react-icons/lu';
import styles from '../../_styles/player.module.css';
import defaultImage from '../../_assets/default-image.png';
import { useEffect, useCallback } from 'react';

function DetailTrack({
  currentlyPlaying,
  progressBarRef,
  timeProgress,
  duration,
  audioRef,
  handlePrevious,
  handleNext,
  loop,
  setLoop,
  handleShuffle,
  isPlaying,
  isDetailOpen,
  handleDetailOpen,
  queue,
  deleteTrackFromQueue,
  togglePlayPause,
}) {
  const dispatch = useDispatch();

  const playTrack = useCallback((songId) => {
    dispatch(setNewTracksQueue(queue));
    dispatch(setPlayingSongInQueue(songId));
    dispatch(setIsPlaying(true));
  }, [dispatch, queue]);

  useEffect(() => {
    if (progressBarRef.current) {
      progressBarRef.current.max = duration;
    }
  }, [duration, progressBarRef.current]);

  useEffect(() => {
    setTimeout(() => {
      document.body.style.overflow = isDetailOpen ? 'hidden' : 'auto';
    }, 300)
    return () => {
      document.body.style.overflow = 'auto'; // Reset overflow on cleanup
    };
  }, [isDetailOpen]);

  return (
    <div
      onClick={(event) => event.stopPropagation()}
      className={`${styles.detail_track} ${isDetailOpen ? styles.open : ''}`}
    >
      <button
        className={styles.close_detail}
        type="button"
        onClick={handleDetailOpen}
      >
        <FaAngleDown />
      </button>
      <DndProvider backend={TouchBackend} options={{ enableMouseEvents: true, delayTouchStart: 200 }}>
        <Tabs className="Tabs">
          <TabList>
            <Tab>Info</Tab>
            <Tab>Queue</Tab>
          </TabList>
          <TabPanel>
            <TrackInfo
              currentlyPlaying={currentlyPlaying}
              queue={queue}
              playTrack={playTrack}
              deleteTrackFromQueue={deleteTrackFromQueue}
              progressBarRef={progressBarRef}
              audioRef={audioRef}
              timeProgress={timeProgress}
              duration={duration}
              handleShuffle={handleShuffle}
              handlePrevious={handlePrevious}
              togglePlayPause={togglePlayPause}
              handleNext={handleNext}
              isPlaying={isPlaying}
              loop={loop}
              setLoop={setLoop}
            />
          </TabPanel>
          <TabPanel>
            <QueueList
              queue={queue}
              onPlayHandler={playTrack}
              onDeleteHandler={deleteTrackFromQueue}
              currentlyPlaying={currentlyPlaying}
            />
            <QueueItemDragLayer />
          </TabPanel>
        </Tabs>
      </DndProvider>
    </div>
  );
}

function TrackInfo({
  currentlyPlaying,
  queue,
  playTrack,
  deleteTrackFromQueue,
  progressBarRef,
  audioRef,
  timeProgress,
  duration,
  handleShuffle,
  handlePrevious,
  togglePlayPause,
  handleNext,
  isPlaying,
  loop,
  setLoop
}) {
  return (
    <div className={styles.detail_track_info}>
      <div className={styles.info}>
        <Image
          src={currentlyPlaying.cover || defaultImage}
          width={200}
          height={200}
          alt="Cover"
          priority
        />
        <p className={styles.detail_track_title}>
          {currentlyPlaying.title || '--'}
        </p>
        <p className={styles.detail_track_artist}>
          {currentlyPlaying.artist || '--'}
        </p>
      </div>
      <div className={styles.queue_detail}>
        <QueueList
          queue={queue}
          onPlayHandler={playTrack}
          onDeleteHandler={deleteTrackFromQueue}
          currentlyPlaying={currentlyPlaying}
        />
        <QueueItemDragLayer />
      </div>
      <div className={styles.progress_bar_detail}>
        <ProgressBar
          progressBarRef={progressBarRef}
          audioRef={audioRef}
          timeProgress={timeProgress}
          duration={duration}
        />
      </div>
      <div className={styles.controls_detail}>
        <button
          type="button"
          className={styles.shuffle}
          onClick={handleShuffle}
        >
          <LuShuffle />
        </button>
        <button type="button" onClick={handlePrevious}>
          <BiSkipPrevious />
        </button>
        <button type="button" onClick={togglePlayPause}>
          {isPlaying ? <FaPause /> : <FaPlay />}
        </button>
        <button type="button" onClick={handleNext}>
          <BiSkipNext />
        </button>
        <button
          type="button"
          className={`${styles.loop} ${loop ? styles.active : ''}`}
          onClick={(event) => {
            event.stopPropagation();
            setLoop((current) => !current);
          }}
        >
          <TfiLoop />
        </button>
      </div>
      <div className={styles.volume_detail}>
        <Volume audioRef={audioRef} />
      </div>
    </div>
  );
}

export default DetailTrack;
