'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { asyncRegisterUser } from '@/app/_states/users/action';
import RegisterInput from '@/app/_components/inputs/RegisterInput';
import styles from '../../_styles/style.module.css'

function Register() {
  const dispatch = useDispatch();
  const router = useRouter();
 
  const onRegister = ({ email, username, fullname, password }) => {
    dispatch(asyncRegisterUser({ email, username, fullname, password }));
 
    router.push('/login');
  };

  return (
    <main className={styles.register_page}>
      <h1>Register Page</h1>
      <RegisterInput register={onRegister} />
      <Link href="/login">Back to login</Link>
    </main>
  );
}

export default Register;
