'use client';
import Link from 'next/link';
import { FaAngleLeft } from 'react-icons/fa6';
import { useSelector, useDispatch } from 'react-redux';
import { redirect, useRouter } from 'next/navigation';
import { asyncChangeEmailUser } from '@/app/_states/authUser/action';
import useInput from '@/app/_hooks/useInput';
import styles from '../../_styles/style.module.css';

function ChangeEmail() {
  const authUser = useSelector((states) => states.authUser);
  const [email, onEmailChange] = useInput('');

  const dispatch = useDispatch();
  const router = useRouter();

  if (authUser && authUser.is_active) {
    redirect('/');
  }

  const changeEmail = async (userId, email) => {
    dispatch(asyncChangeEmailUser(userId, email));
    router.push('/activate');
  };

  return (
    <main className={styles.change_email_page}>
      <h1>Change Email</h1>
      <Link className={styles.change_email_page__back} href="/">
        <FaAngleLeft />
      </Link>
      <input
        type="email"
        value={email}
        onChange={onEmailChange}
        placeholder="New email"
      />
      <button type="button" onClick={() => changeEmail(authUser.id, email)}>
        Change email
      </button>
    </main>
  );
}

export default ChangeEmail;
