import { useEffect, useRef } from "react";
import styles from "../style/VendorDisplay.module.css";
import VendorCard from "./VendorCard";
import { MdArrowBackIosNew, MdArrowForwardIos } from "react-icons/md";
import { fetchAllVendors2 } from "../features/products/productSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store/store";
import VendorCard1 from "./VendorCard1";

function VendorDisplay() {
    const dispatch = useDispatch<AppDispatch>();
    const { vendors } = useSelector((state: RootState) => state.products);
    const sliderRef =  useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        dispatch(fetchAllVendors2());
    }, [dispatch]);

    const scrollLeft = () => {
        if (sliderRef.current) {
            sliderRef.current.scrollBy({ left: -300, behavior: "smooth" });
        }
    };

    const scrollRight = () => {
        if (sliderRef.current) {
            sliderRef.current.scrollBy({ left: 300, behavior: "smooth" });
        }
    };

    return (
        <div className="container">
            <div className="row">
                <div className="col-md-12">
                    <h3 className={`${styles.vendorDisplay} mb-0 text-center`}>Top Rated Vendors</h3>
                </div>
                <div className="col-md-12 py-4 position-relative">
                    <div className="d-flex overflow-hidden justify-content-center" ref={sliderRef} style={{ scrollBehavior: 'smooth', whiteSpace: 'nowrap' }}>
                        {vendors.map((item, index) => (
                            <div className={`col-md-1.99 mx-2 ${styles.VendorSlide1}`} key={index} style={{ flex: '0 0 auto' }}>
                                <VendorCard1 vendor={item} />
                            </div>
                        ))}
                    </div>
                    <div className={`${styles.sliderBtnContainer}`}>
                        <button className={styles.sliderBtn} onClick={scrollLeft}>
                            <MdArrowBackIosNew />
                        </button>
                        <button className={styles.sliderBtn} onClick={scrollRight}>
                            <MdArrowForwardIos />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default VendorDisplay;
