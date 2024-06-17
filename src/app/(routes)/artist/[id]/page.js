'use client';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import AlbumsList from '@/app/_components/albums/AlbumsList';
import SongsList from '@/app/_components/songs/SongsList';
import {
  asyncReceiveUserDetail,
  asyncFollowUserDetail,
  asyncUnfollowUserDetail,
  asyncUserDetailLikeSingle,
  asyncDeleteUserDetailLikeSingle,
} from '@/app/_states/userDetail/action';
import { asyncGetPlaylists } from '@/app/_states/playlists/action';
import {
  setNewTracksQueue,
  setPlayingSongInQueue,
  setIsPlaying,
} from '@/app/_states/queue/action';
import styles from '../../../_styles/style.module.css';

function Artist() {
  const { id } = useParams();
  const dispatch = useDispatch();

  const userDetail = useSelector((state) => state.userDetail);
  const authUser = useSelector((state) => state.authUser);
  const playlists = useSelector((state) => state.playlists);

  const isUserFollowed = userDetail?.followers.includes(authUser?.id);

  useEffect(() => {
    if (authUser) dispatch(asyncGetPlaylists());
    dispatch(asyncReceiveUserDetail(id));
  }, [dispatch, id, authUser]);

  const handleFollowToggle = () => {
    dispatch(isUserFollowed ? asyncUnfollowUserDetail(userDetail.id) : asyncFollowUserDetail(userDetail.id));
  };

  const playSong = (songId) => {
    dispatch(setNewTracksQueue(userDetail.singles));
    dispatch(setPlayingSongInQueue(songId));
    dispatch(setIsPlaying(true));
  };

  const handleLikeSong = (id, isLiked) => {
    dispatch(
      isLiked
        ? asyncDeleteUserDetailLikeSingle(id)
        : asyncUserDetailLikeSingle(id)
    );
  };

  if (!userDetail) return null;

  return (
    <main className={styles.artist_detail_page}>
      <section className={styles.user_detail}>
        <div className={styles.user_picture}>
          <Image src={userDetail.picture} width={150} height={150} alt="Profile picture" priority />
        </div>
        <div className={styles.user_info}>
          <div>
            <h1>{userDetail.fullname}</h1>
            <p>@{userDetail.username}</p>
          </div>
          <p>
            {userDetail.followers.length} followers • {userDetail.albums.length} albums • {userDetail.singles.length} singles
          </p>
          {authUser && userDetail.id !== authUser.id && (
            <button
              className={`${styles.follow_button} ${isUserFollowed ? styles.followed : ''}`}
              type="button"
              onClick={handleFollowToggle}
            >
              {isUserFollowed ? 'Following' : 'Follow'}
            </button>
          )}
        </div>
      </section>
      <section className={styles.user_discography}>
        {userDetail.albums.length > 0 && (
          <div>
            <h2>{`${userDetail.fullname}'s Albums`}</h2>
            <AlbumsList albums={userDetail.albums} />
          </div>
        )}
        {userDetail.singles.length > 0 && (
          <div>
            <h2>{`${userDetail.fullname}'s Singles`}</h2>
            <SongsList
              songs={userDetail.singles}
              onPlayHandler={playSong}
              playlists={playlists}
              authUser={authUser?.id}
              onLike={handleLikeSong}
              onDeleteLike={handleLikeSong}
            />
          </div>
        )}
      </section>
      <section className={styles.user_description}>
        <h2>About {userDetail.fullname}</h2>
        <p>{userDetail.description || 'No Description'}</p>
      </section>
    </main>
  );
}

export default Artist;
