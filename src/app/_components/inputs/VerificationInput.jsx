import useInput from '../../_hooks/useInput';
import styles from '../../_styles/input.module.css'

function VerificationInput({ userId, verify }) {
  const [code, onCodeChange, setCode] = useInput('');

  if (code.length > 6) {
    setCode(code.slice(0, 6))
  }

  return (
    <form className={styles.verification_input}>
      <input
        type="number"
        value={code}
        onChange={onCodeChange}
        placeholder="Enter OTP code"
      />
      <button type="button" onClick={() => verify(userId, code)}>
        Verify
      </button>
    </form>
  );
}

export default VerificationInput;
