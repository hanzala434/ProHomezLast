import { Link } from 'react-router-dom';
import styles from '../style/VendorCard1.module.css';
import { useEffect, useState } from 'react';
import defaultImage from '../assets/images/WhatsApp Image 2025-03-13 at 23.10.23_ac2acca4.jpg'; 

interface Vendor {
  featureImage?: string;
  src?: string;
  name?: string;
  store_id?: string;
  store_name?: string;
  image?: string | null;
}

interface ProductCardProps {
  vendor?: Vendor;
}

function VendorCard1({ vendor }: ProductCardProps) {
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // const defaultImage = '../src/assets/images/WhatsApp Image 2025-03-13 at 23.10.23_ac2acca4.jpg'; // Replace with your actual default image path

  useEffect(() => {
    if (vendor?.image) {
      setPreviewImage(`${import.meta.env.VITE_PROHOMEZ_BACKEND_URL}/images/${vendor.image}`);
    } else {
      setPreviewImage(defaultImage);
    }
  }, [vendor?.image]);

  return (
    <Link to={`/vendor/profile/${vendor?.store_id ?? ''}`} className="text-decoration-none">
      <div className={styles.cardBox}>
        <div className={`${styles.imgBox}`}>
          <div className="flex justify-center mb-6">
            <img src={previewImage || defaultImage} alt="Profile" className="w-full h-32 shadow-md" />
          </div>
        </div>
        <h5 className={`${styles.cardBoxName}`}>{vendor?.store_name || 'No Store Name'}</h5>
      </div>
    </Link>
  );
}

export default VendorCard1;
