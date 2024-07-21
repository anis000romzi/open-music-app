import { useState } from 'react';
import { useDispatch } from 'react-redux';
import useInput from '@/app/_hooks/useInput';
import Modal from '../Modal';
import SongItem from './SongItem';
import {
  asyncAddSongToPlaylist,
  asyncDeleteSongFromPlaylist,
} from '@/app/_states/playlists/action';
import { toast } from 'react-toastify';
import api from '@/app/_utils/api';
import { BsCheckSquareFill, BsSquare } from 'react-icons/bs';
import styles from '../../_styles/song.module.css';
import modalStyles from '../../_styles/modal.module.css';

function SongsList({
  songs,
  onPlayHandler,
  playlists,
  authUser,
  onLike,
  onDeleteLike,
}) {
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

  return (
    <>
      <div className={styles.song_list}>
        {songs &&
          songs.map((song) => (
            <SongItem
              key={song.id}
              {...song}
              onPlay={onPlayHandler}
              onOpenPlaylistModal={openClosePlaylistModal}
              onOpenReportModal={openCloseReportModal}
              setSong={setSongId}
              authUser={authUser}
              onLike={onLike}
              onDeleteLike={onDeleteLike}
            />
          ))}
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
}

export default SongsList;
