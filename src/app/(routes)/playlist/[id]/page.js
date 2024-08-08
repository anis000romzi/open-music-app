'use client';
import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import useInput from '@/app/_hooks/useInput';
import SongsList from '@/app/_components/songs/SongsList';
import Modal from '@/app/_components/Modal';
import Image from 'next/image';
import Cropper from 'react-easy-crop';
import {
  asyncReceivePlaylistDetail,
  asyncEditPlaylistDetail,
  asyncChangeCoverPlaylistDetail,
  asyncLikePlaylistDetail,
  asyncDeleteLikePlaylistDetail,
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
import shuffle from '@/app/_utils/shuffle';
import { AiOutlineClose, AiOutlineCheck } from 'react-icons/ai';
import { FaPen, FaUserPlus, FaPlay, FaShuffle, FaGlobe } from 'react-icons/fa6';
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai';
import { FaSearch, FaLock } from 'react-icons/fa';
import { getCroppedImg } from '@/app/_utils/get-cropped-img';
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
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [showCropModal, setShowCropModal] = useState(false);

  const isPlaylistLiked = playlistDetail?.likes.includes(authUser?.id || '');

  useEffect(() => {
    if (authUser) dispatch(asyncGetPlaylists());
    dispatch(asyncReceivePlaylistDetail(id));
  }, [dispatch, id, authUser]);

  const toggleEdit = () => setEdit(prev => !prev);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const openInfoModal = () => setIsInfoModalOpen(true);
  const closeInfoModal = () => setIsInfoModalOpen(false);

  const editPlaylist = useCallback((name, isPublic) => {
    dispatch(asyncEditPlaylistDetail({ playlistId: playlistDetail.id, name, isPublic }));
    setEdit(false);
  }, [dispatch, playlistDetail?.id]);

  const addCollaborator = useCallback((userId, userName) => {
    dispatch(asyncAddPlaylistCollaborator({ playlistId: playlistDetail.id, userId, userName }));
  }, [dispatch, playlistDetail?.id]);

  const deleteCollaborator = useCallback((userId) => {
    dispatch(asyncDeletePlaylistCollaborator(playlistDetail.id, userId));
  }, [dispatch, playlistDetail?.id]);

  const playAllSong = useCallback((tracks) => {
    dispatch(setNewTracksQueue(shuffleSongs ? shuffle(tracks) : tracks));
    dispatch(setIsPlaying(true));
  }, [dispatch, shuffleSongs]);

  const playTrack = useCallback((songId) => {
    dispatch(setNewTracksQueue(playlistDetail.songs));
    dispatch(setPlayingSongInQueue(songId));
    dispatch(setIsPlaying(true));
  }, [dispatch, playlistDetail?.songs]);

  const searchUser = useCallback((query) => {
    dispatch(asyncGetUsers(query));
  }, [dispatch]);

  const handleChangeCover = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageSrc(reader.result);
        setShowCropModal(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleCrop = useCallback(async () => {
    try {
      const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
      setCroppedImage(croppedImage);
      dispatch(asyncChangeCoverPlaylistDetail(playlistDetail.id, croppedImage));
      setImageSrc(null);
      setShowCropModal(false);
    } catch (e) {
      console.error(e);
    }
  }, [dispatch, imageSrc, croppedAreaPixels, playlistDetail?.id]);

  const handleLikePlaylist = useCallback((id, isLiked) => {
    dispatch(isLiked ? asyncDeleteLikePlaylistDetail(id) : asyncLikePlaylistDetail(id));
  }, [dispatch]);

  const handleLikeSong = useCallback((id, isLiked) => {
    dispatch(isLiked ? asyncDeletePlaylistDetailLikeSong(id) : asyncPlaylistDetailLikeSong(id));
  }, [dispatch]);

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
                    {showCropModal && (
                      <div className={styles.crop_modal}>
                        <div className={styles.crop_modal_content}>
                          <Cropper
                            image={imageSrc}
                            crop={crop}
                            zoom={zoom}
                            aspect={1}
                            onCropChange={setCrop}
                            onZoomChange={setZoom}
                            onCropComplete={onCropComplete}
                          />
                        </div>
                        <div className={styles.crop_buttons}>
                          <button onClick={handleCrop}>Save</button>
                          <button onClick={() => setShowCropModal(false)}>Cancel</button>
                        </div>
                      </div>
                    )}
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
                            onClick={() => editPlaylist(playlistName, playlistDetail.is_public)}
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
                  <strong>@{playlistDetail.username}</strong>{' '}
                  {playlistDetail.collaborators.length > 0 &&
                    `and ${
                      playlistDetail.collaborators.length > 1
                        ? `${playlistDetail.collaborators.length} others`
                        : `@${playlistDetail.collaborators[0].username}`
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
                {playlistDetail.ownerId === authUser?.id && (
                  <button
                    className={styles.add_collaborator}
                    type="button"
                    onClick={openModal}
                  >
                    Add Collaborators <FaUserPlus />
                  </button>
                )}
              </div>
              <div className={styles.playlist_buttons}>
                {playlistDetail.ownerId === authUser?.id ? (
                  playlistDetail.is_public ? (
                    <button
                      className={styles.visibility_playlist_button}
                      type="button"
                      onClick={() => editPlaylist(playlistDetail.name, false)}
                    >
                      <FaGlobe /> <span>Public</span>
                    </button>
                  ) : (
                    <button
                      className={styles.visibility_playlist_button}
                      type="button"
                      onClick={() => editPlaylist(playlistDetail.name, true)}
                    >
                      <FaLock /> <span>Private</span>
                    </button>
                  )
                ) : authUser ? (
                  <button
                    className={styles.like_playlist_button}
                    type="button"
                    onClick={() => handleLikePlaylist(playlistDetail.id, isPlaylistLiked)}
                  >
                    {isPlaylistLiked ? <AiFillHeart /> : <AiOutlineHeart />} <span>{playlistDetail.likes.length}</span>
                  </button>
                ) : (
                  <button
                    className={styles.like_playlist_button}
                    type="button"
                  >
                    <AiFillHeart /> <span>{playlistDetail.likes.length}</span>
                  </button>
                )}
                <div>
                  <button
                    className={`${styles.shuffle_button} ${
                      shuffleSongs ? styles.active : ''
                    }`}
                    type="button"
                    onClick={() => setShuffleSongs(prev => !prev)}
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
              if (user.id === authUser?.id) return null;

              return (
                <div key={user.id}>
                  <div>
                    <p>{user.fullname}</p>
                    <p>@{user.username}</p>
                  </div>
                  {playlistDetail?.collaborators.some(
                    (collaborator) => collaborator.id === user.id
                  ) ? (
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
            {playlistDetail?.collaborators.map((collaborator) => (
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
            ))}
          </div>
        </div>
      </Modal>
    </>
  );
}

export default PlaylistDetail;
