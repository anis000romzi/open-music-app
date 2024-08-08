import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Slider from 'react-slick';
import SongsList from './SongsList';
import SongItem from './SongItem';
import {
  setNewTracksQueue,
  setPlayingSongInQueue,
  setIsPlaying,
} from '@/app/_states/queue/action';
import { asyncLikeSong, asyncDeleteLikeSong } from '@/app/_states/songs/action';
import styles from '../../_styles/song.module.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const PopularSongsList = ({ songs }) => {
  const dispatch = useDispatch();

  const authUser = useSelector((state) => state.authUser);

  const settings = {
    dots: true,
    arrows: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    rows: 2,
    slidesPerRow: 2,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 750,
        settings: {
          arrows: false,
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          arrows: false,
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  const playSong = (songId) => {
    dispatch(setNewTracksQueue(songs));
    dispatch(setPlayingSongInQueue(songId));
    dispatch(setIsPlaying(true));
  };

  const handleLikeSong = (id, isLiked) => {
    dispatch(isLiked ? asyncDeleteLikeSong(id) : asyncLikeSong(id));
  };

  return (
    <div className={styles.sliderContainer}>
      <Slider {...settings}>
        {songs.map((song, index) => (
          <SongItem
            key={index}
            {...song}
            onPlay={playSong}
            // onOpenPlaylistModal={openClosePlaylistModal}
            // onOpenReportModal={openCloseReportModal}
            // setSong={setSongId}
            authUser={authUser?.id}
            onLike={handleLikeSong}
            onDeleteLike={handleLikeSong}
          />
        ))}
      </Slider>
    </div>
  );
};

export default PopularSongsList;
