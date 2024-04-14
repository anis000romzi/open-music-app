'use client';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { CiLogout } from 'react-icons/ci';
import { useDispatch, useSelector } from 'react-redux';
import { asyncUnsetAuthUser } from '@/app/_states/authUser/action';
import { asyncActivateUser } from '@/app/_states/authUser/action';
import VerificationInput from '@/app/_components/inputs/VerificationInput';
import api from '@/app/_utils/api';
import styles from '../../_styles/style.module.css';

function Activate() {
  const authUser = useSelector((states) => states.authUser);
  const dispatch = useDispatch();

  const sendCode = async (userId) => {
    try {
      const message = await api.sendActivationCode(userId);
      alert(message);
    } catch (error) {
      alert(error.message);
    }
  };

  const logOut = () => {
    dispatch(asyncUnsetAuthUser());
  };

  const activateUser = (userId, otp) => {
    dispatch(asyncActivateUser(userId, otp));
  };

  if (!authUser) {
    redirect('/login');
  }

  if (authUser && authUser.is_active) {
    redirect('/');
  }

  return (
    <main className={styles.activate_page}>
      <button className={styles.activate_page__logout} onClick={logOut}>
        <CiLogout />
      </button>
      <h1>Activate Your Account</h1>
      {authUser ? (
        <>
          <p>
            OTP code will be sent to:{' '}
            {authUser.email.replace(
              /([a-zA-Z]{2})(.*)(?=[a-zA-Z]{2}@)/,
              (match, p1) => p1 + '****'
            )}{' '}
            <Link href="/changeemail">Change email</Link>
          </p>
          <VerificationInput verify={activateUser} userId={authUser.id} />
          <button
            className={styles.activate_page__send}
            onClick={() => sendCode(authUser.id)}
          >
            Send Code
          </button>
        </>
      ) : (
        ''
      )}
    </main>
  );
}

export default Activate;
