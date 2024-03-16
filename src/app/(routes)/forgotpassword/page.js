'use client';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { redirect } from 'next/navigation';
import useInput from '@/app/_hooks/useInput';
import api from '@/app/_utils/api';

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
      <div>
        <h1>Forgot Password Page</h1>
        <input
          type="text"
          value={email}
          onChange={onEmailChange}
          placeholder="Registered email"
        />
        <button type="button" onClick={() => submitEmail(email)}>
          Submit
        </button>
      </div>
    );
  }

  return (
    <div>
      <h1>Forgot Password Page</h1>
      <p>OTP code sent to {email}</p>
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
    </div>
  );
}

export default ForgotPassword;
