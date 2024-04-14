'use client';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { FaAngleLeft } from 'react-icons/fa6';
import { asyncSetAuthUser } from '@/app/_states/authUser/action';
import LoginInput from '@/app/_components/inputs/LoginInput';
import styles from '../../_styles/style.module.css';

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
    <main className={styles.login_page}>
      <h1>Wellcome to Open Music</h1>
      <Link className={styles.login_back} href="/">
        <FaAngleLeft />
      </Link>
      <LoginInput login={onLogin} />
      <Link className={styles.forgot_password} href="/forgotpassword">
        Forgot password?
      </Link>
    </main>
  );
}

export default Login;
