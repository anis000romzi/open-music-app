'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import api from '@/app/_utils/api';
import RegisterInput from '@/app/_components/inputs/RegisterInput';
import styles from '../../_styles/style.module.css';

function Register() {
  const router = useRouter();

  const onRegister = async ({ email, username, fullname, password }) => {
    try {
      await api.register({ email, username, fullname, password });
      router.push('/login');
    } catch (error) {
      alert(error.message);
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
