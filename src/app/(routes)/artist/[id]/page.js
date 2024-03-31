'use client';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'next/navigation';
import { asyncReceiveUserDetail } from '@/app/_states/userDetail/action';
import AlbumsList from '@/app/_components/albums/AlbumsList';
import styles from '../../../_styles/style.module.css';
import Image from 'next/image';

function Artist() {
  const userDetail = useSelector((states) => states.userDetail);

  const dispatch = useDispatch();
  const { id } = useParams();

  useEffect(() => {
    dispatch(asyncReceiveUserDetail(id));
  }, [dispatch, id]);

  return (
    <main>
      {userDetail && (
        <>
          <section className={styles.user_detail}>
            <Image
              src={userDetail.picture}
              width={70}
              height={70}
              alt="Profile picture"
            />
            <h1>{userDetail.fullname}</h1>
            <p>
              {userDetail.description
                ? userDetail.description
                : 'No description'}
            </p>
          </section>
          <section className={styles.user_discography}>
            <h2>Discography</h2>
            <div>
              <p>Albums</p>
              <AlbumsList albums={userDetail.albums} />
            </div>
          </section>
        </>
      )}
    </main>
  );
}

export default Artist;
