'use client'

/* Nodes */
import { AutoLinkNode,LinkNode } from '@lexical/link'
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { ListNode, ListItemNode } from '@lexical/list';
import { ImageNode } from './nodes/image-node';
import { CodeHighlightNode, CodeNode } from "@lexical/code";
import { HorizontalRuleNode } from '@lexical/react/LexicalHorizontalRuleNode';
import { LayoutContainerNode } from './nodes/layout-node/LayoutContainerNode';
import { LayoutItemNode } from './nodes/layout-node/LayoutItemNode';

/* Components */
import { Controller } from 'react-hook-form';
import TextEditor from './text-editor/TextEditor'
import TextPreview from './text-preview/TextPreview';
/* Hooks */
import useFromData from './useFromData';
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

  const initialConfig = {
    namespace: 'My Lexical Board',
    nodes: [
      LinkNode,
      HeadingNode,
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
      FigmaNode
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
        <InnerEditorPanel 
          control={control}
          handleSubmit={handleSubmit}
          isPreviewMode={isPreviewMode}
          onSubmit={onSubmit}
          setIsPreviewMode={setIsPreviewMode}
          editorState={editorState}
          setEditorState={setEditorState}
          handleTitle={handleTitle}
          handleSlug={handleSlug}
        />
      </LexicalComposer>
    </>
  )
}

const InnerEditorPanel = ({
  control,
  handleSubmit,
  isPreviewMode,
  onSubmit,
  setIsPreviewMode,
  editorState,
  setEditorState,
  handleTitle,
  handleSlug
} : any) => {
  const [editor] = useLexicalComposerContext();

  return (
    <ToolbarProvider editor={editor}>
      <main className={`flex py-8 justify-center editor-shell mx-auto mt-8 rounded-sm 2xl:max-w-[1440px] max-w-[1300px] 2xl:w-[1440px] lg:w-[1300px] ${isPreviewMode ? 'inline-block previewing' : 'flex'} flex-col gap-2 text-gray-800 relative leading-7 font-normal justify-center`}>
        <form className='blog-form-panel mb-80 space-y-4' onSubmit={(e) => { e.preventDefault(); handleSubmit(onSubmit) }}>
          <div className='max-w-[845px] mx-auto space-y-4'>
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
        </form>
      </main>
    </ToolbarProvider>
  );
}

export default EditorPanel;
