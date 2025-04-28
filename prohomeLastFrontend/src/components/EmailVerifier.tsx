import { useState } from "react";
import axios from "axios";

interface VerificationResult {
  success?: boolean;
  message?: string;
  error?: string;
}

const EmailVerifier = () => {
  const [email, setEmail] = useState("");
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);
  const [loading, setLoading] = useState(false);

  const verifyEmail = async () => {
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:5000/verify-email", { email });
      setVerificationResult(response.data);
    } catch (error) {
      console.error("Error verifying email:", error);
      setVerificationResult({ error: "Failed to verify email" });
    }
    setLoading(false);
  };

  return (
    <div>
      <h2>Email Verifier</h2>
      <input
        type="email"
        placeholder="Enter email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button onClick={verifyEmail} disabled={loading}>
        {loading ? "Verifying..." : "Verify Email"}
      </button>
      {verificationResult && <p>Result: {JSON.stringify(verificationResult)}</p>}
    </div>
  );
};

export default EmailVerifier;
