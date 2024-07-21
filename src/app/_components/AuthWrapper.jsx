'use client';
import { redirect } from 'next/navigation';
import { usePathname } from 'next/navigation';
import useAuthUser from '../_hooks/useAuthUser';
import HeaderBar from './HeaderBar';

function AuthWrapper({ children }) {
  const pathname = usePathname();
  const { authUser, isPreload, logOut } = useAuthUser();

  if (isPreload) {
    return null;
  }

  if (authUser && !authUser.is_active) {
    if (pathname !== '/changeemail' && pathname !== '/activate') {
      redirect('/activate');
    }
  }

  if (authUser && authUser.is_banned) {
    if (pathname !== '/banned') {
      redirect('/banned');
    }
  }

  return (
    <>
      {[
        '/login',
        '/register',
        '/activate',
        '/changeemail',
        '/forgotpassword',
        '/banned',
      ].includes(pathname) ? null : (
        <HeaderBar authUser={authUser} logOut={logOut} />
      )}
      {children}
    </>
  );
}

export default AuthWrapper;
