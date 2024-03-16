import { useEffect } from 'react';
import { asyncPreloadProcess } from '@/app/_states/isPreload/action';
import { asyncUnsetAuthUser } from '@/app/_states/authUser/action';
import { useSelector, useDispatch } from 'react-redux';

const useAuthUser = () => {
  const authUser = useSelector((states) => states.authUser);
  const isPreload = useSelector((states) => states.isPreload);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(asyncPreloadProcess());
  }, [dispatch]);

  const logOut = () => {
    dispatch(asyncUnsetAuthUser());
  };

  return { authUser, isPreload, logOut};
};

export default useAuthUser;
