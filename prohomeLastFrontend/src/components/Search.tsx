import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import styles from "../style/Search.module.css";
const API_BASE = import.meta.env.VITE_PROHOMEZ_BACKEND_URL;
import defaultImage from '../assets/images/prohomez-logo.webp';

interface Product {
  productName: string;
  slug: string;
  featureImage: string; // Ensure this field is coming from API
  mainCategory: string;
  productPrice: number;
}
interface ProductGridProps {
  mainCategory: string;
}
const Search:React.FC<ProductGridProps> = ({ mainCategory }) => {
  const [searchParams] = useSearchParams();
  const [category, setCategory] = useState(mainCategory);
  const searchQuery = searchParams.get("q") || ""; // Get query from URL
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!searchQuery || products.length > 0) return; // 🔴 Prevent unnecessary fetching

    const fetchProducts = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`${API_BASE}/products/?search=${searchQuery}`, {
          headers: { Accept: "application/json" },
        });

        if (!response.ok) {
          throw new Error(`API error: ${response.status} ${response.statusText}`);
        }

        const data: Product[] = await response.json();
        console.log("Fetched Products:", data); // Debugging API response

        setProducts(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchQuery, products.length]);

  return (
    <div className={styles.searchContainer}>
      <h2 className={styles.searchImage4}>Search Results for: "{searchQuery}"</h2>

      {loading && <p>Loading products...</p>}
      {error && <p className={styles.error}>{error}</p>}

      {!loading && !error && products.length === 0 && <p>No products found.</p>}

      <div className={styles.searchImage3}>
        {products.map((product) => (
          <div
            key={product.slug}
            className={styles.searchImage2}
            onClick={() => navigate(`/products/${product.mainCategory}/${product.slug}`)}
          >
            {/* Ensure correct image URL */}
            <img 
              src={product.featureImage.startsWith("http") ? product.featureImage : `${API_BASE}/images/${product.featureImage}`} 
              alt={product.productName} 
              className={styles.searchImage1}
              onError={(e) => { 
                (e.target as HTMLImageElement).src = defaultImage; // Fallback image
              }} 
            />
            <h3>{product.productName}</h3>
            <p>{product.productPrice} $</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Search;
