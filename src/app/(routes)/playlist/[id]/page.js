'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import useInput from '@/app/_hooks/useInput';
import SongsList from '@/app/_components/songs/SongsList';
import Modal from '@/app/_components/Modal';
import Image from 'next/image';
import {
  asyncReceivePlaylistDetail,
  asyncEditPlaylistDetail,
  asyncChangeCoverPlaylistDetail,
  asyncPlaylistDetailLikeSong,
  asyncDeletePlaylistDetailLikeSong,
  asyncAddPlaylistCollaborator,
  asyncDeletePlaylistCollaborator,
} from '@/app/_states/playlistDetail/action';
import { asyncGetPlaylists } from '@/app/_states/playlists/action';
import { asyncGetUsers } from '@/app/_states/users/action';
import {
  setNewTracksQueue,
  setPlayingSongInQueue,
  setIsPlaying,
} from '@/app/_states/queue/action';
import { formatTimeString } from '@/app/_utils/time-format';
import { redirect } from 'next/navigation';
import shuffle from '@/app/_utils/shuffle';
import { AiOutlineClose, AiOutlineCheck } from 'react-icons/ai';
import { FaPen, FaUserPlus, FaPlay, FaShuffle, FaGlobe } from 'react-icons/fa6';
import { FaSearch, FaLock } from 'react-icons/fa';
import styles from '../../../_styles/style.module.css';
import modalStyles from '../../../_styles/modal.module.css';
import defaultImage from '../../../_assets/default-image.png';

function PlaylistDetail() {
  const dispatch = useDispatch();
  const { id } = useParams();

  const authUser = useSelector((state) => state.authUser);
  const playlists = useSelector((state) => state.playlists);
  const users = useSelector((state) => state.users);
  const playlistDetail = useSelector((state) => state.playlistDetail);

  const [userName, onUserNameChange] = useInput('');
  const [playlistName, onPlaylistNameChange, setPlaylistName] = useInput('');
  const [edit, setEdit] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [shuffleSongs, setShuffleSongs] = useState(false);

  useEffect(() => {
    if (!authUser || !authUser.is_active) {
      redirect('/');
    }
    dispatch(asyncGetPlaylists());
    dispatch(asyncReceivePlaylistDetail(id));
  }, [dispatch, id, authUser]);

  const toggleEdit = () => setEdit((prev) => !prev);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const openInfoModal = () => setIsInfoModalOpen(true);
  const closeInfoModal = () => setIsInfoModalOpen(false);

  const editPlaylist = (name, isPublic) => {
    dispatch(
      asyncEditPlaylistDetail({ playlistId: playlistDetail.id, name, isPublic })
    );
    setEdit(false);
  };

  const addCollaborator = (userId, userName) => {
    dispatch(
      asyncAddPlaylistCollaborator({
        playlistId: playlistDetail.id,
        userId,
        userName,
      })
    );
  };

  const deleteCollaborator = (userId) => {
    dispatch(asyncDeletePlaylistCollaborator(playlistDetail.id, userId));
  };

  const playAllSong = (tracks) => {
    if (shuffleSongs) {
      dispatch(setNewTracksQueue(shuffle(tracks)));
    } else {
      dispatch(setNewTracksQueue(tracks));
    }
    dispatch(setIsPlaying(true));
  };

  const playTrack = (songId) => {
    dispatch(setNewTracksQueue(playlistDetail.songs));
    dispatch(setPlayingSongInQueue(songId));
    dispatch(setIsPlaying(true));
  };

  const searchUser = (query) => {
    dispatch(asyncGetUsers(query));
  };

  const handleChangeCover = (event) => {
    const file = event.target.files[0];
    if (file) {
      dispatch(asyncChangeCoverPlaylistDetail(playlistDetail.id, file));
    }
  };

  const handleLikeSong = (id, isLiked) => {
    dispatch(
      isLiked
        ? asyncDeletePlaylistDetailLikeSong(id)
        : asyncPlaylistDetailLikeSong(id)
    );
  };

  return (
    <>
      <main className={styles.playlist_page}>
        {playlistDetail && (
          <>
            <section className={styles.playlist_detail}>
              <div className={styles.playlist_cover}>
                {playlistDetail.ownerId === authUser?.id ? (
                  <>
                    <input
                      style={{ display: 'none' }}
                      type="file"
                      id="cover"
                      name="cover"
                      onChange={handleChangeCover}
                    />
                    <label htmlFor="cover" className={styles.container}>
                      <Image
                        src={playlistDetail.cover || defaultImage}
                        width={200}
                        height={200}
                        alt="Playlist cover"
                        priority
                      />
                      <div className={styles.overlay}>
                        <div className={styles.text}>
                          <FaPen />
                        </div>
                      </div>
                    </label>
                  </>
                ) : (
                  <Image
                    src={playlistDetail.cover || defaultImage}
                    width={200}
                    height={200}
                    alt="Playlist cover"
                    priority
                  />
                )}
              </div>
              <div className={styles.playlist_info}>
                <div className={styles.playlist_info_title}>
                  {playlistDetail.ownerId === authUser?.id ? (
                    <>
                      {edit ? (
                        <form>
                          <input
                            type="text"
                            value={playlistName}
                            onChange={onPlaylistNameChange}
                            placeholder="Playlist Name"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              editPlaylist(
                                playlistName,
                                playlistDetail.is_public
                              )
                            }
                          >
                            <AiOutlineCheck />
                          </button>
                        </form>
                      ) : (
                        <h1>{playlistDetail.name}</h1>
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          setPlaylistName(playlistDetail.name);
                          toggleEdit();
                        }}
                      >
                        {edit ? <AiOutlineClose /> : <FaPen />}
                      </button>
                    </>
                  ) : (
                    <h1>{playlistDetail.name}</h1>
                  )}
                </div>
                <p
                  onClick={
                    playlistDetail.collaborators.length === 0
                      ? null
                      : openInfoModal
                  }
                  style={{ textDecoration: 'underline' }}
                >
                  <strong>{playlistDetail.username}</strong>{' '}
                  {playlistDetail.collaborators.length > 0 &&
                    `and ${
                      playlistDetail.collaborators.length > 1
                        ? `${playlistDetail.collaborators.length} others`
                        : playlistDetail.collaborators[0].username
                    }`}
                </p>
                <p>
                  {playlistDetail.songs.length} songs,{' '}
                  {formatTimeString(
                    playlistDetail.songs.reduce(
                      (acc, song) => acc + song.duration,
                      0
                    )
                  )}
                </p>
                {playlistDetail.ownerId === authUser?.id ? (
                  <button
                    className={styles.add_collaborator}
                    type="button"
                    onClick={openModal}
                  >
                    Add Collaborators <FaUserPlus />
                  </button>
                ) : null}
              </div>
              <div className={styles.playlist_buttons}>
                {playlistDetail.is_public ? (
                  <button
                    className={styles.save_playlist_button}
                    type="button"
                    onClick={
                      playlistDetail.ownerId === authUser?.id
                        ? () => editPlaylist(playlistDetail.name, false)
                        : null
                    }
                  >
                    <FaGlobe /> <span>Public</span>
                  </button>
                ) : (
                  <button
                    className={styles.save_playlist_button}
                    type="button"
                    onClick={
                      playlistDetail.ownerId === authUser?.id
                        ? () => editPlaylist(playlistDetail.name, true)
                        : null
                    }
                  >
                    <FaLock /> <span>Private</span>
                  </button>
                )}
                <div>
                  <button
                    className={`${styles.shuffle_button} ${
                      shuffleSongs ? styles.active : ''
                    }`}
                    type="button"
                    onClick={() => setShuffleSongs((prev) => !prev)}
                  >
                    <FaShuffle />
                  </button>
                  <button
                    className={styles.play_all_button}
                    type="button"
                    onClick={() => playAllSong(playlistDetail.songs)}
                  >
                    <FaPlay />
                  </button>
                </div>
              </div>
            </section>
            <SongsList
              songs={playlistDetail.songs}
              onPlayHandler={playTrack}
              playlists={playlists}
              authUser={authUser?.id}
              onLike={handleLikeSong}
              onDeleteLike={handleLikeSong}
            />
          </>
        )}
      </main>

      <Modal isModalOpen={isModalOpen} onClose={closeModal}>
        <div className={modalStyles.modal_header}>
          <strong>Add Collaborators</strong>
        </div>
        <div className={modalStyles.modal_body}>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              searchUser(userName);
            }}
            className={modalStyles.search_collaborators_form}
          >
            <input
              type="text"
              value={userName}
              onChange={onUserNameChange}
              placeholder="User name"
            />
            <button type="submit">
              <FaSearch />
            </button>
          </form>
          <div className={modalStyles.collaborators_container}>
            {users.map((user) => {
              if (user.id === authUser.id) {
                return;
              }

              return (
                <div key={user.id}>
                  <div>
                    <p>{user.fullname}</p>
                    <p>@{user.username}</p>
                  </div>
                  {playlistDetail?.collaborators.filter(
                    (collaborator) => collaborator.id === user.id
                  ).length > 0 ? (
                    ''
                  ) : (
                    <button
                      type="button"
                      onClick={() => addCollaborator(user.id, user.username)}
                    >
                      add
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </Modal>
      <Modal isModalOpen={isInfoModalOpen} onClose={closeInfoModal}>
        <div className={modalStyles.modal_header}>
          <strong>Collaborators</strong>
        </div>
        <div className={modalStyles.modal_body}>
          <div className={modalStyles.collaborators_container}>
            {playlistDetail?.collaborators.map((collaborator) => {
              return (
                <div key={collaborator.id}>
                  <p>@{collaborator.username}</p>
                  {playlistDetail.ownerId === authUser?.id && (
                    <button
                      type="button"
                      onClick={() => deleteCollaborator(collaborator.id)}
                    >
                      delete
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </Modal>
    </>
  );
}

export default PlaylistDetail;
