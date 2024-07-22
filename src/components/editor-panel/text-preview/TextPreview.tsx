'use client';

import React, { useEffect } from 'react';

/* Lexical core and plugins */
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import CodeHighlightPlugin from '../plugins/CodeHighlightPlugin';
import { scrollToTop } from '@/utils/scrollToTop';
import PreviewToolBar from '../preview-toolbar';

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
