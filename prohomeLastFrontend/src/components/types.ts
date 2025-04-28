export interface PageHeroProps {
  heading: string;
  description?: string;
  quickSearches?: string[];
  bgImage?: string;
}
export interface Feature {
  name: string;
  parentCategory?: string;
  featureImage?: string;
  src?: string
}
export interface ProductList {
  name: string;
  featureImage?: string;
  price?: number;
  discountedPrice?: string;
  reviews?: number;
  src?: string;
  parentCategory: string;
  productId: string;
}
export interface ProductDetail {
  name: string;
  description: string;
  featureImage: string;
  images?: string[];
  price?: number;
  discountedPrice?: number;
  reviews?: number;
  parentCategory?: string;
  productId: string;
  keySpecification?: KeySpecification;
  realEstateDetails?: PropertyDetails;
  amenities?: string[];
  vendorDetail?: VendorDetail;
}

interface PropertyDetails {
  bed?: number;
  bath?: number;
  sqft?: number;
}
interface KeySpecification {
  soldBy?: string;
  dimensions?: string;
  weight?: string;
  material?: string;
  color?: string;
  careInstructions?: string;
  warranty?: string;
}

export interface VendorDetail {
  store_id?: string;
  store_name?: string;
  image?: string;
  store_phone?: string;
  email?: string;
}


export interface Category {
  img?: string;
  src?: string;
  buttonText: string;
  category?: string
}

export interface ParentCategoryPageContent {
  heroSection: PageHeroProps;
  category: string;
}
export interface Product {
  id: string;
  productName: string;
  productPrice: number;
  discountedPrice?: number;
  productDescription: string;
  selectedCategory: string;
  mainCategory?: string;
  featureImage: string;
  selectedImages: string[];
  slug?: string;
  numberOfReviews: number;
  vendorDetails?: VendorDetail;
  realEstateDetails?: PropertyDetails;
  quantity?: number;
  amenities?: string[];
  storeId?:string;
  category?:string;
  productBeds?:any;
  productBaths ?:any;
  propertyArea ?:any;
}

export interface Vendor {
  address1: string,
  address2: string,
  brand_type: string,
  city: string,
  country: string,
  email: string,
  first_name: string,
  image: null,
  isAdmin: number,
  last_name: string,
  postcode: string,
  state_county: string,
  store_id: string,
  store_name: string,
  store_phone: string,
  vendor_status: string;
}

export interface Comment {
  id: number;
  post_id: number;
  user_id: number;
  comment: string;
  created_at: string;
}

export interface Post {
  postId: number;
  store_id: number;
  image: string;
  productDescription: string;
  productName: string;
  productId: number;
  featureImage: string;
  totalLikes?: number;
  comments?: Comment[];
}

interface PostsState {
  items: Post[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: PostsState = {
  items: [],
  status: 'idle',
  error: null,
};