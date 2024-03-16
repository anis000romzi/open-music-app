import useInput from '../../_hooks/useInput';

function VerificationInput({ userId, verify }) {
  const [code, onCodeChange] = useInput('');

  return (
    <form className="verification-input">
      <input
        type="text"
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
