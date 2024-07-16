'use client'

/* Components */
import { Controller } from 'react-hook-form';
import TextEditor from './text-editor/TextEditor'
import TextPreview from './text-preview/TextPreview';
/* Hooks */
import useFromData from './useFromData';

const EditorPanel = () => {

  const {

    control,
    handleSubmit,

    isPreviewMode,
    onSubmit,
    setIsPreviewMode,

    editorState,

    setEditorState,
    handleTitle,
    handleSlug
  } = useFromData()

  return (
    <>
      <main className={`flex py-8 justify-center editor-shell mx-auto mt-8 rounded-sm 2xl:max-w-[1440px] max-w-[1300px] 2xl:w-[1440px] lg:w-[1300px] ${isPreviewMode ? 'inline-block previewing' : 'flex'} flex-col gap-2 text-gray-800 relative leading-7 font-normal justify-center`}>
        <form className='space-y-4' onSubmit={(e) => { e.preventDefault(); handleSubmit(onSubmit) }}>
          <div className='max-w-[845px] mx-auto space-y-4'>
            <button className='inline-flex cursor-pointer items-center gap-1 rounded border border-slate-300 bg-gradient-to-b from-slate-50 to-slate-200 px-4 py-2 font-semibold hover:opacity-90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-300 focus-visible:ring-offset-2 active:opacity-100' type='submit'>
              Save
            </button>
            <Controller
              name="title"
              control={control}
              defaultValue=""
              render={({ field }) => {
                const { onChange, ...otherFields } = field;
                return (
                  <input {...otherFields} onChange={(e) => {
                    onChange(e);
                    handleTitle()
                  }} className='w-full p-4 border-l text-3xl outline-none' placeholder="Enter Blog Title" required />
                )
              }}
            />
            <Controller
              name="slug"
              control={control}
              defaultValue=""
              render={({ field }) => {
                const { onChange, ...otherFields } = field;
                return (<input {...otherFields} onChange={(e) => {
                  onChange(e);
                  handleSlug();
                }} className='w-full px-4 py-1 border-l text-base outline-none' placeholder="Enter Slug" required />)
              }}
            />
          </div>
          <Controller
            name="content"
            control={control}
            defaultValue=""
            render={({ field }) => <input readOnly className='hidden' {...field} />}
          />
          {
            !isPreviewMode &&
            <TextEditor editorState={editorState} setEditorState={setEditorState} setIsPreviewMode={setIsPreviewMode} />
          }

          {
            isPreviewMode &&
            <TextPreview editorState={editorState} setIsPreviewMode={setIsPreviewMode} />
          }

          <div className='max-w-[845px] mx-auto space-y-4'>
            <button className='inline-flex cursor-pointer items-center gap-1 rounded border border-slate-300 bg-gradient-to-b from-slate-50 to-slate-200 px-4 py-2 font-semibold hover:opacity-90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-300 focus-visible:ring-offset-2 active:opacity-100' type='submit'>
              Submit
            </button>
          </div>

        </form>
      </main>
    </>
  )
}

export default EditorPanel