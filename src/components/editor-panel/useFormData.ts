import {useCallback, useEffect, useState} from 'react';
import {usePathname} from 'next/navigation';

/* Hooks */
import {useEditorState} from '@/context/EditorStateContext';
import {useForm} from 'react-hook-form';
import {debounce, isEqual} from 'lodash-es';
import {
  deleteBlogItemData,
  draftBlogItemData,
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

export interface LocalFormState {
  title: string;
  slug: string;
  featureImage: string;
  tags: string[];
  summary: string;
  imageCaption: string;
}

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

const useFromData = () => {
  const {
    editorState: contextEditorState,
    isPreviewMode,
    setEditorState,
    setIsPreviewMode,
    currentBlogData,
  } = useEditorState();

  const {control, handleSubmit, setValue, watch} = useForm();

  const [isSlugModified, setIsSlugModified] = useState(false);
  const [isSummaryModified, setIsSummaryModified] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [tagData, setTagData] = useState<{id: string; tagName: string}[]>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageUrls, setImageUrls] = useState<
    {caption: string; id: string; imageUrl: string}[]
  >([]);
  const [isUseExistingImage, setIsUseExistingImage] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const {localizedFormState, setLocalizedFormState} = useLocalData();
  const [isBlogDataUpdated, setIsBlogDataUpdated] = useState(false);

  const pathname = usePathname();
  const isUpdateRoute = pathname.includes('/update');

  const watchAllFields = watch();
  const title = watch('title');
  const slug = watch('slug');
  const featureImage = watch('featureImage');
  const tagsL = watch('tags');
  const summary = watch('summary');
  const imageCaption = watch('imageCaption');

  // Consolidated watched form data into one object
  const watchedFormData = {
    title,
    slug,
    featureImage,
    tags: tagsL,
    summary,
    imageCaption,
  };

  useEffect(() => {
    if (localizedFormState && !isUpdateRoute) {
      setFormValues(localizedFormState);
    }
    handleGetAllTagsData();
  }, []);

  useEffect(() => {
    if (isUpdateRoute && currentBlogData) {
      setFormValues(currentBlogData);
      setEditorState({
        editorState: JSON.parse(currentBlogData.content).editorState,
        contentSize: JSON.parse(currentBlogData.content).contentSize,
      });
      setTags(currentBlogData.tags || []);
      setImagePreview(currentBlogData.featureImage);
    }
  }, [currentBlogData]);

  // Simplified form value setting function
  const setFormValues = (data: any) => {
    setValue('title', data.title);
    setValue('slug', data.slug);
    setValue('featureImage', data.featureImage);
    setValue('tags', data.tags);
    setValue('summary', data.summary);
    setValue('imageCaption', data.imageCaption);
    setIsSlugModified(false);
    setIsSummaryModified(false);
    setTags(data.tags || []);
  };

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

  // Debounced summary update
  useEffect(() => {
    const debouncedUpdate = debounce(() => {
      const texts = extractTextFromParagraphs(
        JSON.parse(contextEditorState.editorState).root,
      );
      setValue('summary', texts);
    }, 500);

    debouncedUpdate();

    return () => {
      debouncedUpdate.cancel();
    };
  }, [contextEditorState]);

  // Synchronize localized form state if not updating
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
    };

    if (
      !isEqual(formDataComp, watchedFormData) ||
      !isEqual(editorDataComp, contextEditorState)
    ) {
      setIsBlogDataUpdated(true);
    } else {
      setIsBlogDataUpdated(false);
    }
  }, [
    title,
    slug,
    featureImage,
    tagsL,
    summary,
    imageCaption,
    currentBlogData,
  ]);

  useEffect(() => {
    setValue('content', JSON.stringify(contextEditorState));
  }, [contextEditorState]);

  // Extract text from paragraph nodes
  const extractTextFromParagraphs = (node: any): string => {
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

    return textArray.join('').slice(0, 600);
  };

  // Generate slug based on title
const generateSlug = () => {
  const slug = watch('title')
    .toLowerCase()
    .replace(/[^\w\s]/gi, '') // Remove non-alphanumeric characters
    .replace(/\s+/g, '-'); // Replace spaces with hyphens
  setValue('slug', slug);
};

// Debounced slug generation
const debouncedGenerateSlug = useCallback(debounce(generateSlug, 500), [generateSlug]);

// Handle title input changes
const handleTitle = () => {
  if (!isSlugModified) {
    debouncedGenerateSlug();
  }
};

// Mark slug as modified
const handleSlug = () => {
  setIsSlugModified(true);
};

// Mark summary as modified
const handleSummary = () => {
  setIsSummaryModified(true);
};

// Handle image upload
const handleUploadImage = async (file: File | null) => {
  if (imageCaption && file) {
    try {
      const imageUrl = await uploadImage(file);
      await uploadImageData(imageUrl, imageCaption);
      setValue('featureImage', imageUrl);
    } catch (error) {
      console.error('Image upload failed:', error);
    }
  } else {
    alert('Image Caption is required');
  }
};

// Fetch all image data
const handleGetAllImagesData = async () => {
  try {
    const allImageData = await fetchFeatureImages();
    setImageUrls(allImageData);
  } catch (error) {
    console.error('Error fetching images:', error);
  }
};

// Fetch all tag data
const handleGetAllTagsData = async () => {
  try {
    const allTagData = await fetchTags();
    setTagData(allTagData);
  } catch (error) {
    console.error('Error fetching tags:', error);
  }
};

// Clear the selected image
const handleClearImage = () => {
  setValue('featureImage', null);
  setValue('imageCaption', '');
  setImagePreview(null);
  setIsUseExistingImage(false);
};

// Show existing images
const handleClickUseExistingImage = () => {
  handleGetAllImagesData();
  setIsUseExistingImage(true);
};

// Select an image from the existing images
const handleSelectImage = (url: string, caption: string) => {
  setValue('featureImage', url);
  setValue('imageCaption', caption);
  setImagePreview(url);
};

// Submit form data
const onSubmit = (data: any) => {
  if (featureImage) {
    if (isUpdateRoute && currentBlogData?.id) {
      updateBlogItemData(currentBlogData.id, data);
    } else {
      uploadBlogItemData({ ...data, createdAt: serverTimestamp() });
    }
  } else {
    alert('Please select a feature image');
  }
};

// Delete a blog item
const handleDeleteBlogItem = () => {
  if (currentBlogData?.id) {
    deleteBlogItemData(currentBlogData.id);
  }
};

// Unpublish a blog item
const handleUnpublishBlogItem = () => {
  if (currentBlogData?.id) {
    unpublishedBlogItemData(currentBlogData.id, currentBlogData);
  }
};

// Save blog item as a draft
const handleDraftBlogItem = () => {
  draftBlogItemData({
    ...watchedFormData,
    content: JSON.stringify(contextEditorState),
    createdAt: new Date(),
  });
};

// Handle file drop for image upload
const handleImageFileDrop = (file: File) => {
  const imageURL = URL.createObjectURL(file);
  setImagePreview(imageURL);
  setImageFile(file);
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
    isUseExistingImage,
    imageFile,
    isBlogDataUpdated,
    featureImage,
    imageUrls,

    setValue,
    setImagePreview,
    setTags,
    setIsPreviewMode,
    setEditorState,
    setImageFile,

    handleDraftBlogItem,
    handleUploadImage,
    handleSubmit,
    onSubmit,
    handleTagClick,
    removeTag,
    handleTitle,
    handleSlug,
    handleSummary,
    handleClearImage,
    handleClickUseExistingImage,
    handleSelectImage,
    handleImageFileDrop,
    handleDeleteBlogItem,
    handleUnpublishBlogItem,
  };
};

export default useFromData;
