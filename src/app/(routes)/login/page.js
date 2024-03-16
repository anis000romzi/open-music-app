'use client';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { asyncSetAuthUser } from '@/app/_states/authUser/action';
import LoginInput from '@/app/_components/inputs/LoginInput';

function Login() {
  const authUser = useSelector((states) => states.authUser);
  const dispatch = useDispatch();

  const onLogin = ({ usernameOrEmail, password }) => {
    dispatch(asyncSetAuthUser({ usernameOrEmail, password }));
  };

  if (authUser) {
    redirect('/');
  }

  return (
    <div>
      <h1>Login Page</h1>
      <Link href="/">{'<'}</Link>
      <LoginInput login={onLogin} />
      <Link href="/register">Register</Link>
      <Link href="/forgotpassword">Forgot password?</Link>
    </div>
  );
}

export default Login;
