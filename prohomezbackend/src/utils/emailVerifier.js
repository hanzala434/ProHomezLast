import axios from 'axios';

const verifyEmail = async (email) => {
  try {
    const hunterResponse = await axios.get(`https://api.hunter.io/v2/email-verifier?email=${email}&api_key=YOUR_HUNTER_API_KEY`);
    const zeroBounceResponse = await axios.get(`https://api.zerobounce.net/v2/validate?api_key=YOUR_ZEROBOUNCE_API_KEY&email=${email}`);
    const mailboxLayerResponse = await axios.get(`http://apilayer.net/api/check?access_key=YOUR_MAILBOXLAYER_KEY&email=${email}`);

    return {
      hunter: hunterResponse.data.data.status,
      zeroBounce: zeroBounceResponse.data.status,
      mailboxLayer: mailboxLayerResponse.data.format_valid,
    };
  } catch (error) {
    console.error('Error verifying email:', error);
    return { error: 'Verification failed' };
  }
};

export default verifyEmail;
