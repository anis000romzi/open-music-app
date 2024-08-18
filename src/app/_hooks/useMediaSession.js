import { useEffect, useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import {
  setPlayingSongInQueue,
  setIsPlaying,
} from '@/app/_states/queue/action';
import defaultImage from '../_assets/default-image.png';
import inferMimeTypes from '../_utils/infer-mime-types';

const useMediaSession = (mediaState) => {
  const dispatch = useDispatch();
  const [currentTrack, setCurrentTrack] = useState(mediaState.currentTrack);
  const [trackIndex, setTrackIndex] = useState(0);

  useEffect(() => {
    setTrackIndex(mediaState.queue.findIndex((track) => track.id === mediaState.currentTrack.id));
  }, [mediaState.currentTrack.id, mediaState.queue]);

  const handleTrackChange = useCallback((newIndex) => {
    const newTrackId = mediaState.queue[newIndex]?.id;
    if (newTrackId) {
      setTrackIndex(newIndex);
      dispatch(setPlayingSongInQueue(newTrackId));
      dispatch(setIsPlaying(true));
    }
  }, [dispatch, mediaState.queue]);


  useEffect(() => {
    if ('mediaSession' in navigator) {
      const updateMediaSession = () => {
        navigator.mediaSession.metadata = new MediaMetadata({
          title: mediaState?.currentTrack.title,
          artist: mediaState?.currentTrack.artist,
          album: mediaState?.currentTrack.album,
          artwork: [
            {
              src: mediaState?.currentTrack.cover || defaultImage,
              sizes: '512x512',
              type: inferMimeTypes(mediaState?.currentTrack.cover || ''),
            },
          ],
        });

        navigator.mediaSession.setActionHandler('play', () => {
          dispatch(setIsPlaying(true));
        });
        navigator.mediaSession.setActionHandler('pause', () => {
          dispatch(setIsPlaying(false));
        });
        navigator.mediaSession.setActionHandler('previoustrack', () => {
          handleTrackChange(trackIndex - 1)
        });
        navigator.mediaSession.setActionHandler('nexttrack', () => {
          handleTrackChange(trackIndex + 1)
        });
      };

      updateMediaSession();
    }
  }, [dispatch, handleTrackChange, mediaState?.currentTrack, trackIndex]);

  return {
    setCurrentTrack,
  };
};

export default useMediaSession;
