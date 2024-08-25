import {
  fetchAllBlogData,
  fetchAllDraftedBlogData,
  fetchAllPinnedBlogData,
  fetchAllUnpublishedBlogData,
} from '@/lib/firebase';
import {useEffect} from 'react';
import {useEditorState} from '@/context/EditorStateContext';
import { usePathname } from 'next/navigation';

export interface ThumbnailBlogItem {
  id: string;
  image: string;
  title: string;
  summary: string;
  tags: string[];
  slug: string;
  createdAt: {
    seconds: number;
    nanoseconds: number;
  };
}
[];

const useBlogCatalogue = () => {
  const {
    fetchedBlogData,
    fetchedUnpublishedBlogData,
    fetchedDraftedBlogData,
    fetchedPinnedBlogData,

    setFetchedBlogData,
    setFetchedUnpublishedBlogData,
    setFetchedDraftedBlogData,
    setFetchedPinnedBlogData
  } = useEditorState();
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === '/manage' || pathname === '/') {
      fetchedBlogData.length === 0 && handleFetchAllBlogData();
      fetchAllPinnedBlogData.length === 0 && handleFetchAllPinnedBlogData();
    } else if (pathname.includes('/unpublished')) {
      fetchedUnpublishedBlogData.length === 0 &&
        handleFetchAllUnpublishedBlogData();
    } else if (pathname.includes('/drafts')) {
      fetchedDraftedBlogData.length === 0 && handleFetchAllDraftedBlogData();
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

  const handleFetchAllPinnedBlogData = async () => {
    console.log('Fetching all blog data');
    try {
      const allPinnedBlogData = await fetchAllPinnedBlogData();
      setFetchedPinnedBlogData(allPinnedBlogData);
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

  const handleFetchAllDraftedBlogData = async () => {
    console.log('Fetching all drafted blog data');
    try {
      const allBlogData = await fetchAllDraftedBlogData();
      setFetchedDraftedBlogData(allBlogData);
    } catch (error) {
      console.error('Error fetching images:', error);
    }
  };

  return {
    pathname,
    fetchedBlogData,
    fetchedUnpublishedBlogData,
    fetchedDraftedBlogData,
    fetchedPinnedBlogData
  };
};

export default useBlogCatalogue;
