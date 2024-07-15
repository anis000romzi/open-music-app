'use client';
import Link from 'next/link';
import { useDispatch } from 'react-redux';
import { asyncSetAuthUser } from '@/app/_states/authUser/action';
import { toast } from 'react-toastify';
import api from '@/app/_utils/api';
import RegisterInput from '@/app/_components/inputs/RegisterInput';
import styles from '../../_styles/style.module.css';

function Register() {
  const dispatch = useDispatch();

  const onRegister = async ({ email, username, fullname, password }) => {
    try {
      await api.register({ email, username, fullname, password });
      dispatch(asyncSetAuthUser({ usernameOrEmail: email, password }));
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <main className={styles.register_page}>
      <h1>Create Account</h1>
      <RegisterInput register={onRegister} />
      <Link href="/login">Back to login</Link>
    </main>
  );
}

export default Register;
