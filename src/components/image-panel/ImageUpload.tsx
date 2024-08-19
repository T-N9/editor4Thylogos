import React from 'react';

import useImageUpload from './useImageUpload';

/* Components */
import { Controller } from 'react-hook-form';
import { uploadImage } from '@/lib/firebase';

const ImageUpload = () => {

  const { control, setImagePreview, setValue, imagePreview } = useImageUpload()

  return (
    <section>
     <form>
       <Controller
         name="feature-image"
         control={control}
         defaultValue={null}
         render={({ field }) => (
           <input
             type="file"
             accept="image/*"
             onChange={async (e: React.ChangeEvent<HTMLInputElement>) => {
               const files = e.target.files;
               if (files && files[0]) {
                
      
                 try {
                   // Upload image to Firebase Storage
                   const imageUrl = await uploadImage(files[0]);
      
                   // Set the image URL in form data
                   setValue('featureImage', imageUrl);
                   setImagePreview(imageUrl);
                 } catch (error) {
                   console.error('Image upload failed:', error);
                 }
               }
             }}
           />
         )}
       />
       {imagePreview && <img src={imagePreview} alt="Preview" />}
     </form>
    </section>
  )
}

export default ImageUpload