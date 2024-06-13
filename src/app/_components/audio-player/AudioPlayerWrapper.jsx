'use client';
import { usePathname } from 'next/navigation';
import AudioPlayer from './AudioPlayer';

function AudioPlayerWrapper() {
  const pathname = usePathname();

  return (
    <>
      {['/activate', '/changeemail'].includes(pathname) ? '' : <AudioPlayer />}
    </>
  );
}

export default AudioPlayerWrapper;
