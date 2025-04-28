import styles from '../style/VendorProducts.module.css'
import ProductList from './ProductList'
import { Product } from './types'

interface VendorProductsProps {
  products: Product[];
}

function VendorProducts({products}: VendorProductsProps) {
  return (
    <div className={`${styles.vendorProductsMainContainer}`}>
        {
            products.map((item, index) => (
                <div className={`${styles.productListBox}`} key={index}>
                    <ProductList content={item} />
                </div>
            ))
        }
    </div>
  )
}

export default VendorProducts