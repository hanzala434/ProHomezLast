import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styles from '../style/EditProduct.module.css';
import { MdPermMedia } from 'react-icons/md';
import { categories } from './data';
import ImageSelection from './ImageSelection';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSingleProduct, updateProduct, fetchVendorProducts } from '../features/products/productSlice.ts';
import { AppDispatch, RootState } from '../store/store.ts';

const EditProduct: React.FC = () => {
  const { slug } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const product = useSelector((state: RootState) => state.products.singleProduct);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [isImageSelectionVisible, setImageSelectionVisible] = useState(false);
  const [productName, setProductName] = useState<string>('');
  const [productPrice, setProductPrice] = useState<string>('');
  const [discountedPrice, setDiscountedPrice] = useState<number | undefined>();
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [productDescription, setProductDescription] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [productBeds, setProductBeds] = useState<number>(0);
  const [productBaths, setProductBaths] = useState<number>(0);
  const [propertyArea, setPropertyArea] = useState<number>(0);

  const [errors, setErrors] = useState({
    productName: '',
    productPrice: '',
    productDescription: '',
    selectedCategory: '',
    selectedImages: '',
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

  const handleAmenityChange = (amenity: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity) ? prev.filter((item) => item !== amenity) : [...prev, amenity]
    );
  };

  useEffect(() => {
    if (slug) {
      dispatch(fetchSingleProduct(slug));
    }
  }, [dispatch, slug]);

  useEffect(() => {
    if (!product) return;

    setProductName(product.productName || '');
    setProductPrice(`${product.productPrice || ''}`);
    setDiscountedPrice(product.discountedPrice || undefined);
    setProductDescription(product.productDescription || '');
    setSelectedCategory(product.selectedCategory || '');
    setSelectedImages(
      Array.isArray(product.selectedImages) ? product.selectedImages : JSON.parse(product.selectedImages || '[]')
    );
    setSelectedAmenities(
      Array.isArray(product.amenities) ? product.amenities : JSON.parse(product.amenities || '[]')
    );
    setProductBeds(product.productBeds || 0);
    setProductBaths(product.productBaths || 0);
    setPropertyArea(product.propertyArea || 0);
  }, [product]);

  const validateFields = () => {
    const newErrors: any = {};

    if (!productName.trim()) newErrors.productName = 'Product name is required.';
    if (!productPrice.trim()) newErrors.productPrice = 'Product price is required.';
    if (!productDescription.trim()) newErrors.productDescription = 'Product description is required.';
    if (!selectedCategory.trim()) newErrors.selectedCategory = 'Product category is required.';
    if (selectedImages.length === 0) newErrors.selectedImages = 'At least one image must be selected.';

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleLabelClick = () => {
    setImageSelectionVisible(true);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateFields()) return;
    setIsLoading(true);

    const updatedProductData = {
      slug,
      productName,
      productPrice: parseFloat(productPrice),
      discountedPrice,
      productDescription,
      selectedCategory,
      selectedImages,
      amenities: selectedAmenities,
      productBeds,
      productBaths,
      propertyArea,
    };

    try {
      await dispatch(updateProduct(updatedProductData)).unwrap();
      await dispatch(fetchVendorProducts());
      navigate('/vendor-dashboard/products', {
        state: { message: 'Product has been updated successfully.' },
      });
    } catch (error) {
      console.error('Error updating product:', error);
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

              {/* Price and Discount */}
              <div className="col-6">
                <div className={`${styles.inputBox}`}>
                  <label htmlFor="productPrice" className={`${styles.secondaryHeading} form-label`}>
                    Product Price<span className={`${styles.importantFilling}`}>*</span>
                  </label>
                  <div className="input-group">
                    <span className={`input-group-text ${styles.DollarSign}`}>$</span>
                    <input
                      type="text"
                      name="productPrice"
                      id="productPrice"
                      className={`${styles.inputTag} form-control`}
                      placeholder="0"
                      value={productPrice}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^0-9.]/g, '');
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
                    <span className={`input-group-text ${styles.DollarSign}`}>$</span>
                    <input
                      type="text"
                      name="discountedPrice"
                      id="discountedPrice"
                      className={`${styles.inputTag} form-control`}
                      placeholder="0"
                      value={discountedPrice || ''}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^0-9.]/g, '');
                        if (/^\d*\.?\d*$/.test(value)) {
                          const parsedValue = parseFloat(value);
                          const parsedProductPrice = parseFloat(productPrice || '0');
                          if (parsedValue > parsedProductPrice) {
                            alert("Discounted price cannot be greater than product price!");
                            return;
                          }
                          setDiscountedPrice(parsedValue || undefined);
                        }
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="col-12">
                <div className={`${styles.inputBox}`}>
                  <label htmlFor="productDescription" className={`${styles.secondaryHeading} form-label`}>
                    Product Description<span className={`${styles.importantFilling}`}>*</span>
                  </label>
                  <textarea
                    name="productDescription"
                    id="productDescription"
                    rows={5}
                    className={`${styles.inputTag} form-control`}
                    value={productDescription}
                    onChange={(e) => setProductDescription(e.target.value)}
                  ></textarea>
                  {errors.productDescription && <div className={styles.errorText}>{errors.productDescription}</div>}
                </div>
              </div>

              {/* Beds/Baths/Area for Real Estate */}
              {product?.mainCategory === "Real Estate" && (
                <>
                  <div className="col-4">
                    <div className={`${styles.inputBox}`}>
                      <label htmlFor="productBeds" className={`${styles.secondaryHeading} form-label`}>
                        Number of Beds
                      </label>
                      <input
                        type="number"
                        id="productBeds"
                        className={`${styles.inputTag} form-control`}
                        value={productBeds}
                        onChange={(e) => setProductBeds(Number(e.target.value))}
                      />
                    </div>
                  </div>

                  <div className="col-4">
                    <div className={`${styles.inputBox}`}>
                      <label htmlFor="productBaths" className={`${styles.secondaryHeading} form-label`}>
                        Number of Baths
                      </label>
                      <input
                        type="number"
                        id="productBaths"
                        className={`${styles.inputTag} form-control`}
                        value={productBaths}
                        onChange={(e) => setProductBaths(Number(e.target.value))}
                      />
                    </div>
                  </div>

                  <div className="col-4">
                    <div className={`${styles.inputBox}`}>
                      <label htmlFor="propertyArea" className={`${styles.secondaryHeading} form-label`}>
                        Area (sqft)
                      </label>
                      <input
                        type="number"
                        id="propertyArea"
                        className={`${styles.inputTag} form-control`}
                        value={propertyArea}
                        onChange={(e) => setPropertyArea(Number(e.target.value))}
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Amenities for Real Estate */}
              {product?.mainCategory === "Real Estate" && (
                <div className="col-12">
                  <div className={`${styles.inputBox}`}>
                    <label htmlFor="amenities" className={`${styles.secondaryHeading} form-label`}>
                      Amenities
                    </label>
                    <div className="d-flex flex-wrap gap-3">
                      {AMENITIES.map((amenity, index) => (
                        <div key={index} className="form-check">
                          <input
                            type="checkbox"
                            id={`amenity-${index}`}
                            className={`form-check-input ${styles.formcheckinputeditproduct}`}
                            checked={selectedAmenities.includes(amenity)}
                            onChange={() => handleAmenityChange(amenity)}
                          />
                          <label className={`form-check-label ${styles.formcheckinputeditproduct}`} htmlFor={`amenity-${index}`}>
                            {amenity}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Category selection */}
              <div className="col-12">
                <div className={`${styles.inputBox}`}>
                  <h4 className={`${styles.secondaryHeading}`}>
                    Product Category<span className={`${styles.importantFilling}`}>*</span>
                  </h4>
                  <div className="d-flex flex-wrap row-gap-2 column-gap-4">
                    {categories
                      .filter((item) =>
                        product?.mainCategory === "Real Estate"
                          ? item.category === "Real Estate"
                          : item.category === "Home Products"
                      )
                      .map((category, index) => (
                        <div key={index} className="form-check">
                          <input
                            type="radio"
                            name="productCategory"
                            id={`category-${index}`}
                            value={category.buttonText}
                            className={`form-check-input ${styles.formcheckinputeditproduct}`}
                            checked={selectedCategory === category.buttonText}
                            onChange={() => setSelectedCategory(category.buttonText)}
                          />
                          <label className={`form-check-label ${styles.formcheckinputeditproduct}`} htmlFor={`category-${index}`}>
                            {category.buttonText}
                          </label>
                        </div>
                      ))}
                  </div>
                  {errors.selectedCategory && <div className={styles.errorText}>{errors.selectedCategory}</div>}
                </div>
              </div>

              {/* Submit Button */}
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
                      'Update Product'
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
};

export default EditProduct;
