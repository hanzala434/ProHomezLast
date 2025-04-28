import CategoryPage from '../src/components/CategoryPage.tsx';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import Root from './Root.tsx';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import Home from './pages/Home/Home.tsx';
import ParentCategories from './pages/ParentCategories/ParentCategories.tsx';
import { HomeProductPageContent, RealEstatePageContent } from './components/data.ts';
import VendorsPage from './pages/Vendors/VendorsPage.tsx';
import Contact from './pages/Contact/Contact.tsx';
import RealEstateProductDetail from './pages/RealEstateProductDetail/RealEstateProductDetail.tsx';
import HomeProductDetail from './pages/HomeProductDetail/HomeProductDetail.tsx';
import VendorRegistration from './pages/VendorRegistration/VendorRegistration.tsx';
import VendorDashboard from './pages/VendorDashboard/VendorDashboard.tsx';
import { Provider } from 'react-redux';
import store from './store/store.ts';
import Login from './pages/Login/Login.tsx';
import AddToCart from './pages/Cart/AddToCart.tsx';
import Checkout from './pages/Checkout/Checkout.tsx';
import Search from './components/Search.tsx';
import axios from 'axios';
import Vendors from './components/Vendors.tsx';
import About from './pages/About/About.tsx';
import VendorProfilePage from './pages/VendorProfilePage/VendorProfilePage.tsx';
import AdminVendorEditForm from './components/AdminVendorEditForm.tsx';
import Feed from './pages/Feed/Feed.tsx';
const API_BASE = import.meta.env.VITE_PROHOMEZ_BACKEND_URL;

console.warn = () => {}; 
// Set default base URL for all axios requests
axios.defaults.baseURL = API_BASE.replace(/\/$/, ''); // Remove trailing slash if present


// Utility function to check authentication
const isAuthenticated = () => {
  return !!localStorage.getItem('token'); // Checks if a token exists in localStorage
};

// ProtectedRoute component
const ProtectedRoute = ({ element }: { element: JSX.Element }) => {
  return isAuthenticated() ? element : <Navigate to="/login" />;
};

// RedirectIfLoggedIn component
const RedirectIfLoggedIn = ({ element }: { element: JSX.Element }) => {
  return isAuthenticated() ? <Navigate to="/vendor-dashboard" /> : element;
};

const hasProductsInCart = () => {
  const cart = JSON.parse(localStorage.getItem('cart') || '[]');
  return cart.length > 0;
};

// CheckoutRoute component
const CheckoutRoute = ({ element }: { element: JSX.Element }) => {
  return hasProductsInCart() ? element : <Navigate to="/" />;
};

const router = createBrowserRouter([
  {
    path: '',
    element: <Root />,
    children: [
      {
        path: '',
        element: <Home />,
      },
      {
        path: '/vendorprofile',
        element: <Vendors />,
      }
      ,

      {
        path: '/home-products',
        element: <ParentCategories pageContent={HomeProductPageContent} />,
      },
      {
        path: '/real-estate',
        element: <ParentCategories pageContent={RealEstatePageContent} />,
      },
      {
        path: '/Home Products',
        element: <ParentCategories pageContent={HomeProductPageContent} />,
      },
      {
        path: '/Real Estate',
        element: <ParentCategories pageContent={RealEstatePageContent} />,
      },
      {
        path: '/vendors',
        element: <VendorsPage />,
      },
      {
        path: '/About-Us',
        element: <About />,
      },
      {
        path: '/contact',
        element: <Contact />,
      },
      {
        path: '/cart',
        element: <AddToCart />,
      },
      {
        path: '/checkout',
        element: <CheckoutRoute element={<Checkout />} />,
      },
      {
        path: '/products/electronics/:slug',
        element: <HomeProductDetail />,
      },
      {
        path: '/vendor/profile/:slug',
        element: <VendorProfilePage />,
      },
      {
        path: '/products/home-products/:slug',
        element: <HomeProductDetail />,
      },
      {
        path: '/products/Real Estate/:slug',
        element: <RealEstateProductDetail />,
      },
      {
        path: '/products/real-estate/:slug',
        element: <RealEstateProductDetail />,
      },
      {
        path: '/products/Home Products/:slug',
        element: <HomeProductDetail />,
      },
      {
        path: '/products/Home-Products/:slug',
        element: <HomeProductDetail />,
      },
      {
        path: '/products/home-products/:slug',
        element: <HomeProductDetail />,
      },
      {
        path: '/vendor-registration',
        element: <VendorRegistration />,
      },
      {
        path: '/search',
        element: <Search mainCategory="Home Products" />,
      },
      {
        path: '/category/:category',
        element: <CategoryPage />,
      },
          {
        path: '/feed',
        element: <Feed />,
      }
,      
      {
        path: '/login',
        element: <RedirectIfLoggedIn element={<Login />} />,
      },
      {
        path: '/vendor-dashboard',
        element: <ProtectedRoute element={<Navigate to="/vendor-dashboard/overview" />} />,
      },
      {
        path: '/vendor-dashboard/*',
        element: <ProtectedRoute element={<VendorDashboard />} />,
      },
         {
        path:"/vendor-dashboard/vendor/edit/:id",
        element:<ProtectedRoute element={<AdminVendorEditForm />} />,
      },
      {
        path: '*',
        element: <Navigate to="/404.html" replace />,
      },
    ],
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>
);
