import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import useInput from '@/app/_hooks/useInput';
import Slider from 'react-slick';
import Modal from '../Modal';
import SongItem from './SongItem';
import {
  asyncAddSongToPlaylist,
  asyncDeleteSongFromPlaylist,
} from '@/app/_states/playlists/action';
import {
  setNewTracksQueue,
  setPlayingSongInQueue,
  setIsPlaying,
} from '@/app/_states/queue/action';
import { toast } from 'react-toastify';
import { asyncLikeSong, asyncDeleteLikeSong } from '@/app/_states/songs/action';
import api from '@/app/_utils/api';
import { BsCheckSquareFill, BsSquare } from 'react-icons/bs';
import styles from '../../_styles/song.module.css';
import modalStyles from '../../_styles/modal.module.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const PopularSongsList = ({ songs, authUser, playlists }) => {
  const dispatch = useDispatch();

  const [isPlaylistModalOpen, setIsPlaylistModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportReason, onReportReasonChange, setReportReason] = useInput('');
  const [reportDetail, onReportDetailChange, setReportDetail] = useInput('');
  const [songId, setSongId] = useState(null);

  const openClosePlaylistModal = () => {
    setIsPlaylistModalOpen((prev) => !prev);
  };

  const openCloseReportModal = () => {
    setIsReportModalOpen((prev) => !prev);
    setReportReason('');
    setReportDetail('');
  };

  const addSongToPlaylist = (playlistId) => {
    if (
      playlists
        .find((playlist) => playlist.id === playlistId)
        .songs.includes(songId)
    ) {
      dispatch(asyncDeleteSongFromPlaylist(playlistId, songId));
    } else {
      dispatch(asyncAddSongToPlaylist(playlistId, songId));
    }
  };

  const submitReport = async ({ songId, reason, detail }) => {
    try {
      await api.report({ songId, reason, detail });
      toast.success('Report submitted!');
      setIsReportModalOpen((prev) => !prev);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setReportReason('');
      setReportDetail('');
    }
  };

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
    <>
      <div className={styles.sliderContainer}>
        <Slider {...settings}>
          {songs.map((song, index) => (
            <SongItem
              key={index}
              {...song}
              onPlay={playSong}
              onOpenPlaylistModal={openClosePlaylistModal}
              onOpenReportModal={openCloseReportModal}
              setSong={setSongId}
              authUser={authUser?.id}
              onLike={handleLikeSong}
              onDeleteLike={handleLikeSong}
            />
          ))}
        </Slider>
      </div>

      {playlists.length > 0 && (
        <Modal
          isModalOpen={isPlaylistModalOpen}
          onClose={openClosePlaylistModal}
        >
          <div className={modalStyles.modal_header}>
            <strong>Add to playlist</strong>
          </div>
          <div className={modalStyles.modal_body}>
            {playlists.map((playlist) => (
              <div
                key={playlist.id}
                className={modalStyles.playlist_item}
                onClick={() => addSongToPlaylist(playlist.id)}
              >
                <p>{playlist.name}</p>
                {playlist.songs.includes(songId) ? (
                  <span className={modalStyles.playlist_checked}>
                    <BsCheckSquareFill />
                  </span>
                ) : (
                  <span>
                    <BsSquare />
                  </span>
                )}
              </div>
            ))}
          </div>
        </Modal>
      )}
      {authUser && (
        <Modal isModalOpen={isReportModalOpen} onClose={openCloseReportModal}>
          <div className={modalStyles.modal_header}>
            <strong>Report Song</strong>
          </div>
          <div className={modalStyles.modal_body}>
            <form className={modalStyles.report_form}>
              <select
                value={reportReason}
                id="reason"
                name="reason"
                onChange={onReportReasonChange}
              >
                <option value="">Select reason</option>
                <option value="copyright">Copyright</option>
                <option value="inappropriate-content">
                  Inappropriate Content
                </option>
                <option value="offensive-content">Offensive Content</option>
                <option value="spam">Spam</option>
              </select>
              <input
                type="text"
                value={reportDetail}
                onChange={onReportDetailChange}
                placeholder="Detail"
              />
              <button
                type="button"
                onClick={() =>
                  submitReport({
                    songId,
                    reason: reportReason,
                    detail: reportDetail,
                  })
                }
              >
                Submit
              </button>
            </form>
          </div>
        </Modal>
      )}
    </>
  );
};

export default PopularSongsList;
