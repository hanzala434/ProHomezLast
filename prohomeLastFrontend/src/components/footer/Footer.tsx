import { FaArrowRightLong, FaXTwitter } from "react-icons/fa6"
import styles from "./Footer.module.css"
import { Link, useLocation } from "react-router-dom"
import SearchBox from "../SearchBox"
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaYoutube } from "react-icons/fa"
import { useState, useEffect } from "react"
import { relative } from "path"

function Footer() {
  const location = useLocation();
  const [isOverlapping, setIsOverlapping] = useState(false);

  // useEffect(() => {
  //   const checkOverlap = () => {
  //     const footer = document.querySelector("footer");
  //     const vendorDashboard = document.getElementById("VendorDashboard");

  //     if (!footer || !vendorDashboard) {
  //       console.log("🚨 Footer or VendorDashboard not found!");
  //       return;
  //     }

  //     const footerRect = footer.getBoundingClientRect();
  //     const vendorElements = vendorDashboard.querySelectorAll("*");

  //     let overlapDetected = false;

  //     for (let element of vendorElements) {
  //       const elementRect = element.getBoundingClientRect();
  //       if (elementRect.bottom >= footerRect.top) {
  //         console.log(`⚠️ Overlapping detected with:`, element);
  //         overlapDetected = true;
  //         break; // Exit loop early since we found an overlap
  //       }
  //     }

  //     setIsOverlapping(overlapDetected);
  //   };

  //   setTimeout(checkOverlap, 1000); // Run check once after a small delay

  // }, [location.pathname])

  return (
    <div style={{ marginTop: isOverlapping ? "45vh" : "0",position:"relative",bottom:"0" }} id="footer">
        <footer className={`${styles.footer}`}>
            <div className="container py-5">
                <div className="row">
                    <div className="col-sm-6 col-md-4 mb-5 mb-sm-3 mb-md-0 pe-md-5">
                      <h5 className={`${styles.footerHeading} mb-sm-4`}>About ProHomez</h5>
                      <p className={`${styles.footerAbout} pb-4`}>Pro Homez  is tech enabled Real-estate and Home products listing marketplace, providing digital marketing and sales services for:<br /><br />“Buying and Selling Homes and Home Products”<br /><br />Across the world and it’s featuring global top brands of real estate and home products with new listing of homes and home products, everyday for customers to buy – sell – rent of homes and home products in USA, Pakistan , UAE and UK.<br /><br />ProHomez.com | Buy – Sell – Rent “Homes and Home Products” online!</p>
                    </div>
                    <div className="col-sm-6 col-md-3 mb-5 mb-sm-3 mb-md-0">
                      <h5 className={`${styles.footerHeading} mb-sm-4`}>Quick Links</h5>
                      <ul className="list-unstyled">
                          <li className={`${styles.footerlist}`}><Link to="/" className={`${styles.footerlistLink} text-decoration-none`}>Home<FaArrowRightLong /></Link></li>
                          <li className={`${styles.footerlist}`}><Link to="/real-estate" className={`${styles.footerlistLink} text-decoration-none`}>Real Estate <FaArrowRightLong /></Link></li>
                          <li className={`${styles.footerlist}`}><Link to="/home-products" className={`${styles.footerlistLink} text-decoration-none`}>Home Products<FaArrowRightLong /></Link></li>
                          <li className={`${styles.footerlist}`}><Link to="/vendor-registration" className={`${styles.footerlistLink} text-decoration-none`}>Become Pro Vendors<FaArrowRightLong /></Link></li>
                          <li className={`${styles.footerlist}`}><Link to="/contact" className={`${styles.footerlistLink} text-decoration-none`}>Contact Us<FaArrowRightLong /></Link></li>
                          <li className={`${styles.footerlist}`}><Link to="/About-Us" className={`${styles.footerlistLink} text-decoration-none`}>About Us<FaArrowRightLong /></Link></li>

                      </ul>
                    </div>
                    <div className="col-sm-6 col-md-5 mb-5 mb-sm-3 mb-md-0">
                      <h5 className={`${styles.footerHeading} mb-sm-4`}>Search Here</h5>
                      <SearchBox mainCategory="home products"/>
                    </div>
                    <div className="col-sm-6  mb-5 mb-sm-3 mb-md-0">
                      <ul className={`${styles.socialMediaIcons} d-flex gap-3 list-unstyled mb-0`}>
                        <li> <a href="https://www.facebook.com/homez.pro" className={`${styles.footerSocialLink}`}><FaFacebookF /></a></li>
                        <li> <a href="https://twitter.com/pro_homez" className={`${styles.footerSocialLink}`}><FaXTwitter /></a></li>
                        <li> <a href="https://www.linkedin.com/company/prohomez" className={`${styles.footerSocialLink}`}><FaLinkedinIn /></a></li>
                        <li> <a href="https://www.youtube.com/channel/UCr8s8oAbBqU_Cx6ECwVCyWA" className={`${styles.footerSocialLink}`}><FaYoutube /></a></li>
                        <li> <a href="https://www.instagram.com/pro.homez/" className={`${styles.footerSocialLink}`}><FaInstagram /></a></li>
                      </ul>
                    </div>
                </div>
            </div>
            <div className={`${styles.copyrightContainer}`}>
              <div className="container">
                  <div className="row">
                      <div className="col-12">
                        <p className={`${styles.copyrightClaim} mb-0 py-3 d-flex justify-content-between`}>
                          <span>&copy; {new Date().getFullYear()} All Rights Reserved.</span>
                          </p>                    
                      </div>
                  </div>
              </div>
            </div>
        </footer>
    </div>
  )
}

export default Footer