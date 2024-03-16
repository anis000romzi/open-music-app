import useInput from '../../_hooks/useInput';

function LoginInput({ login }) {
  const [usernameOrEmail, onusernameOrEmailChange] = useInput('');
  const [password, onPasswordChange] = useInput('');

  return (
    <form className="login-input">
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
      />
      <button
        type="button"
        onClick={() => login({ usernameOrEmail, password })}
      >
        Login
      </button>
    </form>
  );
}

export default LoginInput;
