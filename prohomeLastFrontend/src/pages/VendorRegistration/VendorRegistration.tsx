import VendorRegistrationForm from '../../components/VendorRegistrationForm'
import styles from './VendorRegistration.module.css'

function VendorRegistration() {
  return (
    <>
      <div className="container">
        <div className="row">
          <div className={`${styles.vendorRegistrationMainBox}`}>
            <h3 className={`${styles.vendorRegistrationHeading} text-center`}>Become Pro Vendor</h3>
            <div className={`${styles.vendorRegistrationFormBox}`}>
              <VendorRegistrationForm />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default VendorRegistration