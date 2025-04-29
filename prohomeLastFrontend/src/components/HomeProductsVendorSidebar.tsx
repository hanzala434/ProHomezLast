import styles from '../style/HomeProductsVendorSidebar.module.css';
import vendorLogo from '../assets/images/WhatsApp Image 2025-03-13 at 23.10.23_ac2acca4.jpg';
import { VendorDetail } from './types';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_PROHOMEZ_BACKEND_URL;
interface HomeProductsVendorSidebarProps {
    vendorDetail: VendorDetail;
}

function HomeProductsVendorSidebar({ vendorDetail }: HomeProductsVendorSidebarProps) {
    const [vendorData, setVendorData] = useState<VendorDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const store_id = vendorDetail.store_id;
    const { singleProduct } = useSelector((state: RootState) => state.products);
    const navigate = useNavigate();
    useEffect(() => {
        if (store_id) {
            axios.get(`${API_BASE}/vendor-details/${store_id}`)
                .then(res => {
                    setVendorData(res.data);
                    setLoading(false);
                })
                .catch(err => {
                    setError('Failed to fetch vendor details.');
                    setLoading(false);
                });
        }
    }, [store_id]);

    if (loading) return <p>Loading vendor details...</p>;
    if (error || !vendorData) return <p>{error || "Vendor data not available."}</p>;

    return (
        <>
            <div className={`${styles.homeProductsVendor}`}>
                {/* <h5 className={`${styles.vendorHeading}`}>Vendor Details</h5> */}
                <div className={`${styles.vendorDetailBox} d-flex`}>
                    <div className={`${styles.imgBox}`}>
                        <a className="flex justify-center" href={`/vendor/profile/${singleProduct?.storeId}`}>
                            <img
                                src={
                                    vendorDetail.image
                                        ? `${import.meta.env.VITE_PROHOMEZ_BACKEND_URL}/images/${vendorDetail.image}`
                                        : vendorLogo
                                }
                                alt="Vendor"
                                className={styles.VendorProfileImage}
                            />

                        </a>
                    </div>
                    <div className={`${styles.vendorDetails}`}>
                        <a
                            className={`no-underline text-black ${styles.vendorProfileLink}`}
                            href={singleProduct?.storeId ? `/vendor/profile/${singleProduct.storeId}` : "#"}
                        >
                            <h4 onClick={() => navigate(`/vendor/profile/${singleProduct?.storeId}`)} className={`${styles.vendorName}`}>
                                {vendorDetail.store_name}
                            </h4>
                            <p onClick={() => navigate(`/vendor/profile/${singleProduct?.storeId}`)} className={`${styles.vendorDetail} mb-0`}>
                                {vendorDetail.email}
                            </p>
                            <p onClick={() => navigate(`/vendor/profile/${singleProduct?.storeId}`)} className={`${styles.vendorDetail} mb-0`}>
                                {vendorDetail.store_phone}
                            </p>
                        </a>
                    </div>
                </div>
                {/* <div className={`${styles.contactButtons} pt-3`}>
                        <a href={`tel:+923155625755`} className={`${styles.vendorContactBtn} text-decoration-none btn`}>Call Vendor</a>
                        <a href={`mailto:${vendorDetail.email}`} className={`${styles.vendorContactBtn} text-decoration-none btn`}>Email Vendor</a>
                    </div> */}
            </div>
        </>
    );
}

export default HomeProductsVendorSidebar;