import styles from '../style/CountrySelect.module.css'
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function CountrySelect({ value, onChange }: { value: string; onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void }) {
  const [countries, setCountries] = useState<string[]>([]);

  useEffect(() => {
    // Fetch country list from REST API
    axios.get('https://restcountries.com/v3.1/all?fields=name')
      .then((response) => {
        const countryNames = response.data.map((country: any) => country.name.common).sort();
        setCountries(countryNames);
      })
      .catch((error) => console.error('Error fetching countries:', error));
  }, []);

  return (
    <div>
      {/* Label with inline styles */}
      <label 
        htmlFor="country" 
        style={{ fontSize: '1.2rem', fontWeight: 'bold', display: 'block', marginBottom: '8px' }}
         className={styles.countryLabel}
      >
        Country
      </label>

      {/* Select Dropdown */}
      <select 
        name="country" 
        id="country"
        value={value} 
        onChange={onChange} 
        className={`w-100 py-2 px-2 rounded-3 ${styles.select}`}
        style={{ fontSize: '1rem' }} // Default font size
      >
        <option value="">Select Country</option>
        {countries.map((country) => (
          <option 
            key={country} 
            value={country} 
            style={{ fontSize: '1rem' }} // Default font size
          >
            {country}
          </option>
        ))}
      </select>

      
    </div>
  );
}

export default CountrySelect;
