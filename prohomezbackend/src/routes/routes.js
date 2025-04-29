import express from 'express';
import multer from 'multer';
import path from 'path';
import { uploadImages,sendemail,getCustomers,customerdata,sendOtp,verifyOtp,resetPassword,getProductRating,submitRating,verifyEmailController, getAllImages, createProduct, getProducts,getProductImages,getProdcutsByMainCategory,getProductsByCategory, getVendor,getVendorProfile, updateVendorProfile, updateVendor, fetchVendorProducts, updateProduct, deleteProduct, getProductBySlug, fetchVendorDetails, checkoutOrder, getOrdersByVendor, fetchAllVendors, updateVendorAccess,fetchAllVendorsPublic, fetchVendorProductsByStoreId, updateVendorProfile2, fetchAllVendorsPublic2, fetchAllVendors2, fetchVendorDetails2, searchLocation, reverseGeocode,checkStoreId, checkEmail, loginVendor,hii, registerVendor,sendOTP, verifyOTP, updateVendorProfileById, createPost, getAllPosts, toggleLike, getLikes, getComments, addComment, DeleteImageByName } from '../controllers/controllers.js';
import { authenticate } from '../middleware/authmiddleware.js';
import nodemailer from "nodemailer";


const router = express.Router();
router.get('/verify-email', verifyEmailController);
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images');
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });
router.post("/customerdata", customerdata);


router.get('/customersdata', getCustomers);
router.post('/send-otp', sendOTP);
router.post('/verify-otp', verifyOTP);
router.post('/register', registerVendor);
router.post('/login', loginVendor);
router.get('/hii',(req,res)=>{res.send("hi")});
router.get('/check-store-id/:storeId', async (req, res, next) => {
    if (!req.params.storeId) {
        return res.status(400).json({ message: 'Store ID is required' });
    }
    next();
}, checkStoreId);
router.post('/check-email', async (req, res, next) => {
  const { email } = req.body;
  if (!email) {
      return res.status(400).json({ message: 'Email is required' });
  }
  req.email = email; // Pass it along if needed
  next();
}, checkEmail);




router.post('/uploadImages', authenticate, upload.array('image', 10), uploadImages);

router.get('/images', authenticate, getAllImages);
// router.get('/image', getAllImages);
router.get('/hi',(req,res)=>res.send('hi'));
router.post('/createproduct', authenticate, createProduct);
router.get("/search", searchLocation); // Geocoding: Search location by name
router.get("/reverse", reverseGeocode); // Reverse Geocoding: Get address from lat/lon

router.get('/products', getProducts);
router.get("/vendor/:id", getVendor);
router.put("/:id", updateVendor);

// Fetch a single product by ID
router.get('/products/:slug', getProductBySlug);

// Update a product
router.put('/products/:slug', authenticate, updateProduct);

router.get('/vendor-products', authenticate, fetchVendorProducts);

router.patch('/update-vendor-access', authenticate, updateVendorAccess);
router.get('/vendor-details/:store_id', fetchVendorDetails2);
router.get('/vendor-products/:store_id', fetchVendorProductsByStoreId);
router.get('/products/:slug', getProductBySlug);
router.get('/vendor-details', authenticate, fetchVendorDetails);
router.get('/vendor-details2', fetchVendorDetails2);

router.get('/all-vendors', authenticate, fetchAllVendors);
router.get('/all-vendors2', fetchAllVendors2);

router.get("/fetchAllVendorsPublic", fetchAllVendorsPublic);
router.get("/fetchAllVendorsPublic2", fetchAllVendorsPublic2);

router.put("/profile/update2", authenticate, upload.single("image"), updateVendorProfile2);
router.put("/profile/update/:id", authenticate, upload.single("image"), updateVendorProfileById);

router.get("/profile", authenticate, getVendorProfile);
router.post('/createpost', createPost);
router.get('/getposts', getAllPosts);
router.post("/posts/:postId/addLike", toggleLike);
router.get("/posts/:postId/likes", getLikes);
router.get("/posts/:postId/comments", getComments);
router.post("/posts/:postId/comments", addComment);

// Update vendor profile
router.put('/profile/update', authenticate,upload.single('image'), updateVendorProfile);
// Delete a product
router.delete('/products/:id', authenticate, deleteProduct);
router.get("/productsby", getProductsByCategory);
router.get("/productsByMainCategory", getProdcutsByMainCategory);
// Public route to place an order (no authentication)
router.post("/forgot-password", sendOtp);
// router.post("/verify-otp", verifyOtp);
router.post("/reset-password", resetPassword);
router.get("/rating/:productId", getProductRating);  
router.post("/submitrating", submitRating);
router.post('/send-email',sendemail)
router.post("/checkout", checkoutOrder);
router.get("/product/:id/images", getProductImages);
router.get("/orders", authenticate, getOrdersByVendor);
router.delete('/images/:imageName',DeleteImageByName);
router.get("/products/:mainCategory", async (req, res) => {
    try {
      const { mainCategory } = req.params;
  
      if (!mainCategory) {
        return res.status(400).json({ error: "mainCategory is required" });
      }
  
      const query = "SELECT * FROM products WHERE mainCategory = ?";
      const [products] = await pool.query(query, [mainCategory]);
  
      res.json(products);
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
  


export default router;