import { MdLocationPin } from 'react-icons/md'
import styles from './Contact.module.css'
import { IoIosCall, IoIosMailOpen } from 'react-icons/io'
import ContactForm from '../../components/ContactForm'

function Contact() {
  return (
    <>
    <section className={`${styles.contact} text-center`}>
        <div className="container">
            <div className="row flex justify-center">
                <h2 className={`${styles.contactHeading}`}>Get in Touch With Us</h2>
                <p className={`${styles.contactPara}`}>Have questions or need assistance? We're here to help! Whether you're a vendor looking to list your products or a customer seeking more information, drop us a message, and we'll get back to you as soon as possible. Your feedback is important to us!</p>
            </div>
        </div>
    </section>
    <section className={`${styles.contactDetails} pb-5`}>
      <div className="container">
        <div className="row">
          <div className="col-md-6">
            <div className={`${styles.contactDetailBox} mb-4`}>
              <h4 className={`${styles.contactDetailBoxHeading}`}>Location</h4>
              <p className={`${styles.contactDetailBoxPara} mb-2`}><MdLocationPin className={styles.MdLocationPin}/> ISE Tower, 6Th floor Islamabad, Pakistan. 44000</p>
              <p className={`${styles.contactDetailBoxPara} mb-2`}><MdLocationPin  className={styles.MdLocationPin}/> Business Bay, Dubai, UAE.</p>
            </div>
            <div className={`${styles.contactDetailBox} mb-4`}>
              <h4 className={`${styles.contactDetailBoxHeading}`}>Phone</h4>
              <p className={`${styles.contactDetailBoxPara} mb-2`}><IoIosCall className={styles.IoIosCall} /> (+92) 315 5625755</p>
            </div>
            <div className={`${styles.contactDetailBox} mb-4`}>
              <h4 className={`${styles.contactDetailBoxHeading}`}>Email</h4>
              <p className={`${styles.contactDetailBoxPara} mb-2`}><IoIosMailOpen className={styles.IoIosMailOpen}/> business@prohomez.com</p>
            </div>
          </div>
          <div className="col-md-6">
            <div className={`${styles.contactFormBox}`}>
              <ContactForm />
            </div>
          </div>
        </div>
      </div>
    </section>
    </>
  )
}

export default Contact