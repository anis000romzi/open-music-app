import SongItem from './SongItem';
import styles from '../../_styles/song.module.css';
import {
  asyncAddSongToPlaylist,
  asyncDeleteSongFromPlaylist,
} from '@/app/_states/playlists/action';
import Modal from '../Modal';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import modalStyles from '../../_styles/modal.module.css';
import { BsCheckSquareFill, BsSquare } from 'react-icons/bs';

function SongsList({
  songs,
  onPlayHandler,
  playlists,
  authUser,
  onLike,
  onDeleteLike,
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [songId, setSongId] = useState(false);
  const dispatch = useDispatch();

  const openCloseModal = () => {
    setIsModalOpen((current) => !current);
  };

  const addSongToPlaylist = (playlistId, songId) => {
    dispatch(asyncAddSongToPlaylist(playlistId, songId));
  };

  const deleteSongFromPlaylist = (playlistId, songId) => {
    dispatch(asyncDeleteSongFromPlaylist(playlistId, songId));
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
          {playlists.map((playlist) => (
            <div
              key={playlist.id}
              className={modalStyles.playlist_item}
              onClick={
                playlist.songs.includes(songId)
                  ? () => deleteSongFromPlaylist(playlist.id, songId)
                  : () => addSongToPlaylist(playlist.id, songId)
              }
            >
              {playlist.songs.includes(songId) ? (
                <BsCheckSquareFill />
              ) : (
                <BsSquare />
              )}
              <p>{playlist.name}</p>
            </div>
          ))}
        </Modal>
      )}
    </>
  );
}

export default SongsList;
