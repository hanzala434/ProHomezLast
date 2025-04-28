import EmailVerifier from 'email-verifier';

const verifier = new EmailVerifier('your-api-key'); // Get an API key from an email verification service

const checkSMTP = async (email) => {
  return new Promise((resolve, reject) => {
    verifier.verify(email, (err, info) => {
      if (err) {
        console.error('SMTP validation failed:', err);
        resolve(false);
      } else {
        resolve(info.success); // Returns true if valid, false otherwise
      }
    });
  });
};

export default checkSMTP;
