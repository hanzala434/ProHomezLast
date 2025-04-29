import { useState } from "react";
import styles from "./Checkout.module.css";
import { useNavigate } from "react-router-dom";
import { TbShoppingCartCheck } from "react-icons/tb";
import axios from "axios";
import GoogleMapSearch from "../../components/GoogleMapSearch";

interface CartProduct {
  id: number;
  productName: string;
  productPrice: number;
  discountedPrice?: number;
  quantity: number;
  slug: string;
  store_id: string;
}

function Checkout() {
  const [cartItems] = useState<CartProduct[]>(
    JSON.parse(localStorage.getItem("cart") || "[]")
  );
  const [clientDetails, setClientDetails] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    country: "",
    postalCode: "",
  });
  const [popupVisible, setPopupVisible] = useState(false);
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number } | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLocationSelect = (address: string, lat: number, lng: number) => {
    setMapCenter({ lat, lng });
    setClientDetails((prev) => ({ ...prev, address }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setClientDetails((prev) => ({ ...prev, [name]: value }));
  };

  const calculateTotal = () => {
    const itemTotal = cartItems.reduce((total, item) => {
      const price = item.discountedPrice || item.productPrice;
      return total + price * item.quantity;
    }, 0);
    return itemTotal.toFixed(2);
  };

  const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPaymentMethod(e.target.value);
  };

  const handlePlaceOrder = async () => {
    if (!clientDetails.name || !clientDetails.address || !clientDetails.phone) {
      alert("Please fill in all required fields!");
      return;
    }

    if (!paymentMethod) {
      alert("Please select a payment method!");
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_PROHOMEZ_BACKEND_URL}/checkout`,
        {
          clientDetails,
          cartItems: cartItems.map((item) => ({
            slug: item.slug,
            productName: item.productName,
            productPrice: item.productPrice,
            discountedPrice: item.discountedPrice,
            quantity: item.quantity,
            store_id: item.store_id,
          })),
          totalCost: calculateTotal(),
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = response.data;
      setOrderId(data.orderId);
      setPopupVisible(true);
      localStorage.removeItem("cart");

      // Now send customer data separately
      try {
        const customerRes = await axios.post(
          `${import.meta.env.VITE_PROHOMEZ_BACKEND_URL}/customerdata`,
          {
            name: clientDetails.name,
            email: clientDetails.email,
            phone: clientDetails.phone,
            address: clientDetails.address,
            lat: mapCenter?.lat,
            lng: mapCenter?.lng,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        console.log(customerRes.data);
        // alert("Customer data saved successfully!");
      } catch (error) {
        console.error("Error sending customer data:", error);
        alert("Failed to send customer data");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Error placing order:", error.response?.data.message || error.message);
        alert(error.response?.data.message || "Failed to place order");
      } else {
        console.error("Unknown error occurred:", error);
        alert("An unknown error occurred.");
      }
    }
  };

  const redirectToHome = () => {
    navigate("/");
  };

  return (
    <div className="container py-5 px-5">
      <h2 className={`text-center mb-4 ${styles.checkoutPrimaryHeading}`}>
        Complete Your Purchase
      </h2>
      <div className="row">
        {/* Client Details Form */}
        <div className="col-md-6">
          <h4 className={styles.sectionTitle}>Shipping Information</h4>
          <form className={styles.checkoutForm}>
            <input
              type="text"
              name="name"
              placeholder="Full Name*"
              value={clientDetails.name}
              onChange={handleInputChange}
              required
              className={styles.inputField}
            />
            <input
              type="email"
              name="email"
              placeholder="Email*"
              value={clientDetails.email}
              onChange={handleInputChange}
              className={styles.inputField}
            />
            <input
              type="text"
              name="phone"
              placeholder="Phone Number*"
              value={clientDetails.phone}
              onChange={handleInputChange}
              required
              className={styles.inputField}
            />
            <input
              type="text"
              name="address"
              placeholder="Address*"
              value={clientDetails.address}
              onChange={handleInputChange}
              required
              className={styles.inputField}
            />
            <input
              type="text"
              name="city"
              placeholder="City*"
              value={clientDetails.city}
              onChange={handleInputChange}
              required
              className={styles.inputField}
            />
            <input
              type="text"
              name="state"
              placeholder="State*"
              value={clientDetails.state}
              onChange={handleInputChange}
              className={styles.inputField}
            />
            <input
              type="text"
              name="country"
              placeholder="Country*"
              value={clientDetails.country}
              onChange={handleInputChange}
              required
              className={styles.inputField}
            />
            <input
              type="text"
              name="postalCode"
              placeholder="Postal Code*"
              value={clientDetails.postalCode}
              onChange={handleInputChange}
              className={styles.inputField}
            />
          </form>
          {/* Google Map Search Component */}
          {/* <GoogleMapSearch onLocationSelect={handleLocationSelect} /> */}
        </div>

        {/* Order Summary */}
        <div className="col-md-6">
          <h4 className={styles.sectionTitle}>Payment Method</h4>
          <div className={styles.paymentOptions}>
            <label className={styles.BankTransfer}>
              <input
                type="radio"
                name="paymentMethod"
                value="Cash on Delivery"
                onChange={handlePaymentChange}
              />
              Cash on Delivery
            </label>
            
            <label className={styles.BankTransfer}>
              <input
                type="radio"
                name="paymentMethod"
                value="Bank Transfer"
                onChange={handlePaymentChange}
              />
              Bank Transfer
            </label>

            {paymentMethod === "Bank Transfer" && (
              <div className={styles.bankDetails}>
                <p>Please use your Order ID for property and home product purchases.</p>
                <p>Property booking amounts are transferred to the developer/owner’s account.</p>
                <p>Home product orders can be shipped via COD or after fund clearance.</p>
                <p>International payments can be managed by PayPal, Wise, and Crypto on request.</p>
                <p>Pro Homez Account:</p>
                <p>IBAN: PK47alfh0335001007198422</p>
                <p>Bank Name: Bank Alfalah</p>
                <p>A/C Holder: Pro Homez</p>
                <p>Branch: 0335, Islamabad, Pakistan</p>
                <p>Currency: AED / PKR / USD</p>
                <p>SWIFT: ALFHPKKAXXX</p>
              </div>
            )}
          </div>

          <h4 className={styles.sectionTitle}>Order Summary</h4>
          <div className={styles.orderSummary}>
            {cartItems.map((item) => (
              <div key={item.id} className={styles.cartItem}>
                <span>
                  {item.productName} (x{item.quantity})
                </span>
                <span>${(item.discountedPrice || item.productPrice) * item.quantity}</span>
              </div>
            ))}
            <div className={styles.totalCost}>
              <span>Total</span>
              <span>${calculateTotal()}</span>
            </div>
          </div>

          <button
            className={`btn mt-3 w-100 ${styles.placeOrderButton}`}
            onClick={handlePlaceOrder}
          >
            Place Order
          </button>

          {/* Popup */}
          {popupVisible && (
            <div className={styles.popupOverlay}>
              <div className={styles.popup}>
                <TbShoppingCartCheck className={`${styles.popupIcon}`} />
                <div className={`${styles.popupContentBox}`}>
                  <h3 className={styles.popupHeading}>
                    Thank You! We’ll Start Processing Your Order!
                  </h3>
                  <p className={styles.popupOrderId}>
                    Save This Order ID for Tracking: <strong>{orderId}</strong>
                  </p>
                </div>
                <button onClick={redirectToHome} className={styles.popupButton}>
                  Check Out More Items
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Checkout;