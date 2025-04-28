import { useState } from 'react';
import styles from '../style/GalleryBox.module.css'

interface GalleryBoxProps {
    featureImage: string;
    images?: string[];
}

function GalleryBox({featureImage, images} : GalleryBoxProps) {
    // const safeImages = Array.isArray(images) ? images : [];
    const [zoomedImage, setZoomedImage] = useState<string | null>(null);

  const handleImageClick = (image: string) => {
    setZoomedImage(`${import.meta.env.VITE_PROHOMEZ_BACKEND_URL}/images/${image}`);
  };

  const handleCloseZoom = () => {
    setZoomedImage(null);
  };
  return (
    <>
        <div className="container">
            <div className="row">
                    <div className="row">
                        <div className="col-md-6">
                        <div
                            className={styles.galleryFeatureImgBox}
                            onClick={() => handleImageClick(featureImage)}
                        > 
                        <img 
                        src={`${import.meta.env.VITE_PROHOMEZ_BACKEND_URL}/images/${featureImage}`} 
                        alt="ProHomez" 
                        className={`w-100 ${styles.productImg} h-100`}
                        style={{ cursor: 'zoom-in' }}
                        />
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="row row-gap-4">
                                {images && images.map((item, index) => (
                                    <div className="col-12 col-md-6" key={index}> {/* Full width on mobile, half on desktop */}
                                        <div className={`${styles.galleryImgBox}`}
                                        onClick={() => handleImageClick(item)}>
                                            
                                            <img 
                                                src={`${import.meta.env.VITE_PROHOMEZ_BACKEND_URL}/images/${item}`} 
                                                alt="ProHomez" 
                                                className={`w-100 ${styles.productImg}`}
                                                style={{ cursor: 'zoom-in' }} 
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
            </div>
        </div>
        {zoomedImage && (
        <div className={styles.zoomOverlay} onClick={handleCloseZoom}>
          <div className={styles.zoomContainer} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeBtn} onClick={handleCloseZoom}>
              &times;
            </button>
            <img src={zoomedImage} alt="Zoomed" className={styles.zoomedImg} />
          </div>
        </div>
      )}
    </>
  )
}

export default GalleryBox