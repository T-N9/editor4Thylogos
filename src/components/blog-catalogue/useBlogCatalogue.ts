import {fetchAllBlogData} from '@/lib/firebase';
import {useEffect} from 'react';
import {useEditorState} from '@/context/EditorStateContext';

export interface ThumbnailBlogItem {
  id: string;
  image: string;
  title: string;
  summary: string;
  tags: string[];
  slug: string;
}
[];

const useBlogCatalogue = () => {
  const {fetchedBlogData, setFetchedBlogData} = useEditorState();

  useEffect(() => {
    fetchedBlogData.length === 0 && handleFetchAllBlogData();
  }, []);

  const handleFetchAllBlogData = async () => {
    console.log('Fetching all blog data');
    try {
      const allBlogData = await fetchAllBlogData();
      setFetchedBlogData(allBlogData);
    } catch (error) {
      console.error('Error fetching images:', error);
    }
  };

  return {
    fetchedBlogData,
  };
};

export default useBlogCatalogue;
