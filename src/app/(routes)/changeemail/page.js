'use client';
import { useSelector } from 'react-redux';
import { redirect, useRouter } from 'next/navigation';
import useInput from '@/app/_hooks/useInput';
import api from '@/app/_utils/api';

function ChangeEmail() {
  const router = useRouter();
  const authUser = useSelector((states) => states.authUser);
  const [email, onEmailChange] = useInput('');

  if (authUser && authUser.is_active) {
    redirect('/');
  }

  const changeEmail = async (userId, email) => {
    try {
      await api.changeEmail(userId, email);
      router.push('/activate');
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <main>
      <h1>Change Email Page</h1>
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
