import express from 'express';
import { checkStoreId, checkEmail, loginVendor,hii, registerVendor,sendOTP, verifyOTP, } from '../controllers/authControllers.js';

const router = express.Router();
router.post('/send-otp', sendOTP);
router.post('/verify-otp', verifyOTP);
router.post('/register', registerVendor);
router.post('/login', loginVendor);
router.get('/hi',(req,res)=>{res.send("hi")});
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

export default router;
