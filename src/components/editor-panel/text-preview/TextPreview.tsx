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
import TableOfContent from '../table-of-content';
import { contentSizeClass, LocalEditorState } from '../text-editor/TextEditor';

interface TextPreviewProps {
  editorState: LocalEditorState;
  isBlogMode?: boolean;
}

const TextPreview: React.FC<TextPreviewProps> = ({
  editorState,
  isBlogMode,
}) => {


  useEffect(() => {
    scrollToTop();
  }, []);

  return (
    <main className="inline-block w-full previewing">
      {
        !isBlogMode &&
        <PreviewToolBar />
      }

      <section className="">

        <div
          className={`editor-container mx-auto ${contentSizeClass[editorState.contentSize]}`}>
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
          <TableOfContent />
        </div>

      </section>
    </main>
  );
};

export default TextPreview;
