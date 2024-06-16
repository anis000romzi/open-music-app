'use client';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import VerificationInput from '@/app/_components/inputs/VerificationInput';
import { asyncUnsetAuthUser, asyncActivateUser } from '@/app/_states/authUser/action';
import { redirect } from 'next/navigation';
import api from '@/app/_utils/api';
import { CiLogout } from 'react-icons/ci';
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

  if (authUser.is_active) {
    redirect('/');
  }

  const { id, email } = authUser;
  const maskedEmail = email.replace(/^(\w{2})(\w+)(\w{2})(@[\w.]+)$/, '$1****$3$4');

  return (
    <main className={styles.activate_page}>
      <button className={styles.activate_page__logout} onClick={logOut}>
        <CiLogout />
      </button>
      <h1>Activate Your Account</h1>
      <p>
        OTP code will be sent to: {maskedEmail} <Link href="/changeemail">Change email</Link>
      </p>
      <VerificationInput verify={activateUser} userId={id} />
      <button className={styles.activate_page__send} onClick={() => sendCode(id)}>
        Send Code
      </button>
    </main>
  );
}

export default Activate;
