'use client';
import { useDispatch } from 'react-redux';
import MediaSession from '@mebtte/react-media-session';
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
import { useEffect } from 'react';

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
  isPlaying,
  isDetailOpen,
  handleDetailOpen,
  queue,
  deleteTrackFromQueue,
  togglePlayPause,
}) {
  const dispatch = useDispatch();

  const playTrack = (songId) => {
    dispatch(setNewTracksQueue(queue));
    dispatch(setPlayingSongInQueue(songId));
    dispatch(setIsPlaying(true));
  };

  useEffect(() => {
    if (progressBarRef.current) progressBarRef.current.max = duration;
  }, [progressBarRef.current, duration]);

  if (isDetailOpen !== true) {
    document.getElementsByTagName("BODY")[0].style.overflow = 'auto';  
    return null;
    } else {
    document.getElementsByTagName("BODY")[0].style.overflow = 'hidden';
  }

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
      <Tabs className="Tabs">
        <TabList>
          <Tab>Info</Tab>
          <Tab>Queue</Tab>
        </TabList>
        <TabPanel>
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
              <DndProvider backend={TouchBackend} options={{ enableMouseEvents: true, delayTouchStart: 200 }}>
                <QueueList
                  queue={queue}
                  onPlayHandler={playTrack}
                  onDeleteHandler={deleteTrackFromQueue}
                  currentlyPlaying={currentlyPlaying}
                />
                <QueueItemDragLayer />
              </DndProvider>
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
                onClick={() => {}}
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
        </TabPanel>
        <TabPanel>
          <DndProvider backend={TouchBackend} options={{ enableMouseEvents: true, delayTouchStart: 200 }}>
            <QueueList
              queue={queue}
              onPlayHandler={playTrack}
              onDeleteHandler={deleteTrackFromQueue}
              currentlyPlaying={currentlyPlaying}
            />
            <QueueItemDragLayer />
          </DndProvider>
        </TabPanel>
      </Tabs>
      <MediaSession
        title={currentlyPlaying.title}
        artist={currentlyPlaying.artist}
        album={currentlyPlaying.album}
        onPlay={togglePlayPause}
        onPause={togglePlayPause}
        onPreviousTrack={handlePrevious}
        onNextTrack={handleNext}
      />
    </div>
  );
}

export default DetailTrack;
