import { useEffect, useState } from "react";
import { fetchVendorDetails2, fetchVendorProductsByStoreId } from "../features/products/productSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store/store";
import { useParams } from "react-router-dom";
import ProductBox from "./ProductBox";
import defaultImage from '../assets/images/WhatsApp Image 2025-03-13 at 23.10.23_ac2acca4.jpg';  // ✅ Import default image
import styles from "../style/VendorProfileMain.module.css"; // Import CSS Module

const VendorProfileMain = () => {
  const vendor = useSelector((state: RootState) => state.products.vendorDetails);
  const { vendorItems, status } = useSelector((state: RootState) => state.products);

  const dispatch = useDispatch<AppDispatch>();
  const { slug } = useParams<{ slug: string }>();
  const vendorId = slug?.split('-').pop();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      setLoading(true);
      dispatch(fetchVendorDetails2({ store_id: vendorId  as string  }));
      dispatch(fetchVendorProductsByStoreId({ store_id: vendorId  as string  }))
        .unwrap()
        .finally(() => setLoading(false));
    }
  }, [slug, dispatch]);

  return (
    <div className={styles.container}>
      {/* Vendor Profile Section */}
      <div className={styles.profileSection}>
        {/* Vendor Profile Image */}
        {(vendor as any)?.image && (
          <img
          src={`${import.meta.env.VITE_PROHOMEZ_BACKEND_URL}/images/${(vendor as any)?.image}`}
            alt="Vendor Profile"
            className={styles.profileImage}
            onError={(e) => (e.currentTarget.src = defaultImage)}
          />
        )}

        {/* Vendor Details */}
        <h1 className={styles.vendorName}>{(vendor as any)?.store_name}</h1>
        <p className={styles.vendorInfo}>{(vendor as any)?.address1 || "Address not available"}</p>
        <p className={styles.vendorInfo}>
        📧 {(vendor as any)?.email || "Email not available"} | 📞 {(vendor as any)?.phone || "Phone not available"}

        </p>
      </div>

      {/* About Section */}
      <div className={styles.aboutSection}>
      <h2 className={styles.aboutTitle}>About {(vendor as any)?.store_name}</h2>
        <p className={styles.description}>{(vendor as any)?.description || "No description available."}</p>
      </div>

      {/* Products Section */}
      <h2 className={styles.productsTitle}>Products</h2>
      <div className={styles.productsGrid}>
        {loading || status === "loading" ? (
          <p className={styles.vendorInfo}>Loading products...</p>
        ) : vendorItems.length === 0 ? (
          <p className={styles.vendorInfo}>No products available.</p>
        ) : (
          vendorItems.map((product, index) => (
            <div className={styles.productItem} key={index}>
              <ProductBox productDetail={product} />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default VendorProfileMain;
