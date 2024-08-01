import useInput from '../../_hooks/useInput';
import styles from '../../_styles/input.module.css';

function ForgotPasswordInput({ userId, resetPassword, submitEmail }) {
  const [email, onEmailChange] = useInput('');
  const [password, onPasswordChange] = useInput('');
  const [code, onCodeChange] = useInput('');

  if (userId) {
    return (
      <>
        <p>
          OTP code sent to{' '}
          {email.replace(/^(\w{2})(\w+)(\w{2})(@[\w.]+)$/, '$1****$3$4')}
        </p>
        <form className={styles.forgot_password_input}>
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
            type="submit"
            onClick={(event) => {
              event.preventDefault();
              resetPassword({ userId, password, code });
            }}
          >
            Reset Password
          </button>
        </form>
      </>
    );
  }

  return (
    <form className={styles.forgot_password_input}>
      <input
        type="text"
        value={email}
        onChange={onEmailChange}
        placeholder="Registered email"
      />
      <button
        type="submit"
        onClick={(event) => {
          event.preventDefault();
          submitEmail(email);
        }}
      >
        Submit
      </button>
    </form>
  );
}

export default ForgotPasswordInput;
