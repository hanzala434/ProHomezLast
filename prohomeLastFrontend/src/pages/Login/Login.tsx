import { useEffect, useState } from 'react';
import LoginForm from '../../components/LoginForm';
import styles from './Login.module.css';
import { useLocation } from 'react-router-dom';
import ForgotPassword from '../../components/ForgotPassword';

function Login() {
  const location = useLocation();
  const [message, setMessage] = useState(location.state?.message || '');
  const [showForgotPassword, setShowForgotPassword] = useState(false); // Toggle state

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <>
      {message && (
        <div className="alert alert-success alert-dismissible fade show" role="alert">
          <strong>Success</strong> {message}
        </div>
      )}
      <div className="container">
        <div className="row">
          <div className={`${styles.LoginMainBox}`}>
            <h3 className={`${styles.LoginHeading} text-center`}>
              {showForgotPassword ? "Forgot Password" : "Login"}
            </h3>
            <div className={`${styles.loginFormBox}`}>
              {showForgotPassword ? (
                <ForgotPassword />
              ) : (
                <>
                  <LoginForm />
                  <p className={`text-center mt-3 ${styles.forgetpasswordPara}`}>
                    <button
                      className="btn btn-link"
                      onClick={() => setShowForgotPassword(true)}
                    >
                      Forgot Password?
                    </button>
                  </p>
                </>
              )}
              {showForgotPassword && (
                <p className={`text-center mt-3 ${styles.backtologin}`}>
                  <button
                    className="btn btn-link"
                    onClick={() => setShowForgotPassword(false)}
                  >
                    Back to Login
                  </button>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
