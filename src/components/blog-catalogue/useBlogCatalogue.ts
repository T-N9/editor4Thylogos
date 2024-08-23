import {fetchAllBlogData, fetchAllUnpublishedBlogData} from '@/lib/firebase';
import {useEffect} from 'react';
import {useEditorState} from '@/context/EditorStateContext';
import useLocalData from '../editor-panel/useLocalData';

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
  const {
    fetchedBlogData,
    fetchedUnpublishedBlogData,
    setFetchedBlogData,
    setFetchedUnpublishedBlogData,
  } = useEditorState();
  const {pathname} = useLocalData();

  useEffect(() => {
    if(pathname === '/manage' || pathname === '/'){
      fetchedBlogData.length === 0 && handleFetchAllBlogData();
    }else if(pathname.includes('/unpublished')){
      fetchedUnpublishedBlogData.length === 0 && handleFetchAllUnpublishedBlogData();
    }
    
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

  const handleFetchAllUnpublishedBlogData = async () => {
    console.log('Fetching all unpublished blog data');
    try {
      const allBlogData = await fetchAllUnpublishedBlogData();
      setFetchedUnpublishedBlogData(allBlogData);
    } catch (error) {
      console.error('Error fetching images:', error);
    }
  };

  return {
    pathname,
    fetchedBlogData,
    fetchedUnpublishedBlogData,
  };
};

export default useBlogCatalogue;
