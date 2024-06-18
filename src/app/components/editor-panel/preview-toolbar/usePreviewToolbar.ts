import React from 'react';

import {useEditorState} from '@/app/context/EditorStateContext';

import {scrollToTop} from '@/app/utils/scrollToTop';

const usePreviewToolbar = () => {
  const {isPreviewMode, setIsPreviewMode} = useEditorState();

  const handleClickPreview = () => {
    scrollToTop();
    setIsPreviewMode(!isPreviewMode);
  };

  return {
    handleClickPreview,
  };
};

export default usePreviewToolbar;
