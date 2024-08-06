'use client';

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
    editorState,
  } = useFromData();

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
    control,
    handleSubmit,
    isPreviewMode,
    onSubmit,
    setIsPreviewMode,
    editorState,
    setEditorState,
    handleTitle,
    handleSlug,
    handleTagClick,
    removeTag,
    setTags,
    imagePreview,
    setImagePreview,
    featureImage,
    setValue,
    handleSummary,
    tags
  } = useFromData();

  return (
    <ToolbarProvider editor={editor}>
      <main
        className={`editor-shell mx-auto mt-8 flex max-w-[1300px] justify-center rounded-sm py-8 lg:w-[1300px] 2xl:w-[1440px] 2xl:max-w-[1440px] ${isPreviewMode ? 'previewing inline-block' : 'flex'} relative flex-col justify-center gap-2 font-normal leading-7 text-gray-800`}>
        <form
          className="blog-form-panel mb-80 space-y-4"
          onSubmit={handleSubmit(onSubmit)}>
          <div className="mx-auto max-w-[845px] space-y-4">
            <button type="submit">Submit</button>
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
                  <input
                    className="w-full border-l px-4 py-1 text-base outline-none"
                    placeholder="Enter Tags"
                    value={field.value.join(', ')}
                    onChange={(e) => {
                    }}
                    // onBlur={() => setValue('tags', tags)}
                    required
                  />
                  <div className='flex gap-1'>
                    {['Music', 'Programming', 'Teaching'].map((tag) => (
                      <span
                        key={tag}
                        className='p-1 shadow cursor-pointer rounded'
                        onClick={() => handleTagClick(tag)}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  {/* Selected Tags */}
                  <div>
                    {tags.map((tag: any) => (
                      <span
                        key={tag}
                        className='p-1 text-gray-400 hover:text-gray-600 cursor-pointer'
                        onClick={() => removeTag(tag)}
                      >
                        {tag}
                        <button>
                          &times;
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            />
            <Controller
              name="feature-image"
              control={control}
              defaultValue={null}
              render={({ field }) => (
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const files = e.target.files;
                    if (files && files[0]) {
                      setImagePreview(URL.createObjectURL(files[0]));
                      setValue('image', files);
                    }
                  }}
                />
              )}
            />
            {imagePreview && <img src={imagePreview} alt="Preview" />}
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
