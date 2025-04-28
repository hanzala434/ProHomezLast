import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styles from "../style/ProductGrid.module.css"; 
const API_BASE = import.meta.env.VITE_PROHOMEZ_BACKEND_URL;

interface Product {
  id: string;
  productName: string;
  productPrice: number;
  mainCategory: string;
  selectedCategory: string;
  featureImage: string; // Main image
  selectedImages: string[]; // Additional images
}

interface ProductGridProps {
  category: string;
}

const   ProductGrid: React.FC<ProductGridProps> = ({ category }) => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    console.log("Fetching products for category:", category);
    fetch(`${API_BASE}/productsby?category=${encodeURIComponent(category)}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("API Response:", data);
        setProducts(Array.isArray(data) ? data : []);
      })
      .catch((error) => console.error("Error fetching products:", error));
  }, [category]);
  

  return (
    <div className={styles.container}>
      <div className="row">
        {products.length === 0 ? (
          <div className="col-md-12 text-center">
            <p>No products found in this category.</p>
          </div>
        ) : (
          products.map((product) => {
            const categoryType = product.mainCategory.toLowerCase().includes("real estate")
              ? "real-estate"
              : "home-products";

            const productSlug = product.productName.toLowerCase().replace(/\s+/g, "-");

            return (
              <div key={product.id} className={`col-md-4 mb-4 ${styles.pro1}`}>
                <Link to={`/products/${categoryType}/${productSlug}`} className="text-decoration-none ">
                  <div className={styles.card}>
                    <img
                      src={`${import.meta.env.VITE_PROHOMEZ_BACKEND_URL}/images/${product.featureImage}`}
                      alt={product.productName}
                      className={styles.cardImgTop}
                    />
                    <div className={styles.cardBody}>
                      <h1>{product.productName}</h1>
                      <p>Price: ${product.productPrice}</p>
                      <p>Category: {product.selectedCategory}</p>

                      
                    </div>
                  </div>
                </Link>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ProductGrid;
