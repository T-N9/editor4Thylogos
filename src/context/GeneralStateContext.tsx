'use client';
import { ThumbnailBlogItem } from '@/components/blog-catalogue/useBlogCatalogue';
import { BlogItem } from '@/lib/firebase';
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from 'react';

interface GeneralStateContextProps {
  currentBlogData: BlogItem | null,
  fetchedBlogData: ThumbnailBlogItem[];
  fetchedUnpublishedBlogData: ThumbnailBlogItem[];
  fetchedDraftedBlogData: ThumbnailBlogItem[];
  fetchedPinnedBlogData: ThumbnailBlogItem[];
  randomType : 'number' | 'star' | 'flower' | 'ellipse' | 'wheel' | 'moon' | 'misc' | 'triangle' | 'polygon' | 'rectangle';
  randomIndex : number;

  /* actions */
  setCurrentBlogData: (state: BlogItem | null) => void;
  setFetchedBlogData: (state: ThumbnailBlogItem[]) => void;
  setFetchedUnpublishedBlogData: (state: ThumbnailBlogItem[]) => void;
  setFetchedDraftedBlogData: (state: ThumbnailBlogItem[]) => void;
  setFetchedPinnedBlogData: (state: ThumbnailBlogItem[]) => void;
  setRandomType: (state : 'number' | 'star' | 'flower' | 'ellipse' | 'wheel' | 'moon' | 'misc' | 'triangle' | 'polygon' | 'rectangle') => void;
  setRandomIndex: (state: number) => void;
}

const GeneralStateContext = createContext<GeneralStateContextProps | undefined>(
  undefined,
);

export const useGeneralState = () => {
  const context = useContext(GeneralStateContext);
  if (!context) {
    throw new Error(
      'useGeneralState must be used within an GeneralStateProvider',
    );
  }
  return context;
};

interface GeneralStateProviderProps {
  children: ReactNode;
}


export const GeneralStateProvider: React.FC<GeneralStateProviderProps> = ({
  children,
}) => {
  const [currentBlogData, setCurrentBlogData] = useState<BlogItem | null>(null);
  const [fetchedBlogData, setFetchedBlogData] = useState<ThumbnailBlogItem[]>([]);
  const [fetchedPinnedBlogData, setFetchedPinnedBlogData] = useState<ThumbnailBlogItem[]>([]);
  const [fetchedUnpublishedBlogData, setFetchedUnpublishedBlogData] = useState<ThumbnailBlogItem[]>([]);
  const [fetchedDraftedBlogData, setFetchedDraftedBlogData] = useState<ThumbnailBlogItem[]>([]);
  const [randomType, setRandomType] = useState<'number' | 'star' | 'flower' | 'ellipse' | 'wheel' | 'moon' | 'misc' | 'triangle' | 'polygon' | 'rectangle'>('ellipse');
  const [randomIndex, setRandomIndex] = useState<number>(0);

  const shapeOptions: Array<'number' | 'star' | 'flower' | 'ellipse' | 'wheel' | 'moon' | 'misc' | 'triangle' | 'polygon' | 'rectangle'> = 
  ['star', 'flower', 'ellipse', 'wheel', 'moon', 'misc', 'triangle', 'polygon', 'rectangle', 'number'];

  useEffect(()=> {
    const type = shapeOptions[Math.floor(Math.random() * shapeOptions.length)];
    const index = Math.floor(Math.random() * 12);

    setRandomType(type);
    setRandomIndex(index);
  },[])

  return (
    <GeneralStateContext.Provider
      value={{
        currentBlogData,
        setCurrentBlogData,
        randomIndex,
        randomType,
        setRandomIndex,
        fetchedBlogData,
        fetchedUnpublishedBlogData,
        fetchedDraftedBlogData,
        fetchedPinnedBlogData,
        setFetchedBlogData,
        setFetchedUnpublishedBlogData,
        setFetchedDraftedBlogData,
        setFetchedPinnedBlogData,
        setRandomType,

      }}>
      {children}
    </GeneralStateContext.Provider>
  );
};
