'use client';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { getTracksQueue } from '@/app/_states/tracks/action';
import AudioPlayer from './AudioPlayer';

function AudioPlayerWrapper() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getTracksQueue());
  }, [dispatch]);

  return <AudioPlayer />;
}

export default AudioPlayerWrapper;
