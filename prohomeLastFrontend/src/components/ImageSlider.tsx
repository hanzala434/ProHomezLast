import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import FetchedImage from './FetchedImage'; // Adjust the import based on your file structure

interface ImageSliderProps {
  featureImage: string;
  images: string[];
}

const ImageSlider: React.FC<ImageSliderProps> = ({ images }) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <div className="image-slider">
      <Slider {...settings}>
        <div>
          <FetchedImage images={[]} />
        </div>
        {images.map((image, index) => (
          <div key={index}>
            <FetchedImage images={[]} />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default ImageSlider;
