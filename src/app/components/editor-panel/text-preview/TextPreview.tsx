"use client";

import React, { Dispatch } from "react";

/* Lexical Theme */
import ExampleTheme from "../editor-theme/DefaultTheme";

/* Lexical assets */
import { LinkNode } from "@lexical/link";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { ListNode, ListItemNode } from '@lexical/list';
import {
  CodeHighlightNode,
  CodeNode,
  getCodeLanguages,
  registerCodeHighlighting,
} from "@lexical/code";
import { HorizontalRuleNode } from '@lexical/react/LexicalHorizontalRuleNode';
/* Icons */
import { EyeIcon } from "@heroicons/react/16/solid";
import CodeHighlightPlugin from "../plugins/CodeHighlightPlugin";
import { scrollToTop } from "@/app/utils/scrollToTop";


interface TextPreviewProps {
  editorState: string;
  setIsPreviewMode: Dispatch<boolean>;
}

const TextPreview: React.FC<TextPreviewProps> = ({
  editorState,
  setIsPreviewMode,
}) => {
  const initialConfig = {
    namespace: "Preview Board",
    nodes: [LinkNode, HeadingNode, ListNode, ListItemNode, QuoteNode, CodeNode, CodeHighlightNode, HorizontalRuleNode],
    onError(error: Error) {
      console.error(error);
      throw error;
    },
    editorState: editorState,
    editable: false,
    theme: ExampleTheme,
  };
  // console.log({ editorState })
  return (
    <main className="bg-white">
      <section>
        <div className="sticky top-0 z-10 bg-white shadow-md flex px-1 justify-between items-center py-1 ">
          <p className="text-gray-600 font-bold ml-5">Preview</p>
          <button onClick={() => {
            scrollToTop();
            setIsPreviewMode(false)
          }
          } className="toolbar-item">
            <EyeIcon className="size-5" />
          </button>
        </div>

        <LexicalComposer initialConfig={initialConfig}>
          <div className={`editor-container`}>
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
          </div>
        </LexicalComposer>
      </section>
    </main>
  );
};

export default TextPreview;
