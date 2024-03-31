import useInput from '../../_hooks/useInput';
import styles from '../../_styles/input.module.css'

function RegisterInput({ register }) {
  const [email, onEmailChange] = useInput('');
  const [username, onUsernameChange] = useInput('');
  const [fullname, onFullnameChange] = useInput('');
  const [password, onPasswordChange] = useInput('');

  return (
    <form className={styles.register_input}>
      <input
        type="text"
        value={email}
        onChange={onEmailChange}
        placeholder="Email"
      />
      <input
        type="text"
        value={username}
        onChange={onUsernameChange}
        placeholder="Username"
      />
      <input
        type="text"
        value={fullname}
        onChange={onFullnameChange}
        placeholder="Fullname"
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
        onClick={() => register({ email, username, fullname, password })}
      >
        Register
      </button>
    </form>
  );
}

export default RegisterInput;
