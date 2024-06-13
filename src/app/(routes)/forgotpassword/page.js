'use client';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { redirect } from 'next/navigation';
import useInput from '@/app/_hooks/useInput';
import api from '@/app/_utils/api';
import Link from 'next/link';
import { FaAngleLeft } from 'react-icons/fa6';
import styles from '../../_styles/style.module.css';
import inputStyles from '../../_styles/input.module.css';

function ForgotPassword() {
  const authUser = useSelector((states) => states.authUser);
  const [userId, setUserId] = useState(null);
  const [email, onEmailChange] = useInput('');
  const [password, onPasswordChange] = useInput('');
  const [code, onCodeChange] = useInput('');

  const router = useRouter();

  const submitEmail = async (email) => {
    try {
      const id = await api.requestResetPassword(email);
      setUserId(id);
    } catch (error) {
      alert(error.message);
    }
  };

  const resetPassword = async ({ userId, password, code }) => {
    try {
      await api.resetPassword({ userId, password, otp: code });
      router.push('/login');
    } catch (error) {
      alert(error.message);
    }
  };

  if (authUser) {
    redirect('/');
  }

  if (!userId) {
    return (
      <main className={styles.forgot_password_page}>
        <h1>Forgot Password</h1>
        <Link className={styles.back} href="/login">
          <FaAngleLeft />
        </Link>
        <form className={inputStyles.forgot_password_input}>
          <input
            type="text"
            value={email}
            onChange={onEmailChange}
            placeholder="Registered email"
          />
          <button type="button" onClick={() => submitEmail(email)}>
            Submit
          </button>
        </form>
      </main>
    );
  }

  return (
    <main className={styles.forgot_password_page}>
      <h1>Reset Password</h1>
      <Link className={styles.back} href="#" onClick={() => setUserId(null)}>
        <FaAngleLeft />
      </Link>
      <p>
        OTP code sent to{' '}
        {email.replace(/^(\w{2})(\w+)(\w{2})(@[\w.]+)$/, '$1****$3$4')}
      </p>
      <form className={inputStyles.forgot_password_input}>
        <input
          type="password"
          value={password}
          onChange={onPasswordChange}
          placeholder="New password"
        />
        <input
          type="number"
          value={code}
          onChange={onCodeChange}
          placeholder="Enter OTP"
        />
        <button
          type="button"
          onClick={() => resetPassword({ userId, password, code })}
        >
          Reset password
        </button>
      </form>
    </main>
  );
}

export default ForgotPassword;
