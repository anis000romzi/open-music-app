'use client';
import { useSelector, useDispatch } from 'react-redux';
import { redirect, useRouter } from 'next/navigation';
import {
  changeEmailAuthUserActionCreator,
  asyncChangeEmailUser,
} from '@/app/_states/authUser/action';
import useInput from '@/app/_hooks/useInput';
import api from '@/app/_utils/api';

function ChangeEmail() {
  const authUser = useSelector((states) => states.authUser);
  const [email, onEmailChange] = useInput('');

  const dispatch = useDispatch();
  const router = useRouter();

  if (authUser && authUser.is_active) {
    redirect('/');
  }

  const changeEmail = async (userId, email) => {
    dispatch(asyncChangeEmailUser(userId, email));
    router.push('/activate');
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
