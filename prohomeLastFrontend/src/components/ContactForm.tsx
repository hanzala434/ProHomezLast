import { useState } from 'react';
import styles from '../style/ContactForm.module.css';
import Swal from 'sweetalert2';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_PROHOMEZ_BACKEND_URL;

function ContactForm(): JSX.Element {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    userType: '',
  });

  const [errors, setErrors] = useState({
    name: '',
    email: '',
    message: '',
    userType: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [id]: ''
    }));
  };

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const newErrors = {
      name: '',
      email: '',
      message: '',
      userType: '',
    };

    Object.keys(formData).forEach((field) => {
      if (!formData[field as keyof typeof formData]) {
        newErrors[field as keyof typeof newErrors] = 'This field is required.';
      }
    });

    if (Object.values(newErrors).some((error) => error)) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await axios.post(`${API_BASE}/send-email`, formData);

      if (response.status === 200) {
        Swal.fire({
          title: 'Success!',
          text: 'Your message has been sent successfully!',
          icon: 'success'
        });

        setFormData({
          name: '',
          email: '',
          message: '',
          userType: '',
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Failed to send your message. Please try again!',
      });
      console.error('Error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.contactFormBox}>
      <form onSubmit={onSubmit} className={styles.contactForm}>
        <div className="container px-0 py-5 py-lg-0">
          <div className="row">
            <div className="col-sm-12 mb-3">
              <label htmlFor="name" className={styles.contactFormLabel}>
                Name<span>*</span>
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`${styles.contactFormInput} w-100`}
              />
              {errors.name && <p className={styles.errorText}>{errors.name}</p>}
            </div>

            <div className="col-sm-12 mb-3">
              <label htmlFor="email" className={styles.contactFormLabel}>
                Email<span>*</span>
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`${styles.contactFormInput} w-100`}
              />
              {errors.email && <p className={styles.errorText}>{errors.email}</p>}
            </div>

            <div className="col-sm-12 mb-3">
              <label htmlFor="userType" className={styles.contactFormLabel}>
                Are you a Vendor or Customer? <span>*</span>
              </label>
              <select
                id="userType"
                value={formData.userType}
                onChange={handleInputChange}
                className={`${styles.contactFormInput} w-100`}
              >
                <option value="" className={styles.contactFormOption}>Select Type</option>
                <option value="vendor" className={styles.contactFormOption}>Vendor</option>
                <option value="customer" className={styles.contactFormOption}>Customer</option>
              </select>
              {errors.userType && <p className={styles.errorText}>{errors.userType}</p>}
            </div>

            <div className="col-sm-12 mb-3">
              <label htmlFor="message" className={styles.contactFormLabel}>
                Message<span>*</span>
              </label>
              <textarea
                id="message"
                rows={4}
                value={formData.message}
                onChange={handleInputChange}
                className={`${styles.contactFormInput} w-100`}
              ></textarea>
              {errors.message && <p className={styles.errorText}>{errors.message}</p>}
            </div>

            <div className="col-sm-12 mb-3">
              <button type="submit" className={styles.contactFormSubmitBtn} disabled={isSubmitting}>
                {isSubmitting ? (
                  <div className={styles.spinner}></div>
                ) : (
                  <>Send a Message</>
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default ContactForm;
