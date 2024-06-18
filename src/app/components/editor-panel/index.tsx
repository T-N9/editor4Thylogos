'use client'
import React from 'react'
/* Components */
import TextEditor from './text-editor/TextEditor'

/* Hooks */
import { useEditorState } from '@/app/context/EditorStateContext';
import TextPreview from './text-preview/TextPreview';

const EditorPanel = () => {

  const { editorState, isPreviewMode, setEditorState, setIsPreviewMode } = useEditorState();

<<<<<<< HEAD
  // console.log({ isPreviewMode, editorState })
=======
  console.log({ isPreviewMode, editorState })
>>>>>>> 9b910c7 ([Editor] ul feature added)

  return (
    <>
      {
        !isPreviewMode &&
        <TextEditor editorState={editorState} setEditorState={setEditorState} setIsPreviewMode={setIsPreviewMode} />
      }

      {
        isPreviewMode &&
        <TextPreview editorState={editorState} setIsPreviewMode={setIsPreviewMode} />
      }

    </>
  )
}

export default EditorPanel