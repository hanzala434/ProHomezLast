import React from 'react';
import { useParams } from 'react-router-dom';

const Vendor: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div>
      <h1>Vendor Detail Page</h1>
      <p>Vendor ID: {id}</p>
      {/* Add additional vendor detail content here */}
    </div>
  );
};

export default Vendor;
