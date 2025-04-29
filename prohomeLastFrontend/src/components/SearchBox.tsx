import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import styles from '../style/SearchBox.module.css';
import defaultImage from '../assets/images/prohomez-logo.webp';
const API_BASE = import.meta.env.VITE_PROHOMEZ_BACKEND_URL;

interface Product {
  productName: string;
  slug: string;
  selectedImages: string;
  mainCategory: string; // Updated field
}
interface ProductGridProps {
  mainCategory: string;
}

const SearchBox:React.FC<ProductGridProps> = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [showResults, setShowResults] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      if (searchTerm.trim().length < 2) {
        setSearchResults([]);
        return;
      }

      try {
        console.log(`Fetching products for: ${searchTerm}`);

        const response = await fetch(`${API_BASE}/products?search=${searchTerm}`, {
          headers: { 'Accept': 'application/json' },
        });

        if (!response.ok) {
          console.error(`API returned error: ${response.status} ${response.statusText}`);
          const text = await response.text();
          console.error("Response text:", text);
          return;
        }

        const data = await response.json();
        console.log("API Response:", data);

        if (Array.isArray(data)) {
          // Map featureImage to selectedImages
          const formattedData = data.map(product => ({
            ...product,
            selectedImages: product.featureImage // Ensure correct field mapping
          }));
          setSearchResults(formattedData);
        } else {
          console.error("Invalid JSON response", data);
          setSearchResults([]);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    const debounceTimer = setTimeout(fetchProducts, 500);
    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
    }
  };

  return (
    <div className={styles.inputBox}>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          className={styles.inputText}
          placeholder="Search here..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setShowResults(true)}
          onBlur={() => setTimeout(() => setShowResults(false), 200)}
        />
        <button type="submit" className={styles.searchButton}>
          <FaSearch className={styles.searchButtonfaSearch} />
        </button>
      </form>

      {showResults && searchResults.length > 0 && (
        <div className={styles.searchResults}>
          {searchResults.map((product) => (
            <div
              key={product.slug}
              className={styles.searchResultItem}
              onMouseDown={(e) => e.preventDefault()} 
              onClick={() => navigate(`/products/${product.mainCategory}/${product.slug}`)}
            >
              <img 
                src={product.selectedImages.startsWith("http") ? product.selectedImages : `${import.meta.env.VITE_PROHOMEZ_BACKEND_URL}/images/${product.selectedImages}`} 
                alt={product.productName}
                className={styles.searchResultImage}
                onError={(e) => { 
                  (e.target as HTMLImageElement).src = defaultImage; // Fallback image
                }}
              />
              <span className={styles.productName1}>{product.productName}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBox;
