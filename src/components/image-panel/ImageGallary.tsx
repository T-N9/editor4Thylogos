import { fetchAllImages } from '@/lib/firebase';
import React, { useEffect, useState } from 'react'

const ImageGallery = () => {
    const directoryPath = 'feature-images/';
    const [imageUrls, setImageUrls] = useState<string[]>([]);
    useEffect(() => {
        const getImages = async () => {
            try {
                const urls = await fetchAllImages(directoryPath);
                setImageUrls(urls);
            } catch (error) {
                console.error("Error fetching images:", error);
            }
        };

        getImages();
    }, []);

    return (
        <div className='grid grid-cols-3'>
            {imageUrls.length > 0 ? (
                imageUrls.map((url, index) => (
                    <img key={index} src={url} alt={`Image ${index + 1}`} />
                ))
            ) : (
                <p>No images found.</p>
            )}
        </div>
    );
};


export default ImageGallery