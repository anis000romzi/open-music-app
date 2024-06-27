import { useState } from 'react';
import { useDispatch } from 'react-redux';
import Modal from '../Modal';
import SongItem from './SongItem';
import { asyncAddSongToPlaylist, asyncDeleteSongFromPlaylist } from '@/app/_states/playlists/action';
import { BsCheckSquareFill, BsSquare } from 'react-icons/bs';
import styles from '../../_styles/song.module.css';
import modalStyles from '../../_styles/modal.module.css';

function SongsList({ songs, onPlayHandler, playlists, authUser, onLike, onDeleteLike }) {
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [songId, setSongId] = useState(null);

  const openCloseModal = () => {
    setIsModalOpen((prev) => !prev);
  };

  const handleSongClick = (playlistId) => {
    if (playlists.find((playlist) => playlist.id === playlistId).songs.includes(songId)) {
      dispatch(asyncDeleteSongFromPlaylist(playlistId, songId));
    } else {
      dispatch(asyncAddSongToPlaylist(playlistId, songId));
    }
  };

  return (
    <>
      <div className={styles.song_list}>
        {songs && songs.map((song) => (
          <SongItem
            key={song.id}
            {...song}
            onPlay={onPlayHandler}
            onOpen={openCloseModal}
            setSong={setSongId}
            authUser={authUser}
            onLike={onLike}
            onDeleteLike={onDeleteLike}
          />
        ))}
      </div>

      {playlists.length > 0 && (
        <Modal isModalOpen={isModalOpen} onClose={openCloseModal}>
          <div className={modalStyles.modal_header}>
            <strong>Add to playlist</strong>
          </div>
          <div className={modalStyles.modal_body}>
            {playlists.map((playlist) => (
              <div
                key={playlist.id}
                className={modalStyles.playlist_item}
                onClick={() => handleSongClick(playlist.id)}
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
    </>
  );
}

export default SongsList;
