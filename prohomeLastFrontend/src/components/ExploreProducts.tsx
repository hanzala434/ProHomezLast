import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store/store";
import { fetchProducts } from "../features/products/productSlice";
import styles from "../style/ExploreProducts.module.css";
import ProductBox from "./ProductBox";
import RatingComponent from "./RatingComponent";

interface ExploreProductProps {
    category: string;
}

function ExploreProducts({ category }: ExploreProductProps) {
    const dispatch = useDispatch<AppDispatch>();

    // Fetch products from Redux store
    const products = useSelector((state: RootState) => state.products.items);
    const status = useSelector((state: RootState) => state.products.status);

    // Dynamically extract unique categories from products
    const uniqueCategories = [
        "All",
        ...new Set(products.map((item) => item.mainCategory)),
    ];

    // State to track active category
    const [activeCategory, setActiveCategory] = useState(category || "All");
    useEffect(() => {
        // Always update the active category when prop changes
        if (category && category !== activeCategory) {
            setActiveCategory(category);
        }
    
        // Fetch products whenever the category changes
        dispatch(fetchProducts());
    }, [category, dispatch]);
    
    // useEffect(() => {
    //     console.log("Fetched Products:", products);
    // }, [products]);
    

    // Filter products based on active category
    const filteredProducts =
        activeCategory === "All"
            ? products
            : products.filter((item) => item.mainCategory === activeCategory);

    return (
        <div className="container">
            <div className="row">
                <div className="col-md-12">
                    <h3 className={`${styles.exploreProductHeading} mb-0 text-center`}>
                        Explore Products
                    </h3>
                </div>

                {/* Show category buttons dynamically */}
                {uniqueCategories.length > 1 && (
                    <div className="col-md-12 mt-4">
                        <div className="d-flex justify-content-center">
                            {uniqueCategories?.map((cat, index) => (
                                <button
                                    key={index}
                                    className={`${styles.categoriesDisplayBtn} btn ${
                                        activeCategory === cat ? styles.categoryActive : ""
                                    }`}
                                    onClick={() => setActiveCategory(cat || "home products")}

                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                <div className="col-md-12">
                    <div className="row">
                        {status === "loading" ? (
                            <div className="col-md-12 text-center">
                                <p>Loading products...</p>
                            </div>
                        ) : filteredProducts.length === 0 ? (
                            <div className="col-md-12 text-center">
                                <p className="py-3">No products found in this category.</p>
                            </div>
                        ) : (
                            filteredProducts.map((item, index) => (
                                <div className="col-md-2 pt-4 px-2" key={index}>
                                    <ProductBox productDetail={item} />
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
    
            
        </div>
    );
}

export default ExploreProducts;
