import React, { useEffect, useState } from 'react';
import styles from '../style/DisplayMedia.module.css';
import axios from 'axios';
import { MdPermMedia } from 'react-icons/md';

interface Image {
    id: number;
    image: string;
}

interface VendorSidebarMainProps {
  isAdmin: boolean;
}

function DisplayMedia({ isAdmin }: VendorSidebarMainProps) {
    const [files, setFiles] = useState<File[]>([]);
    const [mediaFiles, setMediaFiles] = useState<string[]>([]);
    const [images, setImages] = useState<Image[]>([]);
    const [imgUrl, setImgUrl] = useState<string>('');
    const [uploadFailed, setUploadFailed] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [fileError, setFileError] = useState<string | null>(null);


    const deleteImage = async (imageName: string) => {
        if (!window.confirm("Are you sure you want to delete this image?")) return;
      
        try {
          const token = localStorage.getItem('token');
          if (!token) {
            throw new Error('User is not authenticated. Token is missing.');
          }
      
          const res = await axios.delete(`${import.meta.env.VITE_PROHOMEZ_BACKEND_URL}/images/${imageName}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
      
          if (res.data.status === "Success") {
            fetchImages(); // Refresh the image list
          } else {
            alert('Failed to delete the image.');
          }
        } catch (err) {
          console.error('Error deleting image:', err);
          alert('Something went wrong while deleting the image.');
        }
      };
      
    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const selectedFiles = e.target.files ? Array.from(e.target.files) : [];
        if (selectedFiles.length > 0) {
            setFileError(null);
            const invalidFiles = selectedFiles.filter(file => !file.type.startsWith('image/'));
            if (invalidFiles.length > 0) {
                setFileError('Please select only image files.');
                setFiles([]);
                return;
            }
            setFiles(selectedFiles);
            setUploadFailed(false);

            const previews: string[] = [];
            selectedFiles.forEach(file => {
                let reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => {
                    previews.push(reader.result as string);
                    if (previews.length === selectedFiles.length) {
                        setMediaFiles(previews);
                    }
                };
            });
        }
    }

    const handleUpload = async () => {
    if (files.length === 0) return;

    setLoading(true);
    const formData = new FormData();
    files.forEach(file => formData.append('image', file));

    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('User is not authenticated. Token is missing.');
        }

        const res = await axios.post(
            `${import.meta.env.VITE_PROHOMEZ_BACKEND_URL}/uploadImages`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        if (res.data.status === "Success") {
            fetchImages();

            // Close modal safely
            const mediaClose = document.querySelector<HTMLButtonElement>(".addmediaModalClose");
            if (mediaClose) {
                mediaClose.click();
            }
        } else {
            // Display failure message
            const mediaFailHeading = document.querySelector<HTMLElement>(".addMediaFailedHeading");
            if (mediaFailHeading) {
                mediaFailHeading.style.display = "block";
            }
            setUploadFailed(true);
        }
    } catch (err) {
        console.error('Error during image upload:', err);

        // Handle Axios-specific errors
        if (axios.isAxiosError(err)) {
            console.error('Axios error:', err.response?.data || err.message);
        } else {
            console.error('Unexpected error:', err instanceof Error ? err.message : 'Unknown error');
        }

        setUploadFailed(true);
    } finally {
        setLoading(false);
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
          params: { isAdmin },
        });
        const imageNames = res.data.map((imageObj: { image: string }) => imageObj.image);

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

    const clearMedia = () => {
        setFiles([]);
        setMediaFiles([]);
        setFileError(null); 
        const mediaFailHeading = document.querySelector(".addMediaFailedHeading") as HTMLElement;
        mediaFailHeading.style.display = "none";
        setUploadFailed(false);
    };

    const displayImageUrl = (e: React.MouseEvent<HTMLImageElement>) => {
        setImgUrl(e.currentTarget.src);
    };

    const clearImgUrl = () => {
        setImgUrl('');
    };

    useEffect(() => {
        fetchImages();
    }, []);

    return (
        <div className={styles.displayMediaBox}>
            <div className="modal fade addMediaModal" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex={-1} aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div className={`${styles.mediaModalBox} modal-dialog media-modal-box`}>
                    <div className={`${styles.modalContent} modal-content`}>
                        <div className="modal-header">
                            <button type="button" className={`btn-close addmediaModalClose ${styles.mediacross}`} data-bs-dismiss="modal" aria-label="Close" onClick={clearMedia}></button>
                        </div>
                        <div className={`modal-body d-flex flex-column justify-content-center align-items-center ${styles.displayAddMedia}`}>
                            {
                                files.length === 0 ? (
                                    <>
                                        <label htmlFor="insertMedia" className={`${styles.insertMediaLabel} py-2 px-4 rounded-3`}>
                                            <MdPermMedia /> Add Media
                                        </label>
                                        <input type="file" name="insertMedia" id="insertMedia" className='d-none' onChange={handleFileChange} multiple />
                                        {fileError && <p className="text-danger">{fileError}</p>} 
                                    </>
                                ) : (
                                    <>
                                        {uploadFailed && <p className='addMediaFailedHeading'>Image Upload Failed</p>}
                                        <div className="d-flex justify-content-center flex-wrap">
                                            {mediaFiles.map((file, index) => (
                                                <img key={index} src={file} alt={`Media File ${index}`} className={`${ mediaFiles.length > 1 && styles.mediaImages} m-2`} />
                                            ))}
                                        </div>
                                    </>
                                )
                            }
                        </div>
                        {
                            files.length > 0 && (
                                <div className="modal-footer">
                                    <button  type="button" className="btn btn-primary" onClick={handleUpload} disabled={loading}>
                                        {loading ? 'Publishing...' : 'Publish'}
                                    </button>
                                </div>
                            )
                        }
                    </div>
                </div>
            </div>

            <div className={`modal fade`} id="imgurldisplay" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex={-1} aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div className={`${styles.mediaModalBox} modal-dialog media-modal-box`}>
                    <div className={`${styles.modalContent} modal-content`}>
                        <div className="modal-header">
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={clearImgUrl}></button>
                        </div>
                        <div className="modal-body d-grid align-items-center">
                            <div className="row">
                                <div className="col-md-6">
                                    <img src={imgUrl} alt="Media File" className='w-75' />
                                </div>
                                <div className="col-md-6 text-start d-flex flex-column justify-content-center">
                                    <h5 className='imgurlHeading mb-3'>Image Url</h5>
                                    <p className='imgurlPara mb-0 rounded-4 py-2 px-4'>{imgUrl}</p>
                                    <button className="py-2 mediaurlCopyBtn mt-4 rounded-4" onClick={() => { navigator.clipboard.writeText(imgUrl); alert("Copied to clipboard") }}>
                                        Copy to Clipboard!
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container"
             style={{ marginTop: window.innerWidth <= 600 ? '10vh' : '0' }}
            >
                <div className="row">
                    {
                        !isAdmin && 
                        <div className="col-12">
                            <div className={`${styles.insertMediaFirstBox} py-5 rounded-3 mt-3`} data-bs-toggle="modal" data-bs-target="#staticBackdrop">
                                <p className={`${styles.addMediaBtn} py-2 fs-5 mb-0`}>Add Media <MdPermMedia /></p>
                            </div>
                        </div>
                    }
                    <div className="col-12 py-5">
                        <div className="d-flex flex-wrap row-gap-2 column-gap-4 ">
                            {
                                images.slice().reverse().map((image) => (
                                        <div className={`${styles.mediaImgBox} position-relative d-flex justify-content-center align-items-center rounded-3`} key={image.id}>
                                            <img
                                                src={`${import.meta.env.VITE_PROHOMEZ_BACKEND_URL}/images/${image.image}`}
                                                alt="Uploaded Media"
                                                className='w-100 img-url-img'
                                                onClick={displayImageUrl}
                                                data-bs-toggle="modal"
                                                data-bs-target="#imgurldisplay"
                                            />
                                             <button
                                            className="btn btn-danger btn-sm position-absolute bottom-0 end-0 m-1"
                                            onClick={() => deleteImage(image.image)}
                                            >
                                            Delete
                                            </button>
                                        </div>
                                ))
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DisplayMedia;
