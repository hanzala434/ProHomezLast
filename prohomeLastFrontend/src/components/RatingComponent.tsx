import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import styles from "../style/RatingComponent.module.css";

const API_BASE = import.meta.env.VITE_PROHOMEZ_BACKEND_URL;

interface RatingProps {
  productId: number;
}

const RatingComponent: React.FC<RatingProps> = React.memo(({ productId }) => {
  const [rating, setRating] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [userHasRated, setUserHasRated] = useState(false);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);

  // Check if the user has already rated
  useEffect(() => {
    const ratedProducts = JSON.parse(localStorage.getItem("ratedProducts") || "{}");
    if (ratedProducts[productId]) {
      setUserHasRated(true);
      setSelectedRating(ratedProducts[productId]);
    }
  }, [productId]);

  // Fetch product rating
  useEffect(() => {
    const fetchRating = async () => {
      try {
        const response = await axios.get(`${API_BASE}/rating/${productId}`);
        setRating(response.data.result[0]?.avgRating || 0);
      } catch (error) {
        setError("Failed to fetch rating");
      } finally {
        setLoading(false);
      }
    };

    fetchRating();
  }, [productId]);

  const computedLocalRating = useMemo(() => {
    return rating !== null ? rating.toFixed(1) : "N/A";
  }, [rating]);

  const handleRating = async (ratingValue: number) => {
    if (userHasRated) return;

    try {
      const response = await axios.post(`${API_BASE}/submitrating`, { productId, rating: ratingValue });
      setRating(response.data.rating);
      
      // Store user rating in localStorage
      const storedRatedProducts = JSON.parse(localStorage.getItem("ratedProducts") || "{}");
      localStorage.setItem(
        "ratedProducts",
        JSON.stringify({ ...storedRatedProducts, [productId]: ratingValue })
      );

      setUserHasRated(true);
      setSelectedRating(ratingValue);
    } catch (error) {
      setError("Failed to submit rating");
    }
  };

  return (
    <div className={`rating-container ${styles.ratingcontainer1}`}>
      <h3>Product Rating</h3>

      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}

      <p className={styles.ratep1}>
        Average Rating: <strong>{computedLocalRating}</strong>/5
      </p>

      {!userHasRated ? (
        <div className={`rating-buttons ${styles.userStar1}`}>
          {[1, 2, 3, 4, 5].map((num) => (
            <button key={num} onClick={() => handleRating(num)} className="rating-btn">
              {num} ⭐
            </button>
          ))}
        </div>
      ) : (
        <p>You rated this product: {selectedRating} ⭐</p>
      )}
    </div>
  );
});

export default RatingComponent;
