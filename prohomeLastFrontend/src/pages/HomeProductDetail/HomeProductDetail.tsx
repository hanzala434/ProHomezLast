import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import styles from "./HomeProductDetail.module.css";
import FetchedImage from "../../components/FetchedImage";
import { AppDispatch, RootState } from "../../store/store";
import { fetchSingleProduct, fetchProductsByCategory } from "../../features/products/productSlice";
import { TiMinus, TiPlus } from "react-icons/ti";
import { IoMdArrowDropdown } from "react-icons/io";
import star from "../../assets/svg/star.svg";
import RatingComponent from "../../components/RatingComponent";
import HomeProductsVendorSidebar from "../../components/HomeProductsVendorSidebar";
import SuggestedProducts from "../../components/SuggestedProducts";
// import RatingComponent from "../../components/RatingComponent";

interface Product {
  id: number;
  productName: string;
  slug: string;
  productPrice: number;
  featureImage: string;
  selectedCategory: string;
  reviews?: { rating: number; comment: string }[];
}
// function SuggestedProducts({ selectedCategory }: { selectedCategory: string }) {

//   const [suggestedProducts, setSuggestedProducts] = useState<Product[]>([]);


//   const fetchSuggestedProducts = async (category: string) => {

//     try {

//       const response = await axios.get(`/api/productsby?category=${category}`);

//       return response.data; // Assuming the API returns the products directly

//     } catch (error) {

//       console.error("Error fetching suggested products:", error);

//       return []; // Return an empty array on error

//     }

//   };


//   useEffect(() => {

//     if (selectedCategory) {

//       fetchSuggestedProducts(selectedCategory).then((products) => {

//         setSuggestedProducts(products);

//       });

//     }

//   }, [selectedCategory]);}
function HomeProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const dispatch = useDispatch<AppDispatch>();

  const product = useSelector((state: RootState) => state.products.singleProduct);
  const productStatus = useSelector((state: RootState) => state.products.status);
  const categoryProducts = useSelector((state: RootState) => state.products.categoryProducts) as Product[];


  const [value, setValue] = useState(1);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [currency, setCurrency] = useState("USD");
  const [suggestedProducts, setSuggestedProducts] = useState<any[]>([]);

  useEffect(() => {
    console.log("Extracted slug:", slug); // Debugging: Ensure correct slug is received
    if (slug) {
      dispatch(fetchSingleProduct(slug));
    }
  }, [slug, dispatch]);

  useEffect(() => {
    console.log("Fetched product:", product); // Debugging: Ensure the correct product is fetched
    if (product && product.selectedCategory) {
      dispatch(fetchProductsByCategory(product.selectedCategory));
    }
  }, [product, dispatch]);

  useEffect(() => {
    if (categoryProducts.length > 0) {
      const highestReviewedProduct = [...categoryProducts]
      .filter((p: Product) => (p.reviews?.length ?? 0) > 0)
      .sort((a, b) => (b.reviews?.length ?? 0) - (a.reviews?.length ?? 0))[0];
      setSuggestedProducts(highestReviewedProduct ? [highestReviewedProduct] : categoryProducts.slice(0, 8));
    }
  }, [categoryProducts]);

  const exchangeRates = { USD: 1, PKR: 280, AED: 3.67, GBP: 0.78 } as const;

  const convertPrice = (price: number) => {
    return (price * (exchangeRates[currency as keyof typeof exchangeRates] || 1)).toFixed(2);
  };
  
  if (productStatus === "loading" || !product) return <div>Loading...</div>;
  console.log("Redux Product State:", product);
  return (
    <div className={styles.homeProductDetailMainBox1}>
      <section className={`${styles.homeProductDetailMainBox} py-5`}>
        <div className="container">
          <div className="row">
            
          <FetchedImage images={product.selectedImages || []} />
            <div className="col-md-6 px-4">
              <div className={`${styles.productDetailContentMainBox} py-3`}>
                <h2 className={styles.productName}>{product.productName}</h2>
                <h4 className={styles.vendorName}>
                BY <Link to="#">{product.vendorDetails?.store_name || "Unknown Vendor"}</Link>
                
                </h4>
                <div className={`${styles.reviewBox} d-flex py-1`}>
                  {product.numberOfReviews > 0 &&
                    Array.from({ length: product.numberOfReviews }).map((_, index) => (
                      <img key={index} src={star} alt="Pro Homez" className={styles.reviewStar} />
                    ))}
                </div>
                <RatingComponent productId={Number(product.id)} />
                  
                <div className="currency-selector mt-2.5 mb-5">
                  <label className={styles.labelclass}>Select Currency: </label>
                  <select value={currency} onChange={(e) => setCurrency(e.target.value)} className={styles.selectclass}>
                    <option value="USD">USD ($)</option>
                    <option value="PKR">PKR (₨)</option>
                    <option value="AED">AED (د.إ)</option>
                    <option value="GBP">GBP (£)</option>
                  </select>
                  <p className={styles.productPrice}>Price: {currency} {convertPrice(product.productPrice)}</p>
                </div>

                <div className="d-flex gap-3 align-items-center my-3">
                  <div className={`${styles.cartValueBox} d-flex align-items-center`}>
                    <span className={styles.cartvalueController} onClick={() => setValue((prev) => Math.max(1, prev - 1))}>
                      <TiMinus />
                    </span>
                    <input
                      type="number"
                      className={styles.cartValueDisplay}
                      value={value}
                      onChange={(e) => setValue(Math.max(1, Math.min(15, parseInt(e.target.value, 10) || 1)))}
                    />
                    <span className={styles.cartvalueController} onClick={() => setValue((prev) => Math.min(15, prev + 1))}>
                      <TiPlus />
                    </span>
                  </div>
                  <button
  className={`${styles.addToCartBtn} btn`}
  onClick={() => {
    const cart: { id: number; quantity?: number }[] = JSON.parse(localStorage.getItem("cart") || "[]");

    localStorage.setItem(
      "cart",
      JSON.stringify([
        ...cart.filter((item) => item.id !== Number(product.id)), // Convert `product.id` to number
        { ...product, quantity: value }
      ])
    );

    alert("Product added to cart successfully!");
  }}
>
  Add To Cart
</button>

                  
                </div>
                

                <div className={`${styles.descriptionBox} pb-3`}>
                  <h5 className={styles.productDetailHeading}>Description</h5>
                  <p className={`${styles.productDetailPara} mb-0`}>
                    {isDescriptionExpanded ? product.productDescription : `${product.productDescription.split(" ").slice(0, 90).join(" ")}...`}
                    {product.productDescription.split(" ").length > 90 && (
                      <button onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)} className={styles.readMoreButton}>
                        {isDescriptionExpanded ? <>Show Less</> : <>Read More <IoMdArrowDropdown /></>}
                      </button>
                    )}
                  </p>
                  </div>
<HomeProductsVendorSidebar vendorDetail={product.vendorDetails || {}} />

              </div>
            </div>
          </div>
        </div>
        
      </section>
      {/* <div className={styles.suggestedProductsSection}>

<h3>Suggested Products</h3>

<div className={styles.suggestedProductsGrid}>

  {suggestedProducts.map((suggestedProduct) => (

    <div key={suggestedProduct.id} className={styles.suggestedProductCard}>

      <img src={suggestedProduct.featureImage} alt={suggestedProduct.productName} />

      <h4>{suggestedProduct.productName}</h4>

      <p>Price: ${suggestedProduct.productPrice.toFixed(2)}</p>

      <Link to={`/product/${suggestedProduct.slug}`} className={styles.viewProductButton}>

        View Product

      </Link>

    </div>

  ))}

</div>
// Inside your HomeProductDetail component

</div> */}
      <div className={styles.suggestedDiv}>
      <SuggestedProducts selectedCategory={product.selectedCategory} />
      </div>
    </div>
    
  );
}

export default HomeProductDetail;
