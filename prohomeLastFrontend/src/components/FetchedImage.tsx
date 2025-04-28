import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Thumbs } from "swiper/modules";
import SwiperCore from "swiper";
import "swiper/css";
import "swiper/css/navigation";
// import "swiper/css/pagination";
import "swiper/css/thumbs";
import styles from "../style/FetchedImage.module.css";

interface FetchedImageProps {
  images: string | string[];
}

const FetchedImage: React.FC<FetchedImageProps> = ({ images }) => {
  let imageArray: string[] = [];

  if (Array.isArray(images)) {
    imageArray = images;
  } else {
    try {
      imageArray = JSON.parse(images);
    } catch (error) {
      console.error("Error parsing images:", error);
      imageArray = [];
    }
  }

  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperCore | null>(null);

  return (
    <div className={styles.fetchedImageContainer}>
      {/* Main Image Slider (With Navigation & Pagination) */}
      <Swiper
        modules={[Navigation, Pagination, Thumbs]}
        navigation // Arrows for main slider
        pagination={{ clickable: true }}
        thumbs={{ swiper: thumbsSwiper }} // Connect to thumbnail slider
        className={styles.mainImageSlider}
      >
        {imageArray.map((img, index) => (
          <SwiperSlide key={index}>
            <img
              src={`${import.meta.env.VITE_PROHOMEZ_BACKEND_URL}/images/${img}`}
              alt={`Product Image ${index + 1}`}
              className={styles.mainImage}
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Thumbnail Slider (No Navigation) */}
      {imageArray.length > 1 && (
        <Swiper
          modules={[Thumbs]}
          onSwiper={setThumbsSwiper} // Connect with main slider
          slidesPerView={Math.min(4, imageArray.length)}
          spaceBetween={imageArray.length > 5 ? 5 : 10} // Dynamic spacing
          watchSlidesProgress
          className={styles.thumbnailSlider}
        >
          {imageArray.map((img, index) => (
            <SwiperSlide key={index}>
              <img
                src={`${import.meta.env.VITE_PROHOMEZ_BACKEND_URL}/images/${img}`}
                alt={`Thumbnail ${index + 1}`}
                className={styles.thumbnailImage}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </div>
  );
};

export default FetchedImage;
