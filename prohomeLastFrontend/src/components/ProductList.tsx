import { useDispatch } from 'react-redux';
import styles from '../style/ProductList.module.css';
import { Product } from './types';
import { Link } from 'react-router-dom';
import { deleteProduct } from '../features/products/productSlice';
import { AppDispatch } from '../store/store';

interface ProductListProp {
  content: Product;
}

function ProductList({ content }: ProductListProp) {
  const dispatch = useDispatch<AppDispatch>();

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      dispatch(deleteProduct(content.id));
    }
  };

  const truncateDescription = (description?: string, maxWords: number = 40): string => {
    if (!description) {
      return 'No description available.';
    }
    const words = description.split(' ');
    if (words.length > maxWords) {
      return words.slice(0, maxWords).join(' ') + '...';
    }
    return description;
  };

  return (
    <div className={`${styles.productList} d-flex`}>
      <div className={styles.a}>
        <img
          className={styles.mainImage}
          src={`${import.meta.env.VITE_PROHOMEZ_BACKEND_URL}/images/${content.featureImage}`}
          alt={content.productName || 'Pro Homez'}
        />
      </div>
      <div className={styles.productInfoBox}>
        <h3 className={`${styles.productInfoBoxName} mb-0`}>{content.productName}</h3>
        <p className={`${styles.productInfoBoxDescription} mb-0`}>
          {truncateDescription(content.productDescription, 35)}
        </p>
        <div className={`${styles.actionBtns} mt-2`}>
          <Link to={`/vendor-dashboard/products/edit/${content.slug}`}>Edit</Link>
          <button onClick={handleDelete} className="text-danger border-none">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductList;
