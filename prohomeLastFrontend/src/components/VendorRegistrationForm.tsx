import React, { useState } from 'react';
import styles from '../style/VendorRegistrationForm.module.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import CountrySelect from './CountrySelect';

interface FormData {
  firstName: string;
  lastName: string;
  storeName: string;
  storeId: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  country: string;
  postcode: string;
  phone: string;
  email: string;
  brandType: string;
  password: string;
  confirmPassword: string;
  description: string;
}

function VendorRegistrationForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    storeName: '',
    storeId: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    country: '',
    postcode: '',
    phone: '',
    email: '',
    brandType: '',
    password: '',
    confirmPassword: '',
    description: '',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [storeIdStatus, setStoreIdStatus] = useState<string | null>(null);
  const [emailStatus, setEmailStatus] = useState<string | null>(null);
  const [otp, setOtp] = useState('');
const [otpSent, setOtpSent] = useState(false);
const [isOTPVerified, setIsOTPVerified] = useState(false);
const [otpMessage, setOtpMessage] = useState<string | null>(null);

const sendOTP = async () => {
  if (!formData.email.trim()) {
    setOtpMessage('Email is required to send OTP.');
    return;
  }

  try {
    const response = await axios.post(`${import.meta.env.VITE_PROHOMEZ_BACKEND_URL}/send-otp`, { email: formData.email });

    if (response.status === 200) {
      setOtpSent(true);
      setOtpMessage('OTP sent to your email.');
    }
  } catch (error) {
    console.error('Error sending OTP:', error);
    setOtpMessage('Failed to send OTP. Try again.');
  }
};

const verifyOTP = async () => {
  if (!otp.trim()) {
    setOtpMessage('Enter the OTP to verify.');
    return;
  }

  try {
    const response = await axios.post(`${import.meta.env.VITE_PROHOMEZ_BACKEND_URL}/verify-otp`, { email: formData.email, otp });

    if (response.status === 200) {
      setIsOTPVerified(true);
      setOtpMessage('OTP verified successfully.');
    } else {
      setOtpMessage('Invalid OTP. Try again.');
    }
  } catch (error) {
    console.error('Error verifying OTP:', error);
    setOtpMessage('OTP verification failed.');
  }
};


  const verifyEmail = async (email: string) => {
    try {
      const response = await axios.get(
        `https://api.hunter.io/v2/email-verifier?email=${email}&api_key=YOUR_HUNTER_API_KEY`
      );
      console.log(response.data);
      return response.data.data.status === "valid"; // "valid" or "invalid"
    } catch (error) {
      console.error('Error verifying email:', error);
      return false;
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    // Replace spaces with hyphens and convert to lowercase for storeId
    const updatedValue =
      name === 'storeId' ? value.replace(/\s+/g, '-').toLowerCase() : value;

    setFormData({ ...formData, [name]: updatedValue });
  };



  const validateEmail = async () => {
    if (!formData.email.trim()) {
      setEmailStatus('Email is required');
      return false;
    }
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_PROHOMEZ_BACKEND_URL}/check-email/${formData.email}`
      );
      if (response.data.exists) {
        setEmailStatus('Email is already taken');
        return false;
      }
      setEmailStatus('Email is available');
      return true;
    } catch (error) {
      console.error('Error checking email:', error);
      setEmailStatus('Failed to validate email');
      return false;
    }
  };

  const validateStoreId = async () => {
    if (!formData.storeId.trim()) {
      setStoreIdStatus('Store ID is required');
      return false;
    }
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_PROHOMEZ_BACKEND_URL}/check-store-id/${formData.storeId}`
      );
      if (response.data.exists) {
        setStoreIdStatus('Store ID is already taken');
        return false;
      }
      setStoreIdStatus('Store ID is available');
      return true;
    } catch (error) {
      console.error('Error checking Store ID:', error);
      setStoreIdStatus('Failed to validate Store ID');
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    if (!formData.firstName.trim()) newErrors.firstName = 'First Name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last Name is required';
    if (!formData.storeName.trim()) newErrors.storeName = 'Store Name is required';
    if (!formData.storeId.trim()) newErrors.storeId = 'Store ID is required';
    if (!formData.address1.trim()) newErrors.address1 = 'Address 1 is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'State/County is required';
    if (!formData.country.trim()) newErrors.country = 'Country is required';
    if (!formData.postcode.trim()) newErrors.postcode = 'Postcode/ZIP is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.phone.trim()) newErrors.phone = 'Store Phone is required';
    else if (!/^[0-9]+$/.test(formData.phone)) newErrors.phone = 'Store Phone must be a number';
    if (!formData.brandType) newErrors.brandType = 'Brand Type is required';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';

    setErrors(newErrors);

    console.log(newErrors);
    if (Object.keys(newErrors).length === 0) {
      const isStoreIdValid = await validateStoreId();
      if (!isStoreIdValid) return;

      try {
        const response = await axios.post(
          `${import.meta.env.VITE_PROHOMEZ_BACKEND_URL}/register`,
          formData
        );
        if (response.status === 200 || response.status === 201) {
          setFormData({
            firstName: '',
            lastName: '',
            storeName: '',
            storeId: '',
            address1: '',
            address2: '',
            city: '',
            state: '',
            country: '',
            postcode: '',
            phone: '',
            email: '',
            brandType: '',
            password: '',
            confirmPassword: '',
            description: '',
          });
          setErrors({});
          navigate('/login', {
            state: { message: 'Vendor Registered Successfully.' },
          });
        }
      } catch (error: any) {
        if (error.response) {
          alert(`Error: ${error.response.data.message}`);
        } else {
          console.error('Error submitting the form:', error);
          alert('Failed to connect to the server. Please try again later.');
        }
      }
    }
  };

  return (
    <div className={`${styles.vendorRegistrationForm}`}>
      <h3 className={`${styles.vendorRegistrationFormHeading}`}>Fill out the details</h3>
      <div className={`${styles.vendorRegistrationFormBox}`}>
        <form onSubmit={handleSubmit}>
          <div className="row">
            {['firstName', 'lastName', 'storeName', 'address1', 'address2', 'city', 'state', 'postcode','description'].map((field) => (
              <div className="col-12" key={field}>
                <div className={`${styles.inputBox} position-relative pt-4 mt-2`}>
                  <input
                    type="text"
                    name={field}
                    value={(formData as any)[field]}
                    onChange={handleChange}
                    className="w-100 py-2 px-2 rounded-3 position-relative"
                  />
                  <span className={`${styles.contactFormSpan} py-2 px-2`}>
                    {field.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}
                  </span>
                  <i className={`${styles.contactBorderIcon}`}></i>
                </div>
                {errors[field] && <small className="text-danger d-block mt-1">{errors[field]}</small>}
              </div>
            ))}

<div className="col-12">
  <div className={`${styles.inputBox} ${styles.selectionBox} ${styles.selectionBox112} position-relative pt-4 mt-2`}>
  <CountrySelect value={formData.country} onChange={handleChange} />
{errors.country && <small className="text-danger">{errors.country}</small>}
  </div>
</div>

            
<div className="col-12">
  <div className={`${styles.inputBox} position-relative pt-4 mt-2`}>
    <input
      type="email"
      name="email"
      value={formData.email}
      onChange={handleChange}
      onBlur={validateEmail}
      className="w-100 py-2 px-2 rounded-3 position-relative"
    />
    <span className={`${styles.contactFormSpan} py-2 px-2`}>Email</span>
    <i className={`${styles.contactBorderIcon}`}></i>
  </div>

  <button
    type="button"
    className={`btn btn-primary mt-2 ${styles.sendOTP}`}
    onClick={sendOTP}
    disabled={otpSent}
  >
    {otpSent ? "OTP Sent" : "Send OTP"}
  </button>

  {otpSent && (
    <>
      <div className={`${styles.inputBox} position-relative pt-4 mt-2`}>
        <input
          type="text"
          name="otp"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="w-100 py-2 px-2 rounded-3 position-relative"
          placeholder="Enter OTP"
        />
      </div>

      <button
        type="button"
        className={`btn btn-success mt-2 ${styles.verifyOTP}`}
        onClick={verifyOTP}
        disabled={isOTPVerified}
      >
        {isOTPVerified ? "OTP Verified" : "Verify OTP"}
      </button>
    </>
  )}

  {otpMessage && (
    <small className={`d-block mt-1 ${isOTPVerified ? 'text-success' : 'text-danger'}`}>
      {otpMessage}
    </small>
  )}
</div>


            <div className="col-12">
              <div className={`${styles.inputBox} position-relative pt-4 mt-2`}>
                <input
                  type="number"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-100 py-2 px-2 rounded-3 position-relative"
                />
                <span className={`${styles.contactFormSpan} py-2 px-2`}>Phone</span>
                <i className={`${styles.contactBorderIcon}`}></i>
              </div>
                {errors.phone && <small className="text-danger d-block mt-1">{errors.phone}</small>}
            </div>

            <div className="col-12">
              <div className={`${styles.inputBox} ${styles.selectionBox} position-relative pt-4 mt-2`}>
                <select
                  name="brandType"
                  value={formData.brandType}
                  onChange={handleChange}
                  className={`w-100 py-2 px-2 rounded-3 position-relative ${styles.selectBrand}`}>
                  <option value="" disabled className={styles.optionDisabled}>
                    Select Brand Type
                  </option>
                  <option value="Real Estate">Real Estate</option>
                  <option value="Home Products">Home Products</option>
                  <option value="Electronics">Electronics</option>
                </select>
                {errors.brandType && <small className="text-danger">{errors.brandType}</small>}
              </div>
            </div>

            <div className="col-12">
              <div className={`${styles.inputBox} position-relative pt-4 mt-2`}>
                <input
                  type="text"
                  name="storeId"
                  value={formData.storeId}
                  onChange={handleChange}
                  onBlur={validateStoreId}
                  className="w-100 py-2 px-2 rounded-3 position-relative"
                />
                <span className={`${styles.contactFormSpan} py-2 px-2`}>Store ID</span>
                <i className={`${styles.contactBorderIcon}`}></i>
              </div>
              {storeIdStatus && <small className={`d-block mt-1 ${storeIdStatus.includes('available') ? 'text-success' : 'text-danger'}`}
              style={window.innerWidth <= 600 ? { marginBottom: '2rem', fontSize: "3rem", } : {}}
              >{storeIdStatus}</small>}
            </div>
            {['password', 'confirmPassword'].map((field) => (
              <div className="col-12" key={field}>
                <div className={`${styles.inputBox} position-relative pt-4 mt-2`}>
                  <input
                    type="password"
                    name={field}
                    value={(formData as any)[field]}
                    onChange={handleChange}
                    className="w-100 py-2 px-2 rounded-3 position-relative"
                  />
                  <span className={`${styles.contactFormSpan} py-2 px-2`}>
                    {field.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}
                  </span>
                  <i className={`${styles.contactBorderIcon}`}></i>
                </div>
                  {errors[field] && <small className="text-danger d-block mt-1">{errors[field]}</small>}
              </div>
            ))}

            <div className="col-12">
              <button
                type="submit"
                value="Send"
                className={`${styles.contactSendBtn} rounded-5 py-1 px-4 text-normal mt-4`}
              >
                Send
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default VendorRegistrationForm;
