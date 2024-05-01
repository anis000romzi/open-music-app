'use client';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { usePathname } from 'next/navigation';
import { getTracksQueue } from '@/app/_states/queue/action';
import AudioPlayer from './AudioPlayer';

function AudioPlayerWrapper() {
  const pathname = usePathname();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getTracksQueue());
  }, [dispatch]);

  return (
    <>
      {[
        '/activate',
        '/changeemail'
      ].includes(pathname) ? (
        ''
        ) : (
        <AudioPlayer />
      )}
    </>
  );
}

export default AudioPlayerWrapper;
