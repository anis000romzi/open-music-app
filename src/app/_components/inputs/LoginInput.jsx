import { useState } from 'react';
import Link from 'next/link';
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import useInput from '../../_hooks/useInput';
import styles from '../../_styles/input.module.css';

function LoginInput({ login }) {
  const [usernameOrEmail, onusernameOrEmailChange] = useInput('');
  const [password, onPasswordChange] = useInput('');
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <form className={styles.login_input}>
      <input
        type="text"
        value={usernameOrEmail}
        onChange={onusernameOrEmailChange}
        placeholder="Username or Email"
      />
      <div className={styles.password_container}>
        <input
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={onPasswordChange}
          placeholder="Password"
          autoComplete="on"
        />
        <button
          type="button"
          className={styles.toggle_password_button}
          onClick={togglePasswordVisibility}
        >
          {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
        </button>
      </div>
      <button
        type="submit"
        onClick={(event) => {
          event.preventDefault();
          login({ usernameOrEmail, password });
        }}
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
