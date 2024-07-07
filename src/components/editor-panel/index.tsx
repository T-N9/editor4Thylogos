'use client'
import React, { useEffect, useCallback } from 'react'
/* Components */
import TextEditor from './text-editor/TextEditor'

/* Hooks */
import { useEditorState } from '@/context/EditorStateContext';
import TextPreview from './text-preview/TextPreview';
import { debounce } from 'lodash-es';
import TitleInput from './title-input/TitleInput';

const EditorPanel = () => {

  const { editorState, isPreviewMode, setEditorState, setIsPreviewMode } = useEditorState();

  const debouncedSave = useCallback(
    debounce((state) => {
      if (state && typeof window !== undefined) {
        localStorage.setItem('thylogos-editorState', state);
      }
      // console.log('debounced editorState');
    }, 500),
    []
  );

  useEffect(() => {
    debouncedSave(editorState);

    return () => {
      debouncedSave.cancel();
    };
  }, [editorState, debouncedSave]);

  return (
    <>
      {/* <TitleInput /> */}
      <main className={`flex justify-center editor-shell mx-auto mt-8 rounded-sm 2xl:max-w-[1440px] max-w-[1300px] 2xl:w-[1440px] lg:w-[1300px] ${isPreviewMode ? 'inline-block previewing' : 'flex'} flex-col gap-2 text-gray-800 relative leading-7 font-normal justify-center`}>
        {
          !isPreviewMode &&
          <TextEditor editorState={editorState} setEditorState={setEditorState} setIsPreviewMode={setIsPreviewMode} />
        }

        {
          isPreviewMode &&
          <TextPreview editorState={editorState} setIsPreviewMode={setIsPreviewMode} />
        }

      </main>
    </>
  )
}

export default EditorPanel