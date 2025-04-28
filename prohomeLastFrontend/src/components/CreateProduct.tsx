  import React, { useState, useEffect } from 'react';
  import { useNavigate } from 'react-router-dom';
  import styles from '../style/CreateProduct.module.css';
  import { MdPermMedia } from 'react-icons/md';
  import { categories } from './data';
  import ImageSelection from './ImageSelection';
  import { useDispatch, useSelector } from 'react-redux';
  import { createProduct, fetchVendorDetails, fetchVendorProducts } from '../features/products/productSlice.ts';
  import { AppDispatch, RootState } from '../store/store.ts';
// import { createPost } from '../features/posts/postsSlice.ts';
// import avatar from '../assets/images/avatar.png'

  function CreateProduct() {
    const [selectedImages, setSelectedImages] = useState<string[]>([]);
    const [isImageSelectionVisible, setImageSelectionVisible] = useState(false);
    const [productName, setProductName] = useState<string>('');
    const [productPrice, setProductPrice] = useState<string>('');
    const [discountedPrice, setDiscountedPrice] = useState<number | undefined>();
    const [productDescription, setProductDescription] = useState<string>('');
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [productBeds, setProductBeds] = useState<number>(0);  // Add state for productBeds
    const [productBaths, setProductBaths] = useState<number>(0);  // Add state for productBaths
    const [propertyArea, setPropertyArea] = useState<number>(0);
    const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);

    const [errors, setErrors] = useState({
      productName: '',
      productPrice: '',
      productDescription: '',
      selectedCategory: '',
      selectedImages: '',
      propertyBeds: '',
      propertyBaths: '',
      propertyArea: ''
    });
    const AMENITIES = [
      "Balcony",
      "Basement parking",
      "Security",
      "Shared Gym",
      "Shared swimming pool",
      "Property for rent",
      "Property for sales",
    ];
    

    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    // Vendor details from Redux
    const vendor = useSelector((state: RootState) => state.products.vendorDetails);

    const [isRealEstate, setIsRealEstate] = useState(false);
    useEffect(() => {
      dispatch(fetchVendorDetails());
    }, [dispatch]);
    

    const validateFields = () => {
      const newErrors: any = {};

      if (!productName.trim()) newErrors.productName = 'Product name is required.';
      if (!productPrice.trim()) newErrors.productPrice = 'Product price is required.';
      if (!productDescription.trim()) newErrors.productDescription = 'Product description is required.';
      if (!selectedCategory.trim()) newErrors.selectedCategory = 'Product category is required.';
      if (selectedImages.length === 0) newErrors.selectedImages = 'At least one image must be selected.';
      if (isRealEstate) {
        if (!productBeds) newErrors.propertyBeds = 'Number of beds is required.';
        if (!productBaths) newErrors.propertyBaths = 'Number of baths is required.';
        if (!propertyArea) newErrors.propertyArea = 'Area is required.';
      }

      setErrors(newErrors);

      return Object.keys(newErrors).length === 0;
    };

    const handleLabelClick = () => {
      setImageSelectionVisible(true);
    };
    const handleAmenityChange = (amenity: string) => {
      setSelectedAmenities((prev) =>
        prev.includes(amenity)
          ? prev.filter((item) => item !== amenity) // Remove if already selected
          : [...prev, amenity] // Add if not selected
      );
      // console.log(selectedAmenities)
    };
    

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!validateFields()) return;
      setIsLoading(true);

      const productData = {
        productName,
        productPrice,
        discountedPrice,
        productDescription,
        selectedCategory,
        selectedImages,
        productBeds,
        productBaths,
        propertyArea,
        selectedAmenities,
      };
      // const postData = {
      //   store_id:vendor?.store_id,
      //   productName,
      //   store_name:vendor?.store_name,
      //   productDescription,
      //   featureImage: selectedImages[0], 
      //   image: vendor?.image ? vendor.image : "/images/sample-profile.jpg", 
      // };
  

    
      try {
        // console.log(posts);
console.log(vendor);
        // console.log(postData);
        // await dispatch(createPost(postData)).unwrap();
        await dispatch(createProduct(productData)).unwrap();

        await dispatch(fetchVendorProducts());
        navigate('/vendor-dashboard/products', {
          state: { message: 'New product has been added successfully.' },
        });
      } catch (error) {
        console.error('Error creating product:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const handleCloseImageSelection = () => {
      setImageSelectionVisible(false);
    };

    return (
      <div className="container-fluid">
        <div className={styles.createProductMainBox}>
          <form onSubmit={handleSubmit}>
            {isImageSelectionVisible && (
              <div className={styles.imageSelectionContainer}>
                <ImageSelection
                  selectedImages={selectedImages}
                  setSelectedImages={setSelectedImages}
                  onClose={handleCloseImageSelection}
                />
              </div>
            )}

            <div className={styles.imgSeclectedBox}>
              <h3 className={`${styles.primaryHeading}`}>
                Select Images<span className={`${styles.importantFilling}`}>*</span>
              </h3>
              <span
                className={`${styles.insertMediaLabel} py-2 px-4 rounded-3`}
                onClick={handleLabelClick}
              >
                <MdPermMedia /> Add Media
              </span>
              <div className={`${styles.imagePreview} d-flex gap-3`}>
                {selectedImages.map((image, index) => (
                  <div key={index} className={`${styles.selectedImage}`}>
                    <img
                      src={`${import.meta.env.VITE_PROHOMEZ_BACKEND_URL}/images/${image}`}
                      alt={`Preview ${index + 1}`}
                      className={styles.imagePreviewItem}
                    />
                  </div>
                ))}
              </div>
              {errors.selectedImages && <div className={styles.errorText}>{errors.selectedImages}</div>}
            </div>

            <div className={`${styles.contentGatheringBox}`}>
              <div className="row">
                <div className="col-12">
                  <div className={`${styles.inputBox}`}>
                    <label htmlFor="productName" className={`${styles.secondaryHeading} form-label`}>
                      Product Name<span className={`${styles.importantFilling}`}>*</span>
                    </label>
                    <input
                      type="text"
                      name="productName"
                      id="productName"
                      className={`${styles.inputTag} form-control`}
                      placeholder="Product Name"
                      value={productName}
                      onChange={(e) => setProductName(e.target.value)}
                    />
                    {errors.productName && <div className={styles.errorText}>{errors.productName}</div>}
                  </div>
                </div>

                <div className="col-6">
  <div className={`${styles.inputBox}`}>
    <label htmlFor="productPrice" className={`${styles.secondaryHeading} form-label`}>
      Product Price<span className={`${styles.importantFilling}`}>*</span>
    </label>
    <div className="input-group">
      <span className={`input-group-text ${styles.dollarSign}`}>$</span>
      <input
        type="text"
        name="productPrice"
        id="productPrice"
        className={`${styles.inputTag} form-control`}
        placeholder="0"
        value={productPrice}
        onChange={(e) => {
          const value = e.target.value.replace(/[^0-9.]/g, ''); // Allow only numbers and dot
          if (/^\d*\.?\d*$/.test(value)) {
            setProductPrice(value);
          }
        }}
      />
    </div>
    {errors.productPrice && <div className={styles.errorText}>{errors.productPrice}</div>}
  </div>
</div>

<div className="col-6">
  <div className={`${styles.inputBox}`}>
    <label htmlFor="discountedPrice" className={`${styles.secondaryHeading} form-label`}>
      Discounted Price
    </label>
    <div className="input-group">
      <span className={`input-group-text ${styles.dollarSign}`}>$</span>
      <input
        type="text"
        name="discountedPrice"
        id="discountedPrice"
        className={`${styles.inputTag} form-control`}
        placeholder="0"
        value={discountedPrice || ''}
        onChange={(e) => {
          const value = e.target.value.replace(/[^0-9.]/g, ''); // Allow only numbers and dot
          if (/^\d*\.?\d*$/.test(value)) {
            const parsedValue = parseFloat(value);
            const parsedProductPrice = parseFloat(productPrice || '0');

            // Prevent setting a discounted price higher than product price
            if (parsedValue > parsedProductPrice) {
              alert("Discounted price cannot be greater than product price!");
              return;
            }

            setDiscountedPrice(parsedValue || undefined);
          }
        }}
      />
    </div>
    {discountedPrice !== undefined && discountedPrice > parseFloat(productPrice || '0') && (
      <div className={styles.errorText}>Discounted price cannot be greater than actual price!</div>
    )}
  </div>
</div>


                <div className="col-12">
                  <div className={`${styles.inputBox}`}>
                    <label
                      htmlFor="productDescription"
                      className={`${styles.secondaryHeading} form-label`}
                    >
                      Product Description<span className={`${styles.importantFilling}`}>*</span>
                    </label>
                    <textarea
                      name="productDescription"
                      id="productDescription"
                      placeholder="Write Here"
                      rows={5}
                      className={`${styles.inputTag} form-control`}
                      value={productDescription}
                      onChange={(e) => setProductDescription(e.target.value)}
                    ></textarea>
                    {errors.productDescription && <div className={styles.errorText}>{errors.productDescription}</div>}
                  </div>
                </div>

                {/* Add Real Estate Fields */}
                {vendor?.brand_type === "Real Estate" &&  (
                  <>
                    <div className="col-4">
                      <div className={`${styles.inputBox}`}>
                        <label htmlFor="propertyBeds" className={`${styles.secondaryHeading} form-label`}>
                          Number of Beds<span className={`${styles.importantFilling}`}>*</span>
                        </label>
                        <input
                          type="number"
                          name="propertyBeds"
                          id="propertyBeds"
                          className={`${styles.inputTag} form-control`}
                          value={productBeds}
                          onChange={(e) => setProductBeds(Math.floor(Number(e.target.value)))}
                        />
                        {errors.propertyBeds && <div className={styles.errorText}>{errors.propertyBeds}</div>}
                      </div>
                    </div>

                    <div className="col-4">
                      <div className={`${styles.inputBox}`}>
                        <label htmlFor="propertyBaths" className={`${styles.secondaryHeading} form-label`}>
                          Number of Baths<span className={`${styles.importantFilling}`}>*</span>
                        </label>
                        <input
                          type="number"
                          name="propertyBaths"
                          id="propertyBaths"
                          className={`${styles.inputTag} form-control`}
                          value={productBaths}
                          onChange={(e) => setProductBaths(Math.floor(Number(e.target.value)))}
                        />
                        {errors.propertyBaths && <div className={styles.errorText}>{errors.propertyBaths}</div>}
                      </div>
                    </div>

                    <div className="col-4">
                      <div className={`${styles.inputBox}`}>
                        <label htmlFor="propertyArea" className={`${styles.secondaryHeading} form-label`}>
                          Area (SQFT)<span className={`${styles.importantFilling}`}>*</span>
                        </label>
                        <input
                          type="number"
                          name="propertyArea"
                          id="propertyArea"
                          className={`${styles.inputTag} form-control`}
                          value={propertyArea}
                          onChange={(e) => setPropertyArea(Math.floor(Number(e.target.value)))}
                        />
                        {errors.propertyArea && <div className={styles.errorText}>{errors.propertyArea}</div>}
                      </div>
                    </div>
                  </>
                )}
                {isRealEstate && (
                  <div className="col-12">
                    <div className={`${styles.inputBox}`}>
                      <h4 className={`${styles.secondaryHeading}`}>
                        Amenities
                      </h4>
                      <div className="d-flex flex-wrap row-gap-2 column-gap-4">
                        {AMENITIES.map((amenity, index) => (
                          <div key={index} className="form-check">
                            <input
                              type="checkbox"
                              id={`amenity-${index}`}
                              className={`form-check-input ${styles.formamennitiesinput}`}
                              checked={selectedAmenities.includes(amenity)}
                              onChange={() => handleAmenityChange(amenity)}
                            />
                            <label
                              htmlFor={`amenity-${index}`}
                              className={`form-check-label ${styles.formchecklabel}`}
                            >
                              {amenity}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {
                  categories.filter((item) => item.category === vendor?.brand_type) && 
                  <div className="col-12">
                    <div className={`${styles.inputBox}`}>
                      <h4 className={`${styles.secondaryHeading}`}>
                        Product Category<span className={`${styles.importantFilling}`}>*</span>
                      </h4>
                      <div className="d-flex flex-wrap row-gap-2 column-gap-4">
                        {categories
                          .filter((item) => item.category === vendor?.brand_type)
                          .map((category, index) => (
                            <div key={index} className="form-check">
                              <input
                                type="radio"
                                name="productCategory"
                                id={`category-${index}`}
                                value={category.buttonText}
                                className={`${styles.formcheckinput} form-check-input sm:w-6 sm:h-6`}
                                onChange={() => setSelectedCategory(category.buttonText)}
                              />
                              <label className={`${styles.formchecklabel} form-check-label`} htmlFor={`category-${index}`}>
                                {category.buttonText}
                              </label>
                            </div>
                          ))}
                      </div>
                      {errors.selectedCategory && <div className={styles.errorText}>{errors.selectedCategory}</div>}
                    </div>
                  </div>
                }
                {
                  !isRealEstate &&
                  <div className="col-12">
                      {/* <div className={`${styles.inputBox}`}>
                        <h4 className={`${styles.secondaryHeading}`}>
                          Product Category<span className={`${styles.importantFilling}`}>*</span>
                        </h4>
                        <div className="d-flex flex-wrap row-gap-2 column-gap-4">
                          {categories
                            .filter((item) => item.category === vendor?.brand_type)
                            .map((category, index) => (
                              <div key={index} className="form-check">
                                <input
                                  type="radio"
                                  name="productCategory"
                                  id={`category-${index}`}
                                  value={category.buttonText}
                                  className="form-check-input"
                                  onChange={() => setSelectedCategory(category.buttonText)}
                                />
                                <label className="form-check-label" htmlFor={`category-${index}`}>
                                  {category.buttonText}
                                </label>
                              </div>
                            ))}
                        </div>
                        {errors.selectedCategory && <div className={styles.errorText}>{errors.selectedCategory}</div>}
                      </div> */}
                  </div>
                }
                <div className="col-12">
                  <div className="d-flex justify-content-end py-4">
                    <button
                      type="submit"
                      className={`${styles.createProductBtn} btn`}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                      ) : (
                        'Create Product'
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }

  export default CreateProduct;