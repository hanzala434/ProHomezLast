import ExploreProducts from '../../components/ExploreProducts'
import PageCategories from '../../components/PageCategories'
import PageHero from '../../components/PageHero'
import VendorDisplay from '../../components/VendorDisplay'
import styles from './ParentCategories.module.css'
import { ParentCategoryPageContent } from '../../components/types'
import SearchBox from '../../components/SearchBox'
import ProductGrid from '../../components/ProductGrid'

interface ParentCategoryPageContentProps {
  pageContent: ParentCategoryPageContent;
}


export default function ParentCategories({pageContent}: ParentCategoryPageContentProps) {
  return (
    <>
        <PageHero {...pageContent.heroSection} />
        <section className={`${styles.pageCategories}`}>
          <PageCategories category={pageContent.category} />
        </section>
        {/* <ProductGrid category="Luxury Appartments" /> */}
        <section className={`${styles.vendorDisplay}`}>
          <VendorDisplay />
        </section>
        <section className={`${styles.exploreProducts}`}>
          <ExploreProducts category={pageContent.category} />
        </section>
    </>
  )
}
