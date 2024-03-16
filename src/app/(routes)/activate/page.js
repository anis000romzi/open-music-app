'use client';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { asyncUnsetAuthUser } from '@/app/_states/authUser/action';
import { asyncActivateUser } from '@/app/_states/authUser/action';
import VerificationInput from '@/app/_components/inputs/VerificationInput';
import api from '@/app/_utils/api';

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

  if (authUser && authUser.is_active) {
    redirect('/');
  }

  return (
    <main>
      <button onClick={logOut}>logout</button>
      <h1>Account activation page</h1>
      {authUser ? (
        <>
          <p>Verification code will be sent to: {authUser.email}</p>
          <button onClick={() => sendCode(authUser.id)}>Send Code</button>
          <VerificationInput verify={activateUser} userId={authUser.id} />
          <Link href="/changeemail">Change email</Link>
        </>
      ) : (
        ''
      )}
    </main>
  );
}

export default Activate;
