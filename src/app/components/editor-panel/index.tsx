'use client'
import React, { useEffect, useCallback } from 'react'
/* Components */
import TextEditor from './text-editor/TextEditor'

/* Hooks */
import { useEditorState } from '@/app/context/EditorStateContext';
import TextPreview from './text-preview/TextPreview';
import { debounce } from 'lodash-es';

const EditorPanel = () => {

  const { editorState, isPreviewMode, setEditorState, setIsPreviewMode } = useEditorState();

  const debouncedSave = useCallback(
    debounce((state) => {
      if (state && typeof window !== undefined) {
        localStorage.setItem('thylogos-editorState', state);
      }
      // console.log('debounced editorState');
    }, 300),
    [] 
  );

  useEffect(() => { 
    debouncedSave(editorState);
   
    return () => {
      debouncedSave.cancel();
    };
  }, [editorState, debouncedSave]);

  return (
    <main className={`editor-shell mx-auto mt-8 rounded-sm max-w-[1300px] w-[1300px] ${isPreviewMode ? 'inline-block previewing' : 'flex'} flex-col gap-2 text-black relative leading-7 font-normal justify-center`}>
      {
        !isPreviewMode &&
        <TextEditor editorState={editorState} setEditorState={setEditorState} setIsPreviewMode={setIsPreviewMode} />
      }

      {
        isPreviewMode &&
        <TextPreview editorState={editorState} setIsPreviewMode={setIsPreviewMode} />
      }

    </main>
  )
}

export default EditorPanel