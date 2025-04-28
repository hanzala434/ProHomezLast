import styles from '../style/MainHeroDivider.module.css';
import homeIllustration from '../assets/images/pexels-amar-saleem-15661-70441.jpg';
import anotherIllustration from '../assets/images/view-futuristic-light-lamp-design.jpg';
import { Link } from 'react-router-dom';

function MainHeroDivider() {
  return (
    <section className={`${styles.mainHeroDivider}`}>
      <div>
        <div className="row">
          {/* Left Section */}
          <div className="col-lg-6 col-md-12">
            <div className={`${styles.heroBoxContainer} ${styles.realestateBackground} position-relative`}>
              <div className={`${styles.heroBox} text-center`}>
                <img src={homeIllustration} alt="Pro Homez Property" className={`${styles.mainHeroIllustration}`} />
                <h2 className={`${styles.mainHeroHeading} mt-3`}>Your Property, Your Future</h2>
                <p className={`${styles.mainHeroParagraph}`}>Design your lifestyle with a beautiful home.</p>
                <Link to="/real-estate" className={`btn ${styles.mainHeroBtn}`}>Browse Properties</Link>
              </div>
            </div>
          </div>

          {/* Right Section */}
          <div className="col-lg-6 col-md-12">
            <div className={`${styles.heroBoxContainer} ${styles.homeProductBackground} position-relative`}>
              <div className={`${styles.heroBox} text-center`}>
                <img src={anotherIllustration} alt="Pro Homez Products" className={`${styles.mainHeroIllustration}`} />
                <h2 className={`${styles.mainHeroHeading} mt-3`}>Shop Home Products</h2>
                <p className={`${styles.mainHeroParagraph}`}>Design your lifestyle with beautiful home products.</p>
                <Link to="/home-products" className={`btn ${styles.mainHeroBtn}`}>Shop Now</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default MainHeroDivider;
