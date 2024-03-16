'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { asyncRegisterUser } from '@/app/_states/users/action';
import RegisterInput from '@/app/_components/inputs/RegisterInput';

function Register() {
  const dispatch = useDispatch();
  const router = useRouter();
 
  const onRegister = ({ email, username, fullname, password }) => {
    dispatch(asyncRegisterUser({ email, username, fullname, password }));
 
    router.push('/login');
  };

  return (
    <div>
      <h1>Register Page</h1>
      <RegisterInput register={onRegister} />
      <Link href="/login">Back to login</Link>
    </div>
  );
}

export default Register;
