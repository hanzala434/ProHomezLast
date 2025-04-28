import styles from './VendorsPage.module.css'
import Vendors from "../../components/Vendors"

function VendorsPage() {
  return (
    <>
    <section className={`${styles.vendors}`}>
      <Vendors category="All" />
    </section>
    </>
  )
}

export default VendorsPage