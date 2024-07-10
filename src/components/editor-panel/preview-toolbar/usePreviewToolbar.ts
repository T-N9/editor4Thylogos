import React from 'react';

import {useEditorState} from '@/context/EditorStateContext';

import {scrollToTop} from '@/utils/scrollToTop';

const usePreviewToolbar = () => {
  const {isPreviewMode, setIsPreviewMode} = useEditorState();

  const handleClickPreview = () => {
    scrollToTop();
    setIsPreviewMode(!isPreviewMode);
  };

  return {
    isPreviewMode,
    handleClickPreview,

  };
};

export default usePreviewToolbar;
