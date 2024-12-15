'use client';
import Image from 'next/image';
/* Nodes */
import { AutoLinkNode, LinkNode } from '@lexical/link';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { ListNode, ListItemNode } from '@lexical/list';
import { ImageNode } from './nodes/image-node';
import { CodeHighlightNode, CodeNode } from '@lexical/code';
import { HorizontalRuleNode } from '@lexical/react/LexicalHorizontalRuleNode';
import { LayoutContainerNode } from './nodes/layout-node/LayoutContainerNode';
import { LayoutItemNode } from './nodes/layout-node/LayoutItemNode';
import { TableCellNode, TableNode, TableRowNode } from '@lexical/table';

/* Components */
import { Controller } from 'react-hook-form';
import TextEditor from './text-editor/TextEditor';
/* Hooks */
import useFromData from './useFormData';
import ExampleTheme from './editor-theme/DefaultTheme';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { ToolbarProvider } from '@/context/ToolbarStateContext';
import { BgQuoteNode } from './nodes/bgQuote-node';
import { CollapsibleTitleNode } from './plugins/CollapsiblePlugin/CollapsibleTitleNode';
import { CollapsibleContainerNode } from './plugins/CollapsiblePlugin/CollapsibleContainerNode';
import { CollapsibleContentNode } from './plugins/CollapsiblePlugin/CollapsibleContentNode';
import { YouTubeNode } from './nodes/youtube-node/YouTubeNode';
import { TweetNode } from './nodes/tweet-node/TweetNode';
import { FigmaNode } from './nodes/figma-node';

import { FileUploader } from "react-drag-drop-files";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button } from "@nextui-org/react";
import { CustomHeadingNode } from './nodes/heading-node/CustomHeadingNode';


const EditorPanel = () => {
  const {
    contextEditorState: editorState,
  } = useFromData();

  const initialConfig = {
    namespace: 'My Lexical Board',
    nodes: [
      LinkNode,
      HeadingNode,
      CustomHeadingNode,
      {
        replace: HeadingNode,
        with: (node: HeadingNode) => {
          return new CustomHeadingNode(node.getTag());
        },
        withKlass: CustomHeadingNode,
      },
      ListNode,
      ListItemNode,
      QuoteNode,
      CodeNode,
      CodeHighlightNode,
      HorizontalRuleNode,
      ImageNode,
      LayoutContainerNode,
      LayoutItemNode,
      BgQuoteNode,
      CollapsibleContentNode,
      CollapsibleContainerNode,
      CollapsibleTitleNode,
      TweetNode,
      YouTubeNode,
      AutoLinkNode,
      FigmaNode,
      TableNode,
      TableRowNode,
      TableCellNode,
    ],
    onError(error: Error) {
      console.error(error);
      throw error;
    },
    editorState: editorState.editorState,
    editable: true,
    theme: ExampleTheme,
  };

  return (
    <>
      <LexicalComposer initialConfig={initialConfig}>
        <InnerEditorPanel />
      </LexicalComposer>
    </>
  );
};



const InnerEditorPanel = ({
}: any) => {
  const [editor] = useLexicalComposerContext();
  const {
    contextEditorState: editorState,

    control,
    isPreviewMode,
    tags,
    imagePreview,
    tagData,
    isUpdateRoute,
    isUseExistingImage,
    imageFile,
    isBlogDataUpdated,
    featureImage,
    imageUrls,

    consideredDropDownItems,

    setImagePreview,
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
  } = useFromData();

  // console.log({ current:editorState });
  

  return (
    <ToolbarProvider editor={editor}>
      <main
        className={`editor-shell mx-auto mt-8 flex max-w-[1300px] justify-center rounded-sm py-8 lg:w-[1300px] 2xl:w-[1440px] 2xl:max-w-[1440px] ${isPreviewMode ? 'previewing inline-block' : 'flex'} relative flex-col justify-center gap-2 font-normal leading-7 text-gray-800 dark:text-white`}>

        {/* <ImageUpload />
        <ImageGallery/> */}
        <form
          className="blog-form-panel mb-80 space-y-4"
          onSubmit={handleSubmit(onSubmit)}>
          <div className="mx-auto max-w-[845px] space-y-4">
            <div className='bg-gray-50 rounded flex gap-2 justify-center items-center shadow fixed w-[200px] left-1/2 -translate-x-1/2 top-0 z-50 px-5 py-2'>
              <Button disabled={isUpdateRoute && !isBlogDataUpdated} type="submit" className={`bg-blue-500 rounded-md px-6 py-2 text-white float-right ${isUpdateRoute && !isBlogDataUpdated && 'cursor-not-allowed select-none opacity-50'}`}>{isUpdateRoute ? 'Publish Changes' : 'Publish Article'}
              </Button>

              <Dropdown>
                <DropdownTrigger>
                  <Button
                    isIconOnly
                    color='default'
                    variant="bordered"
                    type='button'
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-3">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                    </svg>

                  </Button>
                </DropdownTrigger>
                <DropdownMenu aria-label="Dynamic Actions" items={consideredDropDownItems()}>
                  {(item) => (
                    <DropdownItem
                      key={item.key}
                      color={item.key === "delete" ? "danger" : "default"}
                      className={`${item.key === "delete" ? "text-danger" : ""} ${item.key === "cancel" ? 'bg-gray-200 ' : ''}`}
                      onClick={item.event}
                    >
                      {item.label}
                    </DropdownItem>
                  )}
                </DropdownMenu>
              </Dropdown>
            </div>
            <Controller
              name="title"
              control={control}
              defaultValue=""
              render={({ field }) => {
                const { onChange, ...otherFields } = field;
                return (
                  <input
                    {...otherFields}
                    onChange={(e) => {
                      onChange(e);
                      handleTitle();
                    }}
                    className="w-full border-l p-4 text-3xl outline-none"
                    placeholder="Enter Blog Title"
                    required
                  />
                );
              }}
            />
            <Controller
              name="slug"
              control={control}
              defaultValue=""
              render={({ field }) => {
                const { onChange, ...otherFields } = field;
                return (
                  <input
                    {...otherFields}
                    onChange={(e) => {
                      onChange(e);
                      handleSlug();
                    }}
                    className="w-full border-l px-4 py-1 text-base outline-none"
                    placeholder="Enter Slug"
                    required
                  />
                );
              }}
            />

            <Controller
              name="tags"
              control={control}
              defaultValue={[]}
              render={({ field }) => (
                <div>

                  {/* Selected Tags */}
                  <div className='relative'>
                    <input
                      className="w-full border-l text-transparent px-4 py-2 text-base outline-none"
                      // placeholder="Enter Tags"
                      value={field.value.join(', ')}
                      onChange={(e) => {
                      }}
                      // onBlur={() => setValue('tags', tags)}
                      required
                    />
                    <div className='absolute top-1/2 -translate-y-1/2 left-4 right-0 flex gap-2 flex-wrap'>
                      {
                        tags.length > 0 ? tags?.map((tag: any) => (
                          <span
                            key={tag}
                            className='py-1 px-3 text-sm flex gap-1 bg-slate-200 shadow rounded-full text-slate-700 hover:text-gray-600 cursor-pointer'
                            onClick={() => removeTag(tag)}
                          >
                            {tag}
                            <button className='text-red-500'>
                              &times;
                            </button>
                          </span>
                        ))
                          :
                          <span className='text-gray-400'>Select Tags</span>
                      }
                    </div>
                  </div>

                  <div className='flex gap-2 mt-1 flex-wrap'>
                    {tagData.map((tag) => (
                      <span
                        key={tag.id}
                        className='p-1 shadow cursor-pointer rounded'
                        onClick={() => handleTagClick(tag.tagName)}
                      >
                        {tag.tagName}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            />

            {/* Feature Images */}
            <div className='relative w-full space-x-2 flex justify-center items-center gap-4'>


              {!imagePreview && <FileUploader handleChange={handleImageFileDrop} />}
              <Controller
                name="featureImage"
                control={control}
                defaultValue={null}
                render={({ field }) => (
                  <>
                    <label className={imagePreview ? 'hidden' : 'cursor-pointer hidden px-4 py-3 bg-gray-200 rounded'} htmlFor="image-upload">Upload New Image</label>
                    <input
                      className='hidden'
                      type="file"
                      id='image-upload'
                      accept="image/*"
                      onChange={async (e: React.ChangeEvent<HTMLInputElement>) => {
                        const files = e.target.files;
                        if (files && files[0]) {
                          setImagePreview(URL.createObjectURL(files[0]));
                          setImageFile(files[0]);

                          console.log({ fileURL: URL.createObjectURL(files[0]), file: files[0] });
                        }
                      }}
                    />
                  </>
                )}
              />
              {!imagePreview &&
                <>
                  <span>OR</span>
                  <button onClick={handleClickUseExistingImage} type='button' className='cursor-pointer px-4 py-2 bg-gray-200 rounded'>Use Existing Image</button>
                </>
              }
            </div>

            {/* Feature Image Caption */}

            {imagePreview &&
              <div className='w-full flex flex-col items-center'>
                <div className='w-1/2 relative'>
                  <button onClick={handleClearImage} type='button' className='rounded-full h-8 w-8 flex justify-center items-center text-white absolute -top-2 -right-2 bg-red-500'>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                    </svg>

                  </button>
                  <img className='w-full' src={imagePreview} alt="Preview" />
                </div>
                <Controller
                  name="imageCaption"
                  control={control}
                  defaultValue=""
                  render={({ field }) => {
                    // const { ...otherFields } = field;
                    return (
                      <input
                        {...field}
                        className="w-full mt-2 border-l px-4 py-1 text-base outline-none"
                        placeholder="Enter caption or Alt text"
                        required

                        disabled={imagePreview === null}
                      />
                    );
                  }}
                />
                {
                  !featureImage &&
                  <button onClick={() => handleUploadImage(imageFile)} type='button' className='bg-gray-100 rounded shadow px-2'>Upload</button>
                }

              </div>
            }


            {
              isUseExistingImage && !imagePreview &&
              <div className='grid grid-cols-3 bg-gray-100 rounded p-2 gap-3'>
                {imageUrls.length > 0 ? (
                  imageUrls.map((image, index) => (
                    <div onClick={() => handleSelectImage(image.imageUrl, image.caption)} key={index} className='flex flex-col gap-2 p-2 cursor-pointer hover:bg-slate-50'>
                      <Image width={200} height={100} src={image.imageUrl} alt={`Image ${index + 1}`} />
                      <p>{image.caption.slice(0, 30)}</p>
                    </div>
                  ))
                ) : (
                  <p>No images found.</p>
                )}
              </div>
            }


          </div>

          <Controller
            name="content"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <input readOnly className="hidden" {...field} />
            )}
          />
          {!isPreviewMode && (
            <TextEditor
              editorState={editorState}
              setEditorState={setEditorState}
              setIsPreviewMode={setIsPreviewMode}
            />
          )}
          <div className="mx-auto max-w-[845px] space-y-4">
            <Controller
              name="summary"
              control={control}
              defaultValue=""
              render={({ field }) => {
                const { onChange, ...otherFields } = field;
                return (
                  <textarea
                    {...otherFields}
                    onChange={(e) => {
                      onChange(e);
                      handleSummary();
                    }}
                    className="w-full border-l px-4 py-1 text-base outline-none"
                    placeholder="Enter Summary"
                    required
                  />
                );
              }}
            />
          </div>

        </form>
      </main>
    </ToolbarProvider>
  );
};

export default EditorPanel;
