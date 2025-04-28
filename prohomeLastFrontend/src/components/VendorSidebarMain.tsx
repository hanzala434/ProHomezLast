import styles from '../style/VendorSidebarMain.module.css'
import logo from '../assets/images/prohomez-logo.webp'
import { NavLink } from 'react-router-dom'
import { BsFillGridFill } from 'react-icons/bs'
import { FaShoppingBag } from 'react-icons/fa'
import { GiShoppingCart } from 'react-icons/gi'
import { MdOutlinePayment } from 'react-icons/md'
import { CgProfile } from 'react-icons/cg'
import { IoIosAddCircle } from 'react-icons/io'
import { FaPerson } from 'react-icons/fa6'

interface VendorSidebarMainProps {
  isAdmin: boolean;
  isModerator: boolean;
}

function VendorSidebarMain({ isAdmin }: VendorSidebarMainProps) {
  return (
    <div className="h-[1vh]">
    <div className={`${styles.vendorSidebarMainBox}`}>
        <div className={`${styles.sidebarLogoBox} d-flex justify-content-center`}>
            <img src={logo} alt="Pro Homez" className={`${styles.sidebarLogo}`} />
        </div>
        <div className={`${styles.sidebarMenuBox}`}>
            <h4 className={`${styles.sidebarMenuHeading}`}>Menu</h4>
            <ul className={`${styles.sidebarlistContainer} list-unstyled`}>
                <li className={`${styles.sidebarMenuList}`}><NavLink to="/vendor-dashboard/overview" className={({ isActive }) => isActive ? `${styles.activeMenu}` : ''} ><BsFillGridFill /> <span>Overview</span></NavLink></li>
                {isAdmin && <li className={`${styles.sidebarMenuList}`}><NavLink to="/vendor-dashboard/vendors" className={({ isActive }) => isActive ? `${styles.activeMenu}` : ''} ><FaPerson /><span> All Vendors</span></NavLink></li>}
                <li className={`${styles.sidebarMenuList}`}><NavLink to="/vendor-dashboard/media" className={({ isActive }) => isActive ? `${styles.activeMenu}` : ''} ><BsFillGridFill /> <span>Media</span></NavLink></li>
                <li className={`${styles.sidebarMenuList}`}><NavLink to="/vendor-dashboard/products" className={({ isActive }) => isActive ? `${styles.activeMenu}` : ''} ><FaShoppingBag /> <span>Products</span></NavLink></li>
                {!isAdmin && <li className={`${styles.sidebarMenuList}`}><NavLink to="/vendor-dashboard/products/create" className={({ isActive }) => isActive ? `${styles.activeMenu}` : ''} ><IoIosAddCircle /> <span>Add New Product</span></NavLink></li>}
                <li className={`${styles.sidebarMenuList}`}><NavLink to="/vendor-dashboard/orders" className={({ isActive }) => isActive ? `${styles.activeMenu}` : ''} ><GiShoppingCart /> <span>Orders</span></NavLink></li>
                <li className={`${styles.sidebarMenuList}`}><NavLink to="/vendor-dashboard/payment" className={({ isActive }) => isActive ? `${styles.activeMenu}` : ''} ><MdOutlinePayment /> <span>Payment</span></NavLink></li>
                <li className={`${styles.sidebarMenuList}`}><NavLink to="/vendor-dashboard/profile" className={({ isActive }) => isActive ? `${styles.activeMenu}` : ''} ><CgProfile /> <span>Profile</span></NavLink></li>
                {isAdmin && <li className={`${styles.sidebarMenuList}`}><NavLink to="/vendor-dashboard/customerdata" className={({ isActive }) => isActive ? `${styles.activeMenu}` : ''} ><CgProfile /> <span>Customer Data</span></NavLink></li>}
            </ul>
        </div>
    </div>
    </div>
  )
}

export default VendorSidebarMain