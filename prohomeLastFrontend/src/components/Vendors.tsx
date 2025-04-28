import { useState, useEffect } from "react";
import styles from "../style/ExploreProducts.module.css";
import VendorCard from "./VendorCard";
import { fetchAllVendors2 } from "../features/products/productSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store/store";

interface ExploreProductProps {
    category?: string;
}

function Vendors({ category }: ExploreProductProps) {
    const [activeCategory, setActiveCategory] = useState("All");
    const dispatch = useDispatch<AppDispatch>();

    const { vendors } = useSelector((state: RootState) => state.products);

    useEffect(() => {
        dispatch(fetchAllVendors2());
    }, [dispatch]);

    const categoryBtns = [
        { name: "All", id: "all-categories" },
        { name: "Real Estate", id: "real-estate-categories" },
        { name: "Home Products", id: "home-product-categories" },
    ];

    const filteredVendors = activeCategory === "All" 
        ? vendors 
        : vendors.filter(vendor => vendor.brand_type === activeCategory);

    return (
        <>
            <div className="container">
                <div className="row">
                    <div className="col-md-12">
                        <h3 className={`${styles.exploreProductHeading} mb-0 text-center`}>
                            Explore Our Trusted Partners in Real Estate & Home Products
                        </h3>
                    </div>
                    {category === "All" && (
                       <div className={`col-md-12 mt-4 ${styles.vendorCategoryButton}`}>
                            <div className="d-flex justify-content-center">
                                {categoryBtns.map((item, index) => (
                                    <button
                                        id={item.id}
                                        className={`${styles.categoriesDisplayBtn} btn ${activeCategory === item.name ? styles.categoryActive : ''}`}
                                        key={index}
                                        onClick={() => setActiveCategory(item.name)}
                                    >
                                        {item.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                    <div className="col-md-12">
                        <div className={`row justify-content-center g-1 ${styles.vendorContainer}`}>
                            {filteredVendors.length === 0 ? (
                                <div className="col-md-12 text-center">
                                    <p>No Vendors found in this category.</p>
                                </div>
                            ) : (
                                filteredVendors.map((vendor, index) => (
                                    <div 
                                        key={index} 
                                        className={`col-md-2 col-sm-3 col-5 d-flex justify-content-center
`}                                        style={{ marginBottom: "4px" }} 
                                    >
                                        <VendorCard 
                                            key={vendor.store_id} 
                                            vendor={{ ...vendor, image: vendor.image ?? "" }} 
                                            style={{ 
                                                maxWidth: "200px", 
                                                height: "15vh", 
                                                minHeight: "10vh" 
                                            }} 
                                        />
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Vendors;
