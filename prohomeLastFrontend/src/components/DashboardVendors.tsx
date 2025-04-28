import styles from '../style/DashboardVendors.module.css';
import { Vendor } from './types';
import VendorsList from './VendorsList';

interface VendorProductsProps {
  vendors: Vendor[];
  setMessage: React.Dispatch<React.SetStateAction<string>>;
}

function DashboardVendors({ vendors, setMessage }: VendorProductsProps) {
  return (
    <div className={`${styles.vendorProductsMainContainer}`}>
      {vendors
        .filter((item) => item.isAdmin === 0) // Exclude Admins
        .map((item) => (
          <div className={`${styles.productListBox}`} key={item.store_id}>
            <VendorsList content={item} setMessage={setMessage} />
          </div>
        ))}
    </div>
  );
}

export default DashboardVendors;
