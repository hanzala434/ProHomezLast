  import { Route, Routes } from 'react-router-dom';
  import VendorSidebarMain from '../../components/VendorSidebarMain';
  import VendorDashboardProducts from '../../components/VendorDashboardProducts';
  import VendorDashboardPayment from '../../components/VendorDashboardPayment';
  import CreateProduct from '../../components/CreateProduct';
  import DisplayMedia from '../../components/DisplayMedia';
  import EditProduct from '../../components/EditProduct';
  import Orders from '../orders/Orders';
  import { useDispatch, useSelector } from 'react-redux';
  import { useEffect, useState } from 'react';
  import { AppDispatch, RootState } from '../../store/store';
  import { fetchVendorDetails } from '../../features/products/productSlice';
  import VendorDashboardVendors from '../../components/VendorDashboardVendors';
  import VendorProfile from '../../components/VendorProfile';
import Customer from '../../components/Customer';

  function VendorDashboard() {
    const dispatch = useDispatch<AppDispatch>();

    const vendor = useSelector((state: RootState) => state.products.vendorDetails);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isModerator, setisModerator] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const fetchDetails = async () => {
        await dispatch(fetchVendorDetails());
        setLoading(false);
      };
      fetchDetails();
    }, [dispatch]);

    useEffect(() => {
      if (vendor?.isAdmin === 1) {
        setIsAdmin(true);
      }
      // if (vendor?.isModerator === 1) {
      //   setisModerator(true);
      // }
        
      
    }, [vendor]);

    if (loading) {
      return <div>Loading...</div>;
    }

    return (
        <div className="container-fluid" id='VendorDashboard'>
          <div className="row">
            {/* Sidebar: Hidden on small and medium screens */}
            <div className="col-lg-2 col-md-1 col-sm-1 px-0">
              <VendorSidebarMain isAdmin={isAdmin} isModerator={isModerator} />
            </div>
      
            {/* Main content: Full width on small/medium screens, 10 columns on large screens */}
            <div className="col-lg-10 col-md-11 col-sm-11">
              <div style={{ flex: 1, padding: '20px' }} id='VendorSidebarMain'>
                <Routes>
                  <Route path="overview" element={<VendorDashboardProducts isAdmin={isAdmin} />} />
                  <Route path="media" element={<DisplayMedia isAdmin={isAdmin} />} />
                  <Route path="products" element={<VendorDashboardProducts isAdmin={isAdmin} />} />
                  <Route path="vendors" element={<VendorDashboardVendors />} />
                  <Route path="orders" element={<Orders isAdmin={isAdmin} />} />
                  {/* <Route path="payment" element={<VendorDashboardProducts isAdmin={isAdmin} />} /> */}
                  <Route path="payment" element={<VendorDashboardPayment/>} />
                  <Route path="profile" element={<VendorProfile />} />
                  {!isAdmin && <Route path="products/create" element={<CreateProduct />} />}
                  <Route path="products/edit/:slug" element={<EditProduct />} />
                  <Route path="customerdata" element={<Customer isAdmin={isAdmin} isModerator={isModerator} />} />
                </Routes>
              </div>
            </div>
          </div>
        </div>    
    );
  }

  export default VendorDashboard;
