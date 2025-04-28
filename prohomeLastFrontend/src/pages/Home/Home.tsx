import styles from './Home.module.css'
import CategoriesDisplay from '../../components/CategoriesDisplay'
import VendorDisplay from '../../components/VendorDisplay'
import MainHeroDivider from '../../components/MainHeroDivider'
import ExploreProducts from '../../components/ExploreProducts'
import PageHero from '../../components/PageHero'
import bgImg from '../../assets/images/760x470xc.webp'

const heroData = {
  heading: "Discover premium home products and exceptional real estate opportunities.",
  quickSearches: ['Home Products', 'Real Estate'],
  bgImage: bgImg,
};

function Home() {
  return (
    <>
      <PageHero {...heroData} />
      <MainHeroDivider />
      <section className={`${styles.category}`}>
        <CategoriesDisplay />
      </section>
      <section className={`${styles.vendor}`}>
        <VendorDisplay />
      </section>
      <section className={`${styles.products}`}>
        <ExploreProducts category='All' />
      </section>
      
    </>
  )
}

export default Home