import {fetchAllBlogData} from '@/lib/firebase';
import {useEffect, useState} from 'react';

const useBlogCatalogue = () => {
  const [blogData, setBlogData] = useState<
    {id: string; image: string; title: string; summary: string; tags: string[], slug : string}[]
  >([]);

  useEffect(() => {
    handleFetchAllBlogData();
  }, []);

  const handleFetchAllBlogData = async () => {
    try {
      const allBlogData = await fetchAllBlogData();
      // console.log({allImageData});
      setBlogData(allBlogData);
    } catch (error) {
      console.error('Error fetching images:', error);
    }
  };

  return {
    blogData,
  };
};

export default useBlogCatalogue;
