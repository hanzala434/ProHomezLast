import { useEffect, useState } from "react";
import axios from "axios";
import styles from "./Orders.module.css";

interface Order {
  order_id: string;
  client_details: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  };
  cart_items: Array<{
    productName: string;
    quantity: number;
    productPrice: number;
    discountedPrice?: number;
  }>;
  total_cost: number;
  order_date: string;
  vendor_details: Array<{
    store_id: string;
    store_name: string;
    VendorEmail: string;
    brand_type: string; 
  }>;
}

interface VendorSidebarMainProps {
  isAdmin: boolean;
}

function Orders({ isAdmin }: VendorSidebarMainProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Unauthorized. Please log in.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_PROHOMEZ_BACKEND_URL}/orders`,
          {
            headers: { Authorization: `Bearer ${token}` },
            params: { isAdmin: isAdmin ? 1 : 0 },
          }
        );

        if (!Array.isArray(response.data)) {
          throw new Error("Invalid API response");
        }

        const parsedOrders = response.data.map((order: any) => ({
          ...order,
          client_details: typeof order.client_details === "string"
            ? JSON.parse(order.client_details)
            : order.client_details,
          cart_items: typeof order.cart_items === "string"
            ? JSON.parse(order.cart_items)
            : order.cart_items,
          vendor_details: typeof order.vendor_details === "string"
            ? JSON.parse(order.vendor_details)
            : order.vendor_details,
        }));

        setOrders(parsedOrders);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          setError(error.response?.data.message || "Failed to fetch orders");
        } else {
          setError("An unknown error occurred.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [isAdmin]);
  console.log(orders);
  // 🔍 Extract unique categories
  const categories = Array.from(
    new Set(
      orders.flatMap((order) =>
        order.vendor_details?.map((vendor) => vendor.brand_type) || []
      )
    )
  );

  const filteredOrders = selectedCategory
    ? orders.filter((order) =>
        order.vendor_details?.some((vendor) => vendor.brand_type === selectedCategory)
      )
    : orders;

  if (loading) return <div>Loading orders...</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <div className="min-h-[100vh] px-4 py-6">
      <h2 className={`mb-4 ${styles.ordersHeading}`}>Your Orders</h2>

      {/* Category Buttons */}
      <div className="flex flex-wrap gap-3 mb-6 m-2">
  <button
    className={`${styles.categoryButton} ${
      selectedCategory === null ? styles.categoryActive : ""
    }`}
    onClick={() => setSelectedCategory(null)}
  >
    All Categories
  </button>

  {categories.map((cat) => (
    <button
      key={cat}
      className={`${styles.categoryButton} ${
        selectedCategory === cat ? styles.categoryActive : ""
      }`}
      onClick={() => setSelectedCategory(cat)}
    >
      {cat}
    </button>
  ))}
</div>


      <div className={styles.ordersList}>
        {filteredOrders.map((order) => (
          <div key={order.order_id} className={styles.orderCard}>
            <h4 className={styles.orderId}>Order ID: {order.order_id}</h4>
            <p className={styles.orderDate}>
              Date: {new Date(order.order_date).toLocaleDateString()}
            </p>
            <h5 className={styles.orderDetailHeading}>Customer Details:</h5>
            <p className={styles.orderdetailPara}>
              <strong className={styles.orderdetailstrong}>Name:</strong> {order.client_details.name}<br />
              <strong className={styles.orderdetailstrong}>Email:</strong> {order.client_details.email}<br />
              <strong className={styles.orderdetailstrong}>Number:</strong> {order.client_details.phone}<br />
              <strong className={styles.orderdetailstrong}>Address:</strong> {order.client_details.address}, {order.client_details.city}, {order.client_details.state}, {order.client_details.country} - {order.client_details.postalCode}
            </p>

            <h5 className={styles.orderDetailHeading}>Order Items:</h5>
            <ul>
              {order.cart_items.map((item, index) => (
                <li key={index} className={styles.orderdetailli}>
                  {item.productName} (x{item.quantity}) - $
                  {((item.discountedPrice || item.productPrice) * item.quantity).toFixed(2)}
                </li>
              ))}
            </ul>

            <h5 className={styles.orderDetailHeading}>Total Cost: ${order.total_cost.toFixed(2)}</h5>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Orders;
