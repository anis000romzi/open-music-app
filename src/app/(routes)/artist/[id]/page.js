'use client';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'next/navigation';
import { asyncReceiveUserDetail } from '@/app/_states/userDetail/action';
import AlbumsList from '@/app/_components/albums/AlbumsList';

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
          <h1>{userDetail.fullname}</h1>
          <p>
            {userDetail.description ? userDetail.description : 'No description'}
          </p>
          <br />
          <h2>Discography</h2>
          <p>Albums</p>
          <AlbumsList albums={userDetail.albums} />
        </>
      )}
    </main>
  );
}

export default Artist;
