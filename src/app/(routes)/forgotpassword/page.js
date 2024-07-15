'use client';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useRouter, redirect } from 'next/navigation';
import Link from 'next/link';
import ForgotPasswordInput from '@/app/_components/inputs/ForgotPasswordInput';
import { toast } from 'react-toastify';
import api from '@/app/_utils/api';
import { FaAngleLeft } from 'react-icons/fa6';
import styles from '../../_styles/style.module.css';

function ForgotPassword() {
  const authUser = useSelector((state) => state.authUser);
  const [userId, setUserId] = useState(null);
  const router = useRouter();

  const submitEmail = async (email) => {
    try {
      const id = await api.requestResetPassword(email);
      setUserId(id);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const resetPassword = async ({ userId, password, code }) => {
    try {
      await api.resetPassword({ userId, password, otp: code });
      router.push('/login');
    } catch (error) {
      toast.error(error.message);
    }
  };

  if (authUser) {
    redirect('/');
  }

  return (
    <main className={styles.forgot_password_page}>
      <h1>{userId ? 'Reset Password' : 'Forgot Password'}</h1>
      <Link className={styles.back} href={userId ? '#' : '/login'} onClick={userId ? () => setUserId(null) : null}>
        <FaAngleLeft />
      </Link>
      <ForgotPasswordInput userId={userId} resetPassword={resetPassword} submitEmail={submitEmail} />
    </main>
  );
}

export default ForgotPassword;
