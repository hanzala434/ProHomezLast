import { useEffect, useState } from "react";
import axios from "axios"; // Import Axios
import { Link } from "react-router-dom";
import styles from "../style/SuggestedProducts.module.css";

interface Product {
  id: number;
  productName: string;
  slug: string;
  productPrice: number;
  featureImage: string;
  selectedCategory: string;
  vendorDetails?: { store_name: string };
}

function SuggestedProducts({ selectedCategory }: { selectedCategory: string }) {
  const [suggestedProducts, setSuggestedProducts] = useState<Product[]>([]);

  const fetchSuggestedProducts = async (category: string) => {
    try {
      const response = await axios.get(`/productsby?category=${category}`);
      return response.data; // Assuming the API returns the products directly
    } catch (error) {
      console.error("Error fetching suggested products:", error);
      return []; // Return an empty array on error
    }
  };

  useEffect(() => {
    if (selectedCategory) {
      fetchSuggestedProducts(selectedCategory).then((products) => {
        setSuggestedProducts(products);
      });
    }
  }, [selectedCategory]);

  return (
    <div className={styles.suggestedProductsSection}>
      <h3>Suggested Products</h3>
      <div className={styles.suggestedProductsGrid}>
        {suggestedProducts.map((suggestedProduct) => (
          <Link
            to={`/products/home products/${suggestedProduct.slug}`}
            key={suggestedProduct.id}
            className={styles.suggestedProductCard} // Now the whole card is clickable
          >
            <img
              src={`${import.meta.env.VITE_PROHOMEZ_BACKEND_URL}/images/${suggestedProduct.featureImage}`}
              alt={suggestedProduct.productName}
            />
            <h4 className={styles.paraStyle}>{suggestedProduct.productName}</h4>
            <p className={styles.paraStyle}>Price: ${suggestedProduct.productPrice.toFixed(2)}</p>
            <p className={styles.paraStyle}>Category: {suggestedProduct.selectedCategory}</p> 
          </Link>
        ))}
      </div>
    </div>
  );
}

export default SuggestedProducts;
