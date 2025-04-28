import { Link } from 'react-router-dom';
import styles from '../style/ProductBox.module.css';
import { Product } from './types';
import star from '../assets/svg/star.svg'

interface ProductBoxProps {
  productDetail: Product; 
}

function ProductBox({ productDetail }: ProductBoxProps) {
  const { productName = 'Unnamed Product', featureImage = '/placeholder.png', productPrice ,discountedPrice} = productDetail;
  const generateSlug = (category?: string, productSlug?: string) => {
    const slugCategory = category?.toLowerCase().replace(/\s+/g, '-');
    return `/products/${slugCategory}/${productSlug}`;
  };

  return (
    <Link to={generateSlug(productDetail.mainCategory, productDetail.slug)} className='text-decoration-none'>
        <div className={styles.productBox}>
          <img src={`${import.meta.env.VITE_PROHOMEZ_BACKEND_URL}/images/${featureImage}`} alt={productName} className={`${styles.prouctImage}`} />
          <h3 className={`${styles.productName} mb-0`}>{productName}</h3>
          <div className={`${styles.reviewBox} d-flex py-1`}>
            {productDetail.numberOfReviews? Array.from({ length: productDetail.numberOfReviews }).map((_, index) => (
              <img
                key={index}
                src={star}
                alt="Pro Homez"
                className={`${styles.reviewStar}`}
              />
            )): <></>}
            
          </div>
          {productPrice && (
            <p className={`${styles.productPrice} mb-0`}>
              <span className={`${productDetail.discountedPrice && styles.cuttedPrice}`}>${productPrice}</span>
             
            </p>
          )}
           {discountedPrice && (
                 <p  className={`${styles.discountedPrice} mb-0`}>
                 <span className={`${styles.discountedPrice}`}>${discountedPrice}</span>
                
               </p>
              )}
        </div>
    </Link>
  );
}

export default ProductBox;