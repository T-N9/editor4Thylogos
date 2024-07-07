'use client';

import React, { Dispatch, useEffect } from 'react';

/* Lexical Theme */
import ExampleTheme from '../editor-theme/DefaultTheme';

/* Lexical assets */
import { LinkNode } from '@lexical/link';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { ListNode, ListItemNode } from '@lexical/list';
import {
  CodeHighlightNode,
  CodeNode,
  getCodeLanguages,
  registerCodeHighlighting,
} from '@lexical/code';
import { HorizontalRuleNode } from '@lexical/react/LexicalHorizontalRuleNode';
/* Icons */
import { EyeIcon } from '@heroicons/react/16/solid';
import CodeHighlightPlugin from '../plugins/CodeHighlightPlugin';
import { scrollToTop } from '@/utils/scrollToTop';
import PreviewToolBar from '../preview-toolbar';
import { ImageNode } from '../nodes/image-node';
import { LayoutContainerNode } from '../nodes/layout-node/LayoutContainerNode';
import { LayoutItemNode } from '../nodes/layout-node/LayoutItemNode';
import TableOfContentsPlugin from '../plugins/TableOfContentPlugin';
import { initialData } from '@/context/EditorStateContext';

import { useEditorState } from '@/context/EditorStateContext';

interface TextPreviewProps {
  editorState: string;
  setIsPreviewMode: Dispatch<boolean>;
  isBlogMode?: boolean
}

const TextPreview: React.FC<TextPreviewProps> = ({
  editorState,
  setIsPreviewMode,
  isBlogMode
}) => {
  const initialConfig = {
    namespace: 'Preview Board',
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
    ],
    onError(error: Error) {
      console.error(error);
      throw error;
    },
    editorState: editorState,
    editable: false,
    theme: ExampleTheme,
  };

  useEffect(() => {
    scrollToTop();
  }, []);
  // console.log({same : initialData === editorState })

  const { isContentShown, setIsContentShown } = useEditorState();
  return (
    <main className="inline-block w-full previewing">
      {
        !isBlogMode &&
        <PreviewToolBar />
      }

      <section className="">
        <LexicalComposer initialConfig={initialConfig}>
          <div
            className={`editor-container mx-auto min-w-full lg:min-w-[1095px]`}>
            <RichTextPlugin
              contentEditable={
                <div className="editor-scroller">
                  <div className="editor">
                    <ContentEditable readOnly className="contentEditable" />
                  </div>
                </div>
              }
              placeholder={null}
              ErrorBoundary={LexicalErrorBoundary}
            />
            <CodeHighlightPlugin />
            <aside className={`${isContentShown ? 'transform translate-x-60' : 'translate-x-0'} fixed right-0 transform  top-1/2 -translate-y-1/2 flex z-50 items-start duration-300`}>
              <button className='inline-block p-1 rounded-md bg-gray-200 shadow' onClick={() => setIsContentShown(!isContentShown)}>

                {
                  isContentShown ?
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-gray-500">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m18.75 4.5-7.5 7.5 7.5 7.5m-6-15L5.25 12l7.5 7.5" />
                    </svg>

                    :
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-gray-500">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m5.25 4.5 7.5 7.5-7.5 7.5m6-15 7.5 7.5-7.5 7.5" />
                    </svg>

                }



              </button>
              <TableOfContentsPlugin />
            </aside>
          </div>
        </LexicalComposer>
      </section>
    </main>
  );
};

export default TextPreview;
