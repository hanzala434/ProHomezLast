import { Link } from 'react-router-dom';
import styles from '../style/CategoryCard.module.css';
import { Category } from './types';
import { useEffect, useState } from 'react';

interface CategoryCardProps {
  category: Category;
  numberofCard: number;
  keyforCard: number;
}

function CategoryCard({ category, numberofCard, keyforCard }: CategoryCardProps) {
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const applyMargin = isDesktop && numberofCard <= 3;

  return (
    <Link to={category.src || "#"} className="text-decoration-none">
      <div
        className={`
          ${styles.categoryCard} 
          d-flex justify-content-center align-items-center
        `}
       style={applyMargin && keyforCard === 0 ? { marginLeft: '0rem' } : {}}
      >
        <div className={`${styles.categoryImgBox}`}>
          <img src={category.img} alt={category.buttonText} />
        </div>
        <div className={`${styles.categoryContentBox} d-flex flex-column align-items-center`}>
          <h4 className={`${styles.categoryContentHeading} mb-0`}>{category.buttonText}</h4>
        </div>
      </div>
    </Link>
  );
}

export default CategoryCard;
