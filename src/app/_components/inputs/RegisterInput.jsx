import { useState } from 'react';
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import useInput from '../../_hooks/useInput';
import styles from '../../_styles/input.module.css';

function RegisterInput({ register }) {
  const [email, onEmailChange] = useInput('');
  const [username, onUsernameChange] = useInput('');
  const [fullname, onFullnameChange] = useInput('');
  const [password, onPasswordChange] = useInput('');
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

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
          register({ email, username, fullname, password });
        }}
      >
        Register
      </button>
    </form>
  );
}

export default RegisterInput;
