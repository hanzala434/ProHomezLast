import React, { useEffect, useState } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';

type Customer = {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  created_at: string; // ISO date string
};

type Props = {
  isAdmin: boolean;
  isModerator: boolean;
};

const Customer: React.FC<Props> = ({ isAdmin, isModerator }) => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    if (!isAdmin && !isModerator) return;

    const fetchCustomers = async () => {
      try {
        const res = await axios.get<{ success: boolean; message: string; data: Customer[] }>(
          `${import.meta.env.VITE_PROHOMEZ_BACKEND_URL}/customersdata`
        );
        setCustomers(res.data.data);
      } catch (error) {
        console.error('Error fetching customer data:', error);
      }
    };

    fetchCustomers();
  }, []);

  // Utility to filter by date
  const getFilteredCustomers = () => {
    const now = dayjs();

    switch (activeCategory) {
      case "Last Week":
        return customers.filter(c =>
          dayjs(c.created_at).isAfter(now.subtract(7, 'day'))
        );
      case "Last Month":
        return customers.filter(c =>
          dayjs(c.created_at).isAfter(now.subtract(1, 'month'))
        );
      default:
        return customers;
    }
  };

  const filteredCustomers = getFilteredCustomers();

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Customer List</h2>

      {/* Category Buttons */}
      <div className="flex gap-2 mb-4">
        {["All", "Last Week", "Last Month"].map((cat) => (
          <button
        key={cat}
        onClick={() => setActiveCategory(cat)}
        style={{
          backgroundColor: activeCategory === cat ? 'rgb(131, 101, 49)' : '#f0f0f0',
          color: activeCategory === cat ? 'white' : '#333'
        }}
        className={`px-4 py-2 rounded font-medium transition hover:brightness-105`}
      >
        {cat}
      </button>
        ))}
      </div>

      <ul className="space-y-2">
        {filteredCustomers.length === 0 ? (
          <p>No customers in this category.</p>
        ) : (
          filteredCustomers.map((customer) => (
            <li key={customer.id} className="border p-4 rounded shadow-sm">
              <p><strong>Name:</strong> {customer.name}</p>
              <p><strong>Email:</strong> {customer.email}</p>
              <p><strong>Phone:</strong> {customer.phone}</p>
              <p><strong>Address:</strong> {customer.address}</p>
              <p><strong>Joined:</strong> {dayjs(customer.created_at).format("MMM D, YYYY")}</p>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default Customer;
