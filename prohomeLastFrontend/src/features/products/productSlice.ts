import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { Product, Vendor } from '../../components/types';
import { RootState } from '../../store/store';
import { AxiosError } from "axios";

const API_BASE = import.meta.env.VITE_PROHOMEZ_BACKEND_URL;


interface VendorDetails {
  brand_type: string;
  isAdmin: number;
  store_id:string;
  store_name:string;
  image:string;
}



// Async thunk for fetching all products (home page)
export const fetchProducts = createAsyncThunk<Product[], void, { rejectValue: string }>(
  '/fetchProducts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE}/products`);
      return response.data as Product[];
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || 'Failed to fetch products');
      }
      return rejectWithValue('An unexpected error occurred');
    }
  }
);

// Async thunk for fetching vendor-specific products
export const fetchVendorProducts = createAsyncThunk<Product[], void, { rejectValue: string }>(
  'products/fetchVendorProducts',
  async (_, { rejectWithValue, getState  }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('User is not authenticated. Token is missing.');
      }

      const state = getState() as RootState;
      const isAdmin = state.products.vendorDetails?.isAdmin;

      const response = await axios.get(`${API_BASE}/vendor-products`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: { isAdmin },
      });
      return response.data;
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || 'Failed to fetch vendor products');
      }
      return rejectWithValue('An unexpected error occurred');
    }
  }
);

export const fetchAllVendors = createAsyncThunk<Vendor[], void, { rejectValue: string }>(
  'vendors/fetchAllVendors',
  async (_, { rejectWithValue, getState }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('User is not authenticated. Token is missing.');
      }

      const state = getState() as RootState;
      const isAdmin = state.products.vendorDetails?.isAdmin;

      const response = await axios.get(`${API_BASE}/all-vendors2`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: { isAdmin },
      });

      console.log(response.data)
      return response.data as Vendor[];
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || 'Failed to fetch vendors');
      }
      return rejectWithValue('An unexpected error occurred');
    }
  }
);
//user side
export const fetchAllVendors2 = createAsyncThunk("vendors/fetchAll", async (_, { rejectWithValue }) => {
  try {
      const response = await axios.get(`${API_BASE}/all-vendors2`); // Update with your API endpoint
      
      // Filter out any vendors with role "admin"
      const filteredVendors = response.data.filter((vendor : Vendor) => vendor.isAdmin !== 1);

      return filteredVendors;
  } catch (error) {
      return rejectWithValue("Failed to fetch vendors");
  }
});


// Async thunk to update vendor access status
export const updateVendorAccess = createAsyncThunk<Vendor, { vendorId: string; newStatus: string }, { rejectValue: string }>(
  'vendors/updateVendorAccess',
  async ({ vendorId, newStatus }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('User is not authenticated. Token is missing.');
      }

      // Properly passing headers and data
      const response = await axios.patch(
        `${API_BASE}/update-vendor-access`, 
        { vendorId, newStatus },  // Sending data in the body
        {
          headers: {
            Authorization: `Bearer ${token}`,  // Token in Authorization header
          },
        }
      );

      return response.data as Vendor; 
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || 'Failed to update vendor access');
      }
      return rejectWithValue('An unexpected error occurred');
    }
  }
);



// Async thunk for creating a product
export const createProduct = createAsyncThunk<Product, any, { rejectValue: string }>(
  'products/createProduct',
  async (productData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('User is not authenticated. Token is missing.');
      }

      const response = await axios.post(
        `${API_BASE}/createproduct`,
        productData,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data.product;
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || 'Failed to create product');
      }
      return rejectWithValue(error.message || 'An unexpected error occurred');
    }
  }
);

// Async thunk for fetching a single product
export const fetchSingleProduct = createAsyncThunk<Product, string, { rejectValue: string }>(
  'products/fetchSingleProduct',
  async (slug, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE}/products/${slug}`);
      return response.data;
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || 'Failed to fetch product details');
      }
      return rejectWithValue('An unexpected error occurred');
    }
  }
);

// Async thunk to fetch vendor details
export const fetchVendorDetails = createAsyncThunk(
  'vendors/fetchVendorDetails',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('User is not authenticated. Token is missing.');
      }
      const response = await axios.get(`${API_BASE}/vendor-details`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data; 
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || 'Failed to fetch vendor details');
      }
      return rejectWithValue('An unexpected error occurred');
    }
  }
);

// Async thunk for updating a product
export const updateProduct = createAsyncThunk<Product, any, { rejectValue: string }>(
  'products/updateProduct',
  async (productData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('User is not authenticated. Token is missing.');
      }

      const { slug, ...updateData } = productData;
      const response = await axios.put(
        `${API_BASE}/products/${slug}`,
        updateData,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || 'Failed to update product');
      }
      return rejectWithValue(error.message || 'An unexpected error occurred');
    }
  }
);
export const fetchVendorProductsByStoreId = createAsyncThunk<Product[], { store_id: string }, { rejectValue: string }>(
  'products/fetchVendorProductsByStoreId',
  async ({ store_id }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE}/vendor-products/${store_id}`);
      return response.data;
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || 'Failed to fetch vendor products');
      }
      return rejectWithValue('An unexpected error occurred');
    }
  }
);

export interface Rating {
  productId: string;
  rating: number;
}

interface RatingState {
  ratings: { [key: string]: number };
  status: "idle" | "loading" | "failed";
}

const initialState: RatingState = {
  ratings: {},
  status: "idle",
};


// Fetch product rating
// export const fetchRating = createAsyncThunk(
//   "ratings/fetchRating",
//   async (productId: string) => {
//     const response = await axios.get(`${BASE_URL}/api/ratings/${productId}`);
//     return { productId, rating: response.data.rating };
//   }
// );

// Submit rating
// export const submitRating = createAsyncThunk(
//   "ratings/submitRating",
//   async ({ productId, rating }: Rating) => {
//     const response = await axios.post(`${BASE_URL}/api/ratings`, { productId, rating });
//     return { productId, rating: response.data.rating };
//   }
// );

export const fetchProductsByCategory = createAsyncThunk(
  "products/fetchProductsByCategory",
  async (category: string, { rejectWithValue }) => {
    try {
      console.log("Fetching category products for:", category); // Debugging
      const response = await axios.get(`${API_BASE}/productsby`, { params: { category } });
      console.log("Received category products:", response.data); // Debugging

      return response.data;
    }catch (error) {
      const axiosError = error as AxiosError; // Explicitly assert error type
      console.error("Error fetching category products:", axiosError);
      return rejectWithValue(axiosError.response?.data || "Failed to fetch category products");
    }
  }
);


export const fetchVendorDetails2 = createAsyncThunk("vendors/fetchDetails2", async ({ store_id }: { store_id: string }, { rejectWithValue }) => {
  try {
      const response = await axios.get(`${API_BASE}/vendor-details/${store_id}`); // Ensure backend supports this route
      return response.data;
  } catch (error) {
      return rejectWithValue("Failed to fetch vendor details");
  }
});

export const fetchRating = createAsyncThunk(
  "ratings/fetchRating",
  async (productId: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE}/rating/${productId}`);
       return { productId, avgRating: response.data.result[0]?.avgRating || 0 };
    } catch (error: any) {
      return rejectWithValue("Failed to fetch rating");
    }
  }
);

export const submitRating = createAsyncThunk(
  "ratings/submitRating",
  async ({ productId, rating }: Rating, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_BASE}/submitrating`, { productId, rating });
      return { productId, rating: response.data.rating };
    } catch (error: any) {
      return rejectWithValue("Failed to submit rating");
    }
  }
);

// Async thunk for deleting a product
export const deleteProduct = createAsyncThunk<string, string, { rejectValue: string }>(
  'products/deleteProduct',
  async (productId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('User is not authenticated. Token is missing.');
      }

      await axios.delete(`${API_BASE}/products/${productId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return productId;
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || 'Failed to delete product');
      }
      return rejectWithValue('An unexpected error occurred');
    }
  }
);

// Create product slice
const productSlice = createSlice({
  name: 'products',
  initialState: {
    items: [] as Product[],
    vendorItems: [] as Product[],
    vendors: [] as Vendor[],
    categoryProducts: [], 
    singleProduct: null as Product | null, // For single product details
    status: 'idle' as 'idle' | 'loading' | 'succeeded' | 'failed',
    error: null as string | null,
    vendorDetails: null as VendorDetails | null, 
    ratings: {} as { [key: string]: number },
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch all products (home page)
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to fetch products';
      })

      // Fetch all vendors
      .addCase(fetchAllVendors.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAllVendors.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.vendors = action.payload;
      })
      .addCase(fetchAllVendors.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to fetch vendors';
      })

      // Fetch vendor-specific products
      .addCase(fetchVendorProducts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchVendorProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.vendorItems = action.payload;
      })
      .addCase(fetchVendorProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to fetch vendor products';
      })
            // Fetch products by category
      .addCase(fetchProductsByCategory.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProductsByCategory.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.categoryProducts = action.payload;
      })
      .addCase(fetchProductsByCategory.rejected, (state, action) => {
        state.status = "failed";
        state.error = typeof action.payload === "string" ? action.payload : "Failed to fetch category products";
      })

      // Fetch single product
      // .addCase(fetchSingleProduct.pending, (state) => {
      //   state.status = 'loading';
      // })
      // .addCase(fetchSingleProduct.fulfilled, (state, action) => {
      //   state.status = 'succeeded';
      //   state.singleProduct = action.payload;
      // })
      // .addCase(fetchSingleProduct.rejected, (state, action) => {
      //   state.status = 'failed';})
      // .addCase(fetchSingleProduct.pending, (state) => {
      //   state.status = 'loading';
      // })
      // .addCase(fetchSingleProduct.fulfilled, (state, action) => {
      //   state.status = 'succeeded';
      //   state.singleProduct = action.payload;
      // })
      // .addCase(fetchSingleProduct.rejected, (state, action) => {
      //   state.status = 'failed';
      //   state.error = action.payload || 'Failed to fetch product details';
      // })
      // Fetch single product
.addCase(fetchSingleProduct.pending, (state) => {
  state.status = 'loading';
  state.singleProduct = null;  // Reset previous product data
  state.error = null;  // Clear any previous error
})
.addCase(fetchSingleProduct.fulfilled, (state, action) => {
  state.status = 'succeeded';
  state.singleProduct = action.payload;
})
.addCase(fetchSingleProduct.rejected, (state, action) => {
  state.status = 'failed';
  state.error = typeof action.payload === 'string' ? action.payload : 'Failed to fetch product details';
})
      // Create a product
      .addCase(createProduct.fulfilled, (state, action) => {
        state.vendorItems.push(action.payload);
      })

      // Update a product
      .addCase(updateProduct.fulfilled, (state, action) => {
        const index = state.vendorItems.findIndex((item) => item.id === action.payload.id);
        if (index !== -1) {
          state.vendorItems[index] = action.payload;
        }
      })

      // Delete a product
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.vendorItems = state.vendorItems.filter((item) => item.id !== action.payload);
      })

      // Update vendor access
      .addCase(updateVendorAccess.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateVendorAccess.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // Find the vendor by ID and update their status
        const updatedVendor = action.payload;
        const index = state.vendors.findIndex((vendor) => vendor.store_id === updatedVendor.store_id);
        if (index !== -1) {
          state.vendors[index] = updatedVendor;
        }
      })
      .addCase(updateVendorAccess.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to update vendor access';
      })

      // Fetch vendor details and check brand_type
      .addCase(fetchVendorDetails.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchVendorDetails.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.vendorDetails = action.payload;

        // Optionally handle conditional logic based on brand_type
        if (action.payload.brand_type === 'Real Estate') {
          // Additional logic if vendor is 'Real Estate'
        }
      })
      .addCase(fetchVendorDetails.rejected, (state, action) => {
        state.status = 'failed';
        // Ensure the error message is a string
        state.error = typeof action.payload === 'string' ? action.payload : 'Failed to fetch vendor details';
      })
      .addCase(fetchVendorDetails2.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchVendorDetails2.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.vendorDetails = action.payload;

        // Optionally handle conditional logic based on brand_type
        if (action.payload.brand_type === 'Real Estate') {
          // Additional logic if vendor is 'Real Estate'
        }
      })
      .addCase(fetchVendorDetails2.rejected, (state, action) => {
        state.status = 'failed';
        // Ensure the error message is a string
        state.error = typeof action.payload === 'string' ? action.payload : 'Failed to fetch vendor details';
      })
      .addCase(fetchVendorProductsByStoreId.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchVendorProductsByStoreId.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.vendorItems = action.payload;
      })
      .addCase(fetchVendorProductsByStoreId.rejected, (state, action) => {
        state.status = 'failed';
        state.error = typeof action.payload === "string" ? action.payload : 'Failed to fetch vendor products';

      })
      .addCase(fetchAllVendors2.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAllVendors2.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.vendors = action.payload;
      })
      .addCase(fetchAllVendors2.rejected, (state, action) => {
        state.status = 'failed';
        state.error = typeof action.payload === "string" ? action.payload : 'Failed to fetch vendor products';

      })
      .addCase(fetchRating.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchRating.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.ratings[action.payload.productId] = action.payload.avgRating;
      })
      .addCase(fetchRating.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to fetch rating";
      })
 .addCase(submitRating.pending, (state) => {
    state.status = "loading";
  })
  .addCase(submitRating.fulfilled, (state, action) => {
    state.status = "succeeded";
    state.ratings[action.payload.productId] = action.payload.rating;
  })
  .addCase(submitRating.rejected, (state, action) => {
    state.status = "failed";
    state.error = action.error.message || "Failed to submit rating";
  })
      
            // Fetch products by category
            // .addCase(fetchProductsByCategory.pending, (state) => {
            //   state.status = "loading";
            // })
            // .addCase(fetchProductsByCategory.fulfilled, (state, action) => {
            //   state.status = "succeeded";
            //   state.categoryProducts = action.payload;
            // })
            // .addCase(fetchProductsByCategory.rejected, (state, action) => {
            //   state.status = "failed";
            //   // state.error = action.payload || "Failed to fetch category products";
            // })
      
  },
})

// export const fetchSingleProduct = createAsyncThunk(
//   "products/fetchSingleProduct",
//   async (slug, { rejectWithValue }) => {
//     try {
//       const response = await axios.get(`${API_BASE_URL}/api/products/${slug}`);
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data || "Failed to fetch product");
//     }
//   }
// );

// Fetch products by category

export default productSlice.reducer;
