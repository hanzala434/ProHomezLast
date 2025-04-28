// CategoryDisplay.tsx
import React from "react";
import { useParams } from "react-router-dom";
import ProductGrid from "./ProductGrid";
import styles from "../style/CategoryPage.module.css"
const CategoryPage: React.FC = () => {
  const { category } = useParams<{ category: string }>();
  return (
    <div className="m-4 flex flex-col">
      <h1 className={styles.categoryh1}>{category}</h1>
      <ProductGrid category={category || "luxury appartments"} />
    </div>
  );
};

export default CategoryPage;
