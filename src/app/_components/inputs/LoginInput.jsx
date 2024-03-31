import useInput from '../../_hooks/useInput';
import styles from '../../_styles/input.module.css';
import Link from 'next/link';

function LoginInput({ login }) {
  const [usernameOrEmail, onusernameOrEmailChange] = useInput('');
  const [password, onPasswordChange] = useInput('');

  return (
    <form className={styles.login_input}>
      <input
        type="text"
        value={usernameOrEmail}
        onChange={onusernameOrEmailChange}
        placeholder="Username or Email"
      />
      <input
        type="password"
        value={password}
        onChange={onPasswordChange}
        placeholder="Password"
        autoComplete="on"
      />
      <button
        type="button"
        onClick={() => login({ usernameOrEmail, password })}
      >
        Login
      </button>
      <Link className={styles.register_button} href="/register">
        Register
      </Link>
    </form>
  );
}

export default LoginInput;
