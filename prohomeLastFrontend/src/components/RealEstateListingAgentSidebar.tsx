import styles from '../style/RealEstateListingAgentSidebar.module.css'
import vendorLogo from '../assets/images/WhatsApp Image 2025-03-13 at 23.10.23_ac2acca4.jpg'
import { VendorDetail } from './types'
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { useNavigate } from 'react-router-dom';

interface RealEstateListingProps {
    vendorDetail: VendorDetail
}

function RealEstateListingAgentSidebar({vendorDetail}: RealEstateListingProps) {
    const {singleProduct}=useSelector((state:RootState)=>state.products)
    const navigate=useNavigate()

    console.log(singleProduct)
  return (
    <>
        <div className={`${styles.realEstateListingAgent}`}>
            <h5  className={`${styles.listingAgentHeading}`}>Listing Agent</h5>
            <div className={`${styles.listingAgentDetailBox} d-flex my-4`}>
                <div className={`${styles.imgBox}`}>
                    <a className='flex justify-center' href={`/vendor/profile/${singleProduct?.storeId}`}>
                    <img 
  src={vendorDetail.image 
    ? `${import.meta.env.VITE_PROHOMEZ_BACKEND_URL}/images/${vendorDetail.image}` 
    : vendorLogo} 
  alt="ProHomez" 
/>
</a>
                </div>
                <div className={`${styles.listingAgentDetail}`}>
                <a
  className="no-underline text-black"
  href={singleProduct?.storeId ? `/vendor/profile/${singleProduct.storeId}` : "#"}
>
                    <h4 onClick={()=>navigate(`/vendor/profile/${singleProduct?.storeId}`)} className={`${styles.vendorName}`}>{vendorDetail.store_name}</h4>
                    <p onClick={()=>navigate(`/vendor/profile/${singleProduct?.storeId}`)} className={`${styles.vendorDetail} mb-0`}>{vendorDetail.email}</p>
                    <p onClick={()=>navigate(`/vendor/profile/${singleProduct?.storeId}`)} className={`${styles.vendorDetail} mb-0`}>{vendorDetail.store_phone}</p>
                    </a>
                </div>
            </div>
                <div className={`${styles.contactButtons} pt-3`}>
                    <a href={`tel:+923155625755`} className={`${styles.vendorContactBtn} text-decoration-none btn`}>Speak with Agent</a>
                    <a href={`mailto:${vendorDetail.email}`} className={`${styles.vendorContactBtn} text-decoration-none btn`}>Reach Out via Email</a>
                </div>
                
        </div>
    </>
  )
}

export default RealEstateListingAgentSidebar