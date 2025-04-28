import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './src/routes/routes.js';
import authRoutes from './src/routes/authroutes.js';
import bodyParser from "body-parser";

const allowedOrigins = [
  "https://frontend.prohomez.com",
  "https://frontend.prohomez.com/",
  "http://localhost:5173",
  "http://localhost:5173/",
  "https://prohomez.com",
  "https://prohomez.com/",
  "https://backend.prohomez.com/api/auth/login",
  "https://backend.prohomez.com/api/auth/",
  "https://backend.prohomez.com/api/auth",
  "https://backend.prohomez.com/all-vendors2",
  "https://backend.prohomez.com/",
  "https://backend.prohomez.com",
  "https://prohomez.com/login",
  "https://prohomez.com/vendor-registration",
  "https://prohomez.com/vendor-dashboard/customerdata",
]
dotenv.config();

const app = express();

app.use(express.json());

// ✅ Correct CORS configuration
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));


app.use(express.static('public'));
app.use(bodyParser.json());


app.use('/api/auth', authRoutes);

app.use('/', routes);



const PORT = process.env.PORT || 50002;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
