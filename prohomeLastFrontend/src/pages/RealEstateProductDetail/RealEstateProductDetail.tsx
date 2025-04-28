import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState, useMemo } from 'react';
import { fetchSingleProduct, fetchProductsByCategory } from '../../features/products/productSlice';
import { RootState, AppDispatch } from '../../store/store';
import GalleryBox from '../../components/GalleryBox';
import styles from './RealEstateProductDetail.module.css';
import { IoBed } from 'react-icons/io5';
import { GiBathtub } from 'react-icons/gi';
import { MdOutlineArrowDropUp, MdSquareFoot } from 'react-icons/md';
import { IoMdArrowDropdown } from 'react-icons/io';
import RealEstateListingAgentSidebar from '../../components/RealEstateListingAgentSidebar';
import RatingComponent from '../../components/RatingComponent';

// Define Product type if not already defined
interface Product {
    id: number;
    productName: string;
    slug: string;
    productPrice: number;
    featureImage: string;
    selectedCategory: string;
    amenities: string;
    reviews?: { rating: number; comment: string }[]; // Optional field
}

function RealEstateProductDetail() {
    const { slug } = useParams<{ slug: string }>();
    const dispatch = useDispatch<AppDispatch>();

    console.log("Product ID (slug) received:", slug); // Debugging log

    const product = useSelector((state: RootState) => state.products.singleProduct);
    const productStatus = useSelector((state: RootState) => state.products.status);
    const categoryProducts = useSelector((state: RootState) => state.products.categoryProducts) as Product[];
    const [selectedCurrency, setSelectedCurrency] = useState("USD");
    const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

    useEffect(() => {
        if (slug) {
            dispatch(fetchSingleProduct(slug));
        }
    }, [slug, dispatch]);

    useEffect(() => {
        if (product?.selectedCategory && categoryProducts.length === 0) {
            dispatch(fetchProductsByCategory(product.selectedCategory));
        }
    }, [product?.selectedCategory, categoryProducts.length, dispatch]);

    const parseJSONSafely = (data: any, fallback: any = {}) => {
        try {
            return typeof data === 'string' ? JSON.parse(data) : data;
        } catch (error) {
            console.error("JSON Parse Error:", error);
            return fallback;
        }
    };

    // Ensure product is not null before accessing properties
    const realEstateDetails = useMemo(() => parseJSONSafely(product?.realEstateDetails), [product]);
    const selectedImages = useMemo(() => parseJSONSafely(product?.selectedImages, []), [product]);
    const vendorDetails = useMemo(() => parseJSONSafely(product?.vendorDetails), [product]);
    const amenities = useMemo(() => parseJSONSafely(product?.amenities, []), [product]);

    // Memoize suggested products to prevent re-computation
    const suggestedProducts = useMemo(() => {
        if (categoryProducts.length > 0) {
            // Filter products that have reviews
            const productsWithReviews = categoryProducts.filter((p) => (p.reviews?.length ?? 0) > 0);
    
            if (productsWithReviews.length > 0) {
                // Sort by review count safely, handling undefined case
                return [
                    productsWithReviews.sort(
                        (a, b) => (b.reviews?.length ?? 0) - (a.reviews?.length ?? 0)
                    )[0],
                ];
            } else {
                // If no products have reviews, return random suggestions
                return [...categoryProducts].sort(() => 0.5 - Math.random()).slice(0, 8);
            }
        }
        return [];
    }, [categoryProducts]);
    
    if (productStatus === 'loading' || !product) {
        return <div>Loading...</div>;
    }

    const convertCurrency = (price: number, currency: string) => {
        const exchangeRates: { [key: string]: number } = {
            USD: 1,
            AED: 3.67,
            PKR: 280,
            GBP: 0.78,
        };
        return (price * (exchangeRates[currency] || 1)).toFixed(2);
    };

    const truncateDescription = (description: string | null, maxWords: number) => {
        if (!description) return '';
        const words = description.split(' ');
        return words.length > maxWords ? words.slice(0, maxWords).join(' ') + '...' : description;
    };

    return (
        <>
            <section className={`${styles.propertyBasics} pt-5 pb-4`}>
                <div className="container">
                    {realEstateDetails && (
                        <div className="column-gap-5 d-flex justify-content-center">
                            {realEstateDetails.productBeds && (
                                <div className={`${styles.propertyDetail}`}>
                                    <p className={`${styles.propertyDetailIcon}`}><IoBed /></p>
                                    <h5 className={`${styles.propertyDetailHeading}`}>{realEstateDetails.productBeds} Beds</h5>
                                </div>
                            )}
                            {realEstateDetails.productBaths && (
                                <div className={`${styles.propertyDetail}`}>
                                    <p className={`${styles.propertyDetailIcon}`}><GiBathtub /></p>
                                    <h5 className={`${styles.propertyDetailHeading}`}>{realEstateDetails.productBaths} Baths</h5>
                                </div>
                            )}
                            {realEstateDetails.propertyArea && (
                                <div className={`${styles.propertyDetail}`}>
                                    <p className={`${styles.propertyDetailIcon}`}><MdSquareFoot /></p>
                                    <h5 className={`${styles.propertyDetailHeading}`}>{realEstateDetails.propertyArea} SQFT</h5>
                                </div>
                            )}
                        </div>
                    )}
                    <div className={styles.RatingDiv}>
                    <RatingComponent productId={Number(product.id)} />
                    </div>
                </div>
            </section>

            <section className={`${styles.galleryBox}`}>
                {selectedImages.length > 0 && <GalleryBox featureImage={product.featureImage} images={selectedImages} />}
            </section>

            <section className={`${styles.productDetailBox}`}>
                <div className="container">
                    <div className="row">
                        <div className="col-md-8 col-xxl-7">
                        <section className={styles.amenitiesSection}>
    <h4 className={styles.amenitiesHeading}>Amenities</h4>
    <div className={styles.amenitiesGrid}>
        {amenities.map((amenity: string, index: number) => (
            <div key={index} className={styles.amenityItem}>
                <span className={styles.amenityCircle}></span>
                <span className={styles.amenityText}>{amenity}</span>
            </div>
        ))}
    </div>
</section>

                            <h3 className={`${styles.productName} mb-0`}>{product.productName}</h3>
                            <h4 className={`${styles.productPrice} mb-0`}>
                                <h3 className={`fs-6 ${styles.realEstateDetailspriceh3}`}>Price:</h3>
                                <select value={selectedCurrency} onChange={(e) => setSelectedCurrency(e.target.value)} className={styles.currencyDropdown}>
                                    <option value="PKR">PKR</option>
                                    <option value="AED">AED</option>
                                    <option value="GBP">GBP</option>
                                    <option value="USD">USD</option>
                                </select>
                                <p className={styles.currencyHeading}><strong>{selectedCurrency}:</strong> {convertCurrency(product.productPrice, selectedCurrency)}</p>
                            </h4>

                            <p className={`${styles.productDescription} mb-0`}>
                                {isDescriptionExpanded ? product.productDescription : truncateDescription(product.productDescription, 90)}
                                {product.productDescription?.split(' ').length > 90 && (
                                    <button onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)} className={`${styles.readMoreButton}`}>
                                        {isDescriptionExpanded ? (<>Show Less<MdOutlineArrowDropUp /></>) : (<>Read More<IoMdArrowDropdown /></>)}
                                    </button>
                                )}
                            </p>
                        </div>
                        <div className="col-md-4 col-xxl-5">
                            {product.vendorDetails && <RealEstateListingAgentSidebar vendorDetail={vendorDetails} />}
                        </div>
                    </div>
                </div>
            </section>
            <h4 className={styles.suggestedHeading}>Suggested Products</h4>
                    <div className={styles.suggestedContainer}>
            {suggestedProducts.map((suggestedProduct: Product) => (
    <div key={suggestedProduct.id} className={`col-3 col-sm-6 col-md-3 mb-4`}>
        <Link to={`/products/real-estate/${suggestedProduct.slug}`} className="text-decoration-none">
            <div className={`card shadow-sm ${styles.suggestedcard}`}>
                <img src={`${import.meta.env.VITE_PROHOMEZ_BACKEND_URL}/images/${suggestedProduct.featureImage}`} alt={suggestedProduct.productName} className="card-img-top" />
                <div className="card-body">
                    <h2 className={`fs-5 ${styles.productDetail}`}>{suggestedProduct.productName}</h2>
                    <h3 className={`fs-6 ${styles.productDetail}`}>Price: ${suggestedProduct.productPrice}</h3>
                    <h3 className={`fs-6 ${styles.productDetail}`}>Category: {suggestedProduct.selectedCategory}</h3>
                </div>
            </div>
        </Link>
    </div>
))}
</div>
        </>
    );
}

export default RealEstateProductDetail;
