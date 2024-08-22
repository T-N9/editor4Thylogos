import {useCallback, useEffect, useState} from 'react';
import {usePathname} from 'next/navigation';

/* Hooks */
import {useEditorState} from '@/context/EditorStateContext';
import {useForm} from 'react-hook-form';
import {debounce, isEqual} from 'lodash-es';
import {
  deleteBlogItemData,
  draftBlogItemData,
  fetchBlogDataBySlug,
  fetchFeatureImages,
  fetchTags,
  unpublishedBlogItemData,
  updateBlogItemData,
  uploadBlogItemData,
  uploadImage,
  uploadImageData,
} from '@/lib/firebase';
import {serverTimestamp} from 'firebase/firestore';
import useLocalData from './useLocalData';
import { blogData } from '@/data/blog-post';

export interface LocalFormState {
  title: string;
  slug: string;
  featureImage: string;
  tags: string[];
  summary: string;
  imageCaption: string;
}

const useFromData = () => {
  const {
    editorState: contextEditorState,
    isPreviewMode,
    setEditorState,
    setIsPreviewMode,
    currentBlogData,
  } = useEditorState();
  const {control, handleSubmit, setValue, watch} = useForm();
  // const {editorState: contextEditorState} = useEditorState();
  const [isSlugModified, setIsSlugModified] = useState<boolean>(false);
  const [isSummaryModified, setIsSummaryModified] = useState<boolean>(false);
  const [tags, setTags] = useState<string[]>([]);
  const [tagData, setTagData] = useState<{id: string; tagName: string}[]>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  // const [localizedFormState, setLocalizedFormState] =
  //   useLocalStorage<LocalFormState | null>('my-form-state-key', null);
  const [imageUrls, setImageUrls] = useState<
    {caption: string; id: string; imageUrl: string}[]
  >([]);
  const [isUseExistingImage, setIsUseExistingImage] = useState<boolean>(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const {localizedFormState, setLocalizedFormState} = useLocalData();
  const [isBlogDataUpdated, setIsBlogDataUpdated] = useState<boolean>(false);

  const featureImage = watch('featureImage');

  const pathname = usePathname();
  const isUpdateRoute = pathname.includes('/update');

  const watchAllFields = watch();

  useEffect(() => {
    if (localizedFormState && !isUpdateRoute) {
      // console.log('useForm state upload');
      setValue('title', localizedFormState.title);
      setValue('slug', localizedFormState.slug);
      setValue('featureImage', localizedFormState.featureImage);
      setValue('tags', localizedFormState.tags);
      setValue('summary', localizedFormState.summary);
      setValue('imageCaption', localizedFormState.imageCaption);
      setImagePreview(localizedFormState.featureImage);
      setIsSlugModified(false);
      setIsSummaryModified(false);
      setTags(localizedFormState.tags || []);
    }
    handleGetAllTagsData();
  }, []);

  useEffect(() => {
    if (isUpdateRoute && currentBlogData) {
      setValue('title', currentBlogData.title);
      setValue('slug', currentBlogData.slug);
      setValue('featureImage', currentBlogData.featureImage);
      setValue('tags', currentBlogData.tags);
      setValue('summary', currentBlogData.summary);
      setValue('imageCaption', currentBlogData.imageCaption);
      // console.log('set editor state api');
      setEditorState({
        editorState: JSON.parse(currentBlogData.content).editorState,
        contentSize: JSON.parse(currentBlogData.content).contentSize,
      });
      setValue('content', JSON.parse(currentBlogData.content));
      setIsSlugModified(false);
      setIsSummaryModified(false);
      setTags(currentBlogData.tags || []);
      setImagePreview(currentBlogData.featureImage);

      // console.log({CONTENT: JSON.parse(data?.content)});
    }
  }, [currentBlogData]);

  const addTag = (tag: string) => {
    if (tag && !tags?.includes(tag)) {
      const newTags = [...tags, tag];
      setTags(newTags);
      setValue('tags', newTags);
    }
  };

  const handleTagClick = (tag: string) => {
    addTag(tag);
  };

  const removeTag = (tag: string) => {
    const newTags = tags.filter((t) => t !== tag);
    setTags(newTags);
    setValue('tags', newTags);
  };

  type Child = {
    children?: Child[];
    altText?: string;
    caption?: {editorState: {root: Child}};
    height?: number;
    maxWidth?: number;
    showCaption?: boolean;
    src?: string;
    type: string;
    version: number;
    width?: number;
    direction?: string | null;
    format?: string;
    indent?: number;
    textFormat?: number;
    detail?: number;
    mode?: string;
    style?: string;
    text?: string;
  };

  type Root = {
    children: Child[];
    direction: string;
    format: string;
    indent: number;
    type: string;
    version: number;
  };

  const extractTextFromParagraphs = (node: Child | Root): string => {
    let textArray: string[] = [];

    if (node.type === 'paragraph' && node.children) {
      for (const child of node.children) {
        if (child.type === 'text' && child.text) {
          textArray.push(child.text);
        }
      }
    }

    if (node.children) {
      for (const child of node.children) {
        textArray = textArray.concat(extractTextFromParagraphs(child));
      }
    }

    if (textArray.join('').length > 600) {
      return textArray.join('').slice(0, 600);
    } else {
      textArray.join('');
    }

    return textArray.join('');
  };

  useEffect(() => {
    // if (!isSummaryModified) {
      const debouncedUpdate = debounce(() => {
        const texts = extractTextFromParagraphs(
          JSON.parse(contextEditorState.editorState).root,
        );

        console.log({texts});
        setValue('summary', texts);
      }, 500);

      debouncedUpdate();

      return () => {
        debouncedUpdate.cancel();
      };
    // }
  }, [contextEditorState, isSummaryModified, debounce]);

  const title = watch('title');
  const slug = watch('slug');
  const featureImageL = watch('featureImage');
  const tagsL = watch('tags');
  const summary = watch('summary');
  const imageCaption = watch('imageCaption');

  const watchedFormData = {
    title: title,
    slug: slug,
    featureImage: featureImageL,
    tags: tagsL,
    summary: summary,
    imageCaption: imageCaption,
  };

  useEffect(() => {
    if (!isUpdateRoute) {
      setLocalizedFormState(watchedFormData);
    }

    const formDataComp = {
      title: currentBlogData?.title,
      slug: currentBlogData?.slug,
      featureImage: currentBlogData?.featureImage,
      tags: currentBlogData?.tags,
      summary: currentBlogData?.summary,
      imageCaption: currentBlogData?.imageCaption,
    };

    const editorDataComp = currentBlogData && {
      editorState: JSON.parse(currentBlogData?.content).editorState,
      contentSize: JSON.parse(currentBlogData?.content).contentSize,
    }

    if (!isEqual(formDataComp, watchedFormData) || !isEqual(editorDataComp, contextEditorState)) {
      // console.log('Changes Happened.');
      setIsBlogDataUpdated(true);
    } else {
      // console.log('Back to Origin');
      setIsBlogDataUpdated(false);
    }

    // console.log({contextEditorState, editorDataComp});
  }, [
    title,
    slug,
    featureImageL,
    tagsL,
    summary,
    imageCaption,
    currentBlogData,
  ]);

  useEffect(() => {
    setValue('content', JSON.stringify(contextEditorState));
  }, [contextEditorState, setValue]);

  const generateSlug = () => {
    const slug = watch('title')
      .toLowerCase()
      .replace(/[^\w\s]/gi, '')
      .replace(/\s+/g, '-');
    setValue('slug', slug);
  };

  const debouncedGenerateSlug = useCallback(
    debounce(() => {
      generateSlug();
    }, 500),
    [],
  );

  const handleTitle = () => {
    if (!isSlugModified) {
      debouncedGenerateSlug();
    }
  };

  const handleSlug = () => {
    setIsSlugModified(true);
  };

  const handleSummary = () => {
    setIsSummaryModified(true);
  };

  const handleUploadImage = async (file: File | null) => {
    console.log({imageCaption, file});
    if (imageCaption !== undefined && imageCaption !== '' && file) {
      try {
        const imageUrl = await uploadImage(file);
        uploadImageData(imageUrl, imageCaption);

        setValue('featureImage', imageUrl);
      } catch (error) {
        console.error('Image upload failed:', error);
      }
    } else {
      alert('Image Caption is required');
    }
  };

  const handleGetAllImagesData = async () => {
    try {
      const allImageData = await fetchFeatureImages();
      // console.log({allImageData});
      setImageUrls(allImageData);
    } catch (error) {
      console.error('Error fetching images:', error);
    }
  };


  const handleGetAllTagsData = async () => {
    try {
      const allTagData = await fetchTags();

      setTagData(allTagData);
    } catch (error) {}
  };

  const handleClearImage = () => {
    setValue('featureImage', undefined);
    setValue('imageCaption', undefined);
    setImagePreview(null);
    setIsUseExistingImage(false);
  };

  const handleClickUseExistingImage = () => {
    handleGetAllImagesData();
    setIsUseExistingImage(true);
  };

  const handleClickChooseImage = (url: string, caption: string) => {
    setValue('featureImage', url);
    setValue('imageCaption', caption);
    setImagePreview(url);
  };

  const onSubmit = (data: any) => {
    if (featureImageL !== undefined || imageCaption !== undefined) {
      // console.log('Submitted data:', data);
      // console.log(JSON.parse(contextEditorState.editorState));
      if(isUpdateRoute && currentBlogData?.id) {
        updateBlogItemData(currentBlogData.id, data )
      }else {
        uploadBlogItemData({...data, createdAt: serverTimestamp()});
      }


    } else {
      alert('Please select a feature image');
    }
  };

  const handleDeleteBlogItem = () => {
    if(currentBlogData?.id){
      deleteBlogItemData(currentBlogData?.id)
    }
  } 

  const handleUnpublishBlogItem = () => {
    if(currentBlogData?.id){
      unpublishedBlogItemData(currentBlogData?.id, currentBlogData)
    }
  }

  const handleDraftBlogItem = () => {
      draftBlogItemData({...watchedFormData, content : JSON.stringify(contextEditorState), createdAt : new Date})
  }

  const handleImageFileDrop = (data: File) => {
    const imageURL = URL.createObjectURL(data);
    setImagePreview(imageURL);
    setImageFile(data);
    // console.log({data});
  };

  return {
    control,
    isPreviewMode,
    watchAllFields,
    contextEditorState,
    tags,
    imagePreview,
    tagData,
    isUpdateRoute,
    setImagePreview,
    featureImage,
    imageUrls,
    isUseExistingImage,
    imageFile,
    isBlogDataUpdated,
    handleDraftBlogItem,
    handleUploadImage,
    handleSubmit,
    setValue,
    onSubmit,
    setIsPreviewMode,
    setEditorState,
    handleTagClick,
    removeTag,
    handleTitle,
    handleSlug,
    handleSummary,
    setTags,
    handleClearImage,
    handleClickUseExistingImage,
    handleClickChooseImage,
    handleImageFileDrop,
    handleDeleteBlogItem,
    handleUnpublishBlogItem,
    setImageFile,
  };
};

export default useFromData;
