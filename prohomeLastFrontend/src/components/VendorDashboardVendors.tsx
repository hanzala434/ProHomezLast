import { useLocation } from 'react-router-dom';
import styles from '../style/VendorDashboardVendors.module.css';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/store.ts';
import { fetchAllVendors } from '../features/products/productSlice';
import DashboardVendors from './DashboardVendors.tsx';

function VendorDashboardVendors() {
  const [message, setMessage] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();

  const vendors = useSelector((state: RootState) => state.products.vendors);
  const status = useSelector((state: RootState) => state.products.status);
  const error = useSelector((state: RootState) => state.products.error);

  useEffect(() => {
    dispatch(fetchAllVendors());
  }, [location.pathname, dispatch]);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  // Static category buttons
  const categoryBtns = [
    { name: "All", id: "all-categories" },
    { name: "Real Estate", id: "real-estate-categories" },
    { name: "Home Products", id: "home-product-categories" },
  ];

  const filteredVendors = activeCategory === "All"
    ? vendors
    : vendors.filter(vendor => vendor.brand_type === activeCategory);

  return (
    <div className={styles.vendorDashboard}>
      <div className={styles.allProducts}>
        {message && (
          <div className="alert alert-success alert-dismissible fade show" role="alert">
            <strong>Success!</strong> {message}
          </div>
        )}

        <h3 className={styles.allProductHeading}>All Vendors</h3>

        {/* Category Buttons */}
        <div className="d-flex justify-content-center flex-wrap my-3">
          {categoryBtns.map((item, index) => (
            <button
              id={item.id}
              key={index}
              className={`btn mx-1 ${styles.categoriesDisplayBtn} ${activeCategory === item.name ? styles.categoryActive : ''}`}
              onClick={() => setActiveCategory(item.name)}
            >
              {item.name}
            </button>
          ))}
        </div>

        <div className={styles.vendorProductBox}>
          {status === 'loading' && <p>Loading Vendors...</p>}
          {status === 'succeeded' && filteredVendors.length > 0 && (
            <DashboardVendors vendors={filteredVendors} setMessage={setMessage} />
          )}
          {status === 'succeeded' && filteredVendors.length === 0 && (
            <p>No Vendors found in this category.</p>
          )}
          {status === 'failed' && <p>Failed to load vendors: {error}</p>}
        </div>
      </div>
    </div>
  );
}

export default VendorDashboardVendors;
