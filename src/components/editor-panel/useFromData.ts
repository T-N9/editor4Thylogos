import {useCallback, useEffect, useState} from 'react';

/* Hooks */
import {useEditorState} from '@/context/EditorStateContext';
import {useForm} from 'react-hook-form';
import {debounce} from 'lodash-es';
import {useLocalStorage} from 'react-use';

export interface LocalFormState {
  title: string;
  slug: string;
  image: string;
  tags: string[];
  summary: string;
}

const useFromData = () => {
  const {editorState, isPreviewMode, setEditorState, setIsPreviewMode} =
    useEditorState();
  const {control, handleSubmit, setValue, watch} = useForm();
  const {editorState: contextEditorState} = useEditorState();
  const [isSlugModified, setIsSlugModified] = useState<boolean>(false);
  const [isSummaryModified, setIsSummaryModified] = useState<boolean>(false);
  const [tags, setTags] = useState<string[]>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [localizedFormState, setLocalizedFormState] =
    useLocalStorage<LocalFormState | null>('my-form-state-key', null);

  const featureImage = watch('feature-image');

  const watchAllFields = watch();

  useEffect(() => {
    if (localizedFormState) {
      setValue('title', localizedFormState.title);
      setValue('slug', localizedFormState.slug);
      setValue('image', localizedFormState.image);
      setValue('tags', localizedFormState.tags);
      setValue('summary', localizedFormState.summary);
      setImagePreview(localizedFormState.image);
      setIsSlugModified(false);
      setIsSummaryModified(false);
      setTags(localizedFormState.tags);
    }
  }, []);

  const addTag = (tag: string) => {
    if (tag && !tags.includes(tag)) {
      const newTags = [...tags, tag];
      setTags(newTags);
      setValue('tags', newTags); // Update the form value
    }
  };

  const handleTagClick = (tag: string) => {
    addTag(tag);
  };

  const removeTag = (tag: string) => {
    const newTags = tags.filter((t) => t !== tag);
    setTags(newTags);
    setValue('tags', newTags); // Update the form value
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

    if(textArray.join('').length > 600) {
      return (textArray.join('').slice(0, 600))
    }else {
      textArray.join('')
    }

    return textArray.join('');
  };

  const onSubmit = (data: any) => {
    console.log('Submitted data:', data);
    console.log(JSON.parse(contextEditorState.editorState));
  };

  useEffect(() => {
    if (!isSummaryModified) {
      const texts = extractTextFromParagraphs(
        JSON.parse(contextEditorState.editorState).root,
      );

      setValue('summary', texts);
    }
  }, [contextEditorState]);

  const title = watch('title');
  const slug = watch('slug');
  const featureImageL = watch('feature-image');
  const tagsL = watch('tags');
  const summary = watch('summary');

  useEffect(() => {
    setLocalizedFormState({
      title: title,
      slug: slug,
      image: featureImageL,
      tags: tagsL,
      summary: summary,
    });
    // console.log({watchAllFields});
  }, [title, slug, featureImageL, tagsL, summary]);

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

  return {
    control,
    isPreviewMode,
    watchAllFields,
    editorState,
    contextEditorState,
    tags,
    imagePreview,
    setImagePreview,
    featureImage,
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
  };
};

export default useFromData;
