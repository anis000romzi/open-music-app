'use client';
import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import VerificationInput from '@/app/_components/inputs/VerificationInput';
import {
  asyncUnsetAuthUser,
  asyncActivateUser,
} from '@/app/_states/authUser/action';
import { redirect } from 'next/navigation';
import { toast } from 'react-toastify';
import api from '@/app/_utils/api';
import { formatTime } from '@/app/_utils/time-format';
import { CiLogout } from 'react-icons/ci';
import styles from '../../_styles/style.module.css';

const initialTime = 60 * 2;

function Activate() {
  const [timeLeft, setTimeLeft] = useState(() => {
    const savedTime = sessionStorage.getItem('time-left');
    return savedTime ? parseInt(savedTime, 10) : initialTime;
  });
  const [isSent, setIsSent] = useState(() => {
    const sentStatus = sessionStorage.getItem('sent');
    return !!sentStatus;
  });

  const authUser = useSelector((state) => state.authUser);
  const dispatch = useDispatch();

  const sendCode = useCallback(async (userId) => {
    try {
      const message = await api.sendActivationCode(userId);
      sessionStorage.setItem('sent', true);
      setTimeLeft(initialTime);
      setIsSent(true);
      toast.info(message);
    } catch (error) {
      toast.error(error.message);
    }
  }, []);

  useEffect(() => {
    sessionStorage.setItem('time-left', timeLeft);

    if (isSent && timeLeft > 0) {
      const interval = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);

      return () => clearInterval(interval);
    }

    if (timeLeft === 0) {
      sessionStorage.removeItem('time-left');
      sessionStorage.removeItem('sent');
      setIsSent(false);
    }
  }, [timeLeft, isSent]);

  const logOut = useCallback(() => {
    dispatch(asyncUnsetAuthUser());
  }, [dispatch]);

  const activateUser = useCallback((userId, otp) => {
    dispatch(asyncActivateUser(userId, otp));
  }, [dispatch]);

  if (!authUser) {
    redirect('/login');
  }

  if (authUser.is_active) {
    redirect('/');
  }

  const { id, email } = authUser;
  const maskedEmail = email.replace(
    /^(\w{2})(\w+)(\w{2})(@[\w.]+)$/,
    '$1****$3$4'
  );

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
      {isSent ? (
        <button
          id="send-activation-code"
          className={styles.activate_page__send}
          onClick={() => {}}
        >
          {formatTime(timeLeft)}
        </button>
      ) : (
        <button
          id="send-activation-code"
          className={styles.activate_page__send}
          onClick={() => sendCode(id)}
        >
          Send Code
        </button>
      )}
    </main>
  );
}

export default Activate;