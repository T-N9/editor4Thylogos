import {useCallback, useEffect, useState} from 'react';

/* Hooks */
import {useEditorState} from '@/context/EditorStateContext';
import {useForm} from 'react-hook-form';
import {debounce} from 'lodash-es';

const useFromData = () => {
  const {editorState, isPreviewMode, setEditorState, setIsPreviewMode} =
    useEditorState();
  const {control, handleSubmit, setValue, watch} = useForm();
  const {editorState: contextEditorState} = useEditorState();
  const [isSlugModified, setIsSlugModified] = useState<boolean>(false);

  const watchAllFields = watch();

  const onSubmit = (data: any) => {
    console.log('Submitted data:', data);
  };

//   useEffect(() => {
//     console.log({watchAllFields});
//   }, [watchAllFields, contextEditorState]);

  useEffect(() => {
    setValue('content', JSON.stringify(contextEditorState));
  }, [contextEditorState]);

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

  return {
    control,
    isPreviewMode,
    watchAllFields,
    editorState,
    contextEditorState,

    handleSubmit,
    setValue,
    onSubmit,
    setIsPreviewMode,
    setEditorState,

    handleTitle,
    handleSlug,
  };
};

export default useFromData;
