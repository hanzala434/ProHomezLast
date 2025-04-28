import db from '../config/db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import util from 'util';
import { validateRegister, validateLogin } from '../validations/authValidation.js';

dotenv.config();
const otpStore = {};
const transporter = nodemailer.createTransport({
    host: "srv1.sigma6host.com",
    port: 465,
    secure: true,
    auth: {           
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS,  
    },
});

export const hii = (req,res) =>{
res.send("hii");
}
export const registerVendor = async (req, res) => {
    const { error } = validateRegister(req.body);
    if (error) {
        return res.status(400).send({ message: error.details[0].message });
    }

    const {
        firstName,
        lastName,
        storeName,
        storeId,
        address1,
        address2,
        city,
        state,
        country,
        postcode,
        phone,
        brandType,
        password,
        email,
    } = req.body;

    try {
        const checkStoreIdQuery = `SELECT COUNT(*) AS count FROM vendors WHERE store_id = ?`;
        const [checkResult] = await new Promise((resolve, reject) => {
            db.query(checkStoreIdQuery, [storeId], (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        });

        if (checkResult.count > 0) {
            return res.status(400).send({ message: 'Store ID is already taken' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const query = `
            INSERT INTO vendors 
            (first_name, last_name, store_name, store_id, address1, address2, city, state_county, country, postcode, store_phone, brand_type, password, email)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        db.query(
            query,
            [
                firstName,
                lastName,
                storeName,
                storeId,
                address1,
                address2,
                city,
                state,
                country,
                postcode,
                phone,
                brandType,
                hashedPassword,
                email,
            ],
            async (err, result) => {
                if (err) {
                    return res.status(500).send({ message: 'Database error', error: err });
                }

                // Email sending logic
                const transporter = nodemailer.createTransport({
                    host: "smtp.prohomez.com", // Change if using a different email provider
                    port: 465, // 587 for TLS, 465 for SSL
                    secure: true,
                    auth: {           
                        user: process.env.EMAIL_USER, 
                        pass: process.env.EMAIL_PASS,  // Replace with your email password or use app password
                         },
                });

                const mailOptions = {
                    from: process.env.EMAIL_USER,
                    to: email,
                    subject: 'Vendor Registration Successful',
                    html: `
                        <h3>Dear ${firstName} ${lastName},</h3>
                        <p>Congratulations! Your vendor registration for <b>${storeName}</b> has been successfully completed.</p>
                        <p>You can now log in and start managing your store.</p>
                        <p>Store ID: <b>${storeId}</b></p>
                        <p>Thank you for choosing us!</p>
                        <br>
                        <p>Best Regards,</p>
                        <p>ProHomez Team</p>
                    `,
                };

                try {
                    await transporter.sendMail(mailOptions);
                    return res.status(200).send({ message: 'Vendor registered successfully! Email sent.' });
                } catch (emailError) {
                    return res.status(500).send({ message: 'Vendor registered, but email sending failed.', error: emailError });
                }
            }
        );
    } catch (error) {
        return res.status(500).send({ message: 'Server error', error });
    }
};



export const loginVendor = (req, res) => {
    const { error } = validateLogin(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    const { email, password } = req.body;

    const query = 'SELECT * FROM vendors WHERE email = ?';
    db.query(query, [email], async (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: 'Internal server error' });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'Vendor not found!' });
        }

        const vendor = results[0];

        
        const isPasswordMatch = await bcrypt.compare(password, vendor.password);
        
        if (!isPasswordMatch) {
            return res.status(401).json({ message: 'Invalid email or password!' });
        }
        // Check if vendor status is 'active'
        if (vendor.vendor_status !== 1   && vendor.isAdmin == 0) {
            return res.status(403).json({ message: 'Vendor account is not active. Please contact support at (+92) 315 5625755.' });
        }

        try {
            const token = jwt.sign(
                {
                    id: vendor.id,
                    store_id: vendor.store_id,
                    email: vendor.email,
                },
                process.env.JWT_SECRET,
                { expiresIn: '2h' }
            );

            return res.status(200).json({
                message: 'Login successful',
                token,
            });
        } catch (tokenError) {
            console.error('Error generating token:', tokenError);
            return res.status(500).json({ message: 'Could not generate authentication token' });
        }
    });
};

// Check Store ID
export const checkStoreId = async (req, res) => {
    const { storeId } = req.params;

    if (!storeId) {
        return res.status(400).send({ message: 'Store ID is required.' });
    }

    try {
        const query = 'SELECT COUNT(*) AS count FROM vendors WHERE store_id = ?';
        const [result] = await new Promise((resolve, reject) => {
            db.query(query, [storeId], (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        });

        if (result.count > 0) {
            return res.status(200).send({ exists: true, message: 'Store ID is already taken.' });
        }

        return res.status(200).send({ exists: false, message: 'Store ID is available.' });
    } catch (error) {
        console.error('Error checking store ID:', error);
        return res.status(500).send({ message: 'Server error', error });
    }
};

// Check Store Email
export const checkEmail = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).send({ message: 'Email is required.' });
    }

    try {
        const query = 'SELECT COUNT(*) AS count FROM vendors WHERE email = ?';
        const [result] = await new Promise((resolve, reject) => {
            db.query(query, [email], (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        });

        if (result.count > 0) {
            return res.status(200).send({ exists: true, message: 'Email is already taken.' });
        }

        return res.status(200).send({ exists: false, message: 'Email is available.' });
    } catch (error) {
        console.error('Error checking Email:', error);
        return res.status(500).send({ message: 'Server error', error });
    }
};

export const sendOTP = async (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });

    const otp = Math.floor(100000 + Math.random() * 900000); // Generate 6-digit OTP
    otpStore[email] = { otp, expiresAt: Date.now() + 300000 }; // Store OTP for 5 mins

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Your OTP Code',
        text: `Your OTP code is ${otp}. It will expire in 5 minutes.`,
    };

    try {
        await transporter.sendMail(mailOptions);
        res.json({ message: 'OTP sent successfully' });
    } catch (error) {
        console.error('Email sending error:', error);
        res.status(500).json({ message: 'Failed to send OTP' });
    }
};

// 2️⃣ Verify OTP
export const verifyOTP = (req, res) => {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ message: 'Email and OTP are required' });

    const storedOtpData = otpStore[email];

    if (!storedOtpData) {
        return res.status(400).json({ message: 'No OTP found for this email' });
    }

    if (Date.now() > storedOtpData.expiresAt) {
        delete otpStore[email];
        return res.status(400).json({ message: 'OTP expired' });
    }

    if (storedOtpData.otp.toString() !== otp.toString()) {
        return res.status(400).json({ message: 'Invalid OTP' });
    }

    delete otpStore[email]; // Remove OTP after successful verification
    res.json({ message: 'Email verified successfully' });
};
// ... existing code ...
export const getCustomers = async (req, res) => {
    const sql = 'SELECT * FROM customers ORDER BY created_at DESC';
  
    db.query(sql, (err, result) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({
          success: false,
          message: 'Failed to fetch customers',
        });
      }
  
      res.status(200).json({
        success: true,
        message: 'Customers fetched successfully',
        data: result,
      });
    });
};
// ... existing code ...