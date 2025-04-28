import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../style/QuickSearchLinks.module.css';

interface QuickSearchLinksProps {
  quickSearches: string[];
}

const QuickSearchLinks: React.FC<QuickSearchLinksProps> = ({ quickSearches }) => {
  return (
    <div className={styles.quickSearchContainer}>
      {quickSearches.map((term, index) => {
        const isGeneralCategory = term === "Real Estate" || term === "Home Products";
        const linkPath = isGeneralCategory ? `/${term}` : `/category/${term}`;

        return (
          <Link key={index} to={linkPath} className={styles.quickSearchLink}>
            {term}
          </Link>
        );
      })}
    </div>
  );
};

export default QuickSearchLinks;
