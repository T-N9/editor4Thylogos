'use client'
import React from 'react'
/* Components */
import TextEditor from './text-editor/TextEditor'

/* Hooks */
import { useEditorState } from '@/app/context/EditorStateContext';
import TextPreview from './text-preview/TextPreview';

const EditorPanel = () => {

  const { editorState, isPreviewMode, setEditorState, setIsPreviewMode } = useEditorState();

  // console.log({ isPreviewMode, editorState })

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