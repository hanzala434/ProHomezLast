import React, { useEffect, useRef, useState } from 'react';
import { MdCancel, MdPermMedia } from 'react-icons/md';
import axios from 'axios';
import styles from '../style/ImageSelection.module.css';

interface Image {
    id: number;
    image: string;
}

type ImageSelectionProps = {
  selectedImages: string[];
  setSelectedImages: React.Dispatch<React.SetStateAction<string[]>>;
  onClose: () => void;
};

const ImageSelection: React.FC<ImageSelectionProps> = ({ setSelectedImages, onClose }) => {
    const [files, setFiles] = useState<File[]>([]);
    const [images, setImages] = useState<Image[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [fileError, setFileError] = useState<string | null>(null);
    const [uploadFailed, setUploadFailed] = useState<boolean>(false);
    const [showAllImages, setShowAllImages] = useState(true);
    const [selectedImageIds, setSelectedImageIds] = useState<{ id: number, image: any }[]>([]);
    const allImagesButtonRef = useRef<HTMLButtonElement | null>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files ? Array.from(e.target.files) : [];
    if (selectedFiles.length > 0) {
        setFileError(null);
        const invalidFiles = selectedFiles.filter(file => !file.type.startsWith('image/'));
        
        if (invalidFiles.length > 0) {
            setFileError('Please select only image files.');
            setFiles([]);
            return;
        }

        setLoading(true); 
        setUploadFailed(false); 
        const formData = new FormData();
        selectedFiles.forEach(file => formData.append('image', file));

        try {
                // Retrieve the token from localStorage
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error('User is not authenticated. Token is missing.');
                }

                // Make the API request with the Authorization header
                const response = await axios.post(
                    `${import.meta.env.VITE_PROHOMEZ_BACKEND_URL}/uploadImages`,
                    formData,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                            Authorization: `Bearer ${token}`, // Include the token
                        },
                    }
                );

                if (response.data.status === "Success") {
                    await Promise.all(
                        selectedFiles.map(file => {
                            return new Promise<string>((resolve) => {
                                const reader = new FileReader();
                                reader.onload = () => resolve(reader.result as string);
                                reader.readAsDataURL(file);
                            });
                        })
                    );

                    allImagesButtonRef.current?.click();
                } else {
                    setUploadFailed(true);
                }
            } catch (error) {
                console.error('Error uploading file:', error);
                setUploadFailed(true);
            } finally {
                setLoading(false);
            }
    }
};

    const fetchImages = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('User is not authenticated. Token is missing.');
        }
        const res = await axios.get(`${import.meta.env.VITE_PROHOMEZ_BACKEND_URL}/images`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setImages(res.data);
      } catch (err) {
        if (axios.isAxiosError(err)) {
          console.error('Error fetching images:', err.message);
          if (err.response && err.response.status === 401) {
            console.log('Unauthorized access. Please log in again.');
          }
        } else if (err instanceof Error) {
          console.error('Unexpected error:', err.message);
        } else {
          console.error('An unknown error occurred');
        }
      }
    };

    const addProductImage = () =>{
      if(selectedImageIds.length > 0){
        setSelectedImages(selectedImageIds.map(item => item.image || item));
        const mediaModal = document.querySelector<HTMLButtonElement>(".mediaModalClose");
        if (mediaModal) {
          mediaModal.click();
        }
      }
    }
    const handleImageClick = (id: number, image: any) => {
        setSelectedImageIds((prevIds) => {
        if (prevIds.length >= 5 && !prevIds.some(item => item.id === id)) {
            setFileError('You can only select up to 5 images.');
            return prevIds;  
        } else {
            setFileError(null); 
        }

        const newSelectedImages = [...prevIds];
        const existingIndex = newSelectedImages.findIndex(item => item.id === id);

        if (existingIndex >= 0) {
            newSelectedImages.splice(existingIndex, 1);
        } else {
            newSelectedImages.push({ id, image });
        }
        return newSelectedImages;
    });
    };
    const handleAddImageClick = () => {
      setShowAllImages(false);
    };

    const handleAllImagesClick = () => {
      setShowAllImages(true);
      fetchImages();
    };
    useEffect(() => {
          fetchImages();
      }, []);

  return (
    <div className={styles.imageSelectionContainer}>
      <div className={styles.imageSelectionHeader}>
        <div className={styles.buttonsContainer}>
          <button
            type='button'
            className={`${styles.toggleButton} ${!showAllImages ? styles.active : ''}`}
            onClick={handleAddImageClick}
          > Add Image
          </button>
          <button
            type='button'
            className={`${styles.toggleButton} ${showAllImages ? styles.active : ''} all-images`}
            onClick={handleAllImagesClick}
            ref={allImagesButtonRef}
          >
            All Images
          </button>
          <button className={`${styles.imageSelectBtn} btn ${selectedImageIds.length < 1 && 'd-none'}`} type='button' onClick={addProductImage}>Select Images</button>
        </div>
        {fileError && <p className="text-danger">{fileError}</p>} 
        <button className={`${styles.closeButton} mediaModalClose`} onClick={onClose}>
          <MdCancel />
        </button>
      </div>

      {!showAllImages && (
        <div className={styles.uploadSection}>
            <input type="file" accept="image/*" multiple className={styles.uploadInput} />
            {
                files.length === 0 ? (
                    <>
                        <label htmlFor="insertMedia" className={`${styles.insertMediaLabel} py-2 px-4 rounded-3`}>
                            <MdPermMedia className={styles.MdPermMedia} /> Add Media
                        </label>
                        <input type="file" name="insertMedia" id="insertMedia" className='d-none' onChange={handleFileChange} multiple />
                    </>
                ) : (
                        <>
                            {uploadFailed && <p className='addMediaFailedHeading'>Image Upload Failed</p>}
                        </>
                    )  
            }
        </div>
      )}

      {showAllImages && (
        <div className={`${styles.selectedImagesSection} py-4`}>
          <div className={`${styles.selectedImagesGrid} d-flex flex-wrap row-gap-3 column-gap-4`}>
            {
              loading && (
              <div className={`${styles.loadingImgBox} d-flex justify-content-center align-items-center rounded-2`}>
                <div className={`${styles.loadingLine}`}></div>
              </div>
              )
            }
            {images.length > 0 ? (
              images.slice().reverse().map((image, index) => (
                <div key={index} className={`${styles.selectedImageItem} ${selectedImageIds.some(item => item.id === image.id) ? styles.imageSelect : ''} d-flex justify-content-center align-items-center rounded-2`} onClick={() => handleImageClick(image.id, image.image)}>
                  <img
                    src={`${import.meta.env.VITE_PROHOMEZ_BACKEND_URL}/images/${image.image}`}
                    alt={`selected-image-${index}`}
                    className={styles.selectedImage}
                  />
                </div>
              ))
            ) : (
              <p>No images available</p>
            )}
          </div>
        </div>
      )}

    </div>
  );
};

export default ImageSelection;
