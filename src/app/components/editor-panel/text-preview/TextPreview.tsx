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
<<<<<<< HEAD
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { ListNode, ListItemNode } from '@lexical/list';
import {
  CodeHighlightNode,
  CodeNode,
  getCodeLanguages,
  registerCodeHighlighting,
} from "@lexical/code";

/* Icons */
import { EyeIcon } from "@heroicons/react/16/solid";
import CodeHighlightPlugin from "../plugins/CodeHighlightPlugin";
=======
import { HeadingNode } from '@lexical/rich-text';
import { ListNode, ListItemNode } from '@lexical/list'

/* Icons */
import { EyeIcon } from "@heroicons/react/16/solid";
>>>>>>> 9b910c7 ([Editor] ul feature added)


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
<<<<<<< HEAD
    nodes: [LinkNode, HeadingNode, ListNode, ListItemNode, QuoteNode, CodeNode, CodeHighlightNode],
=======
    nodes: [LinkNode, HeadingNode, ListNode, ListItemNode],
>>>>>>> 9b910c7 ([Editor] ul feature added)
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
    <main className="bg-white rounded-xl">
      <section>
        <div className="flex px-1 justify-between items-center py-1 border-b-2 border-solid border-gray-200">
          <p className="text-gray-600 font-bold ml-5">Preview</p>
          <button onClick={() => setIsPreviewMode(false)} className="toolbar-item">
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
<<<<<<< HEAD
            <CodeHighlightPlugin />
=======
>>>>>>> 9b910c7 ([Editor] ul feature added)
          </div>
        </LexicalComposer>
      </section>
    </main>
  );
};

export default TextPreview;
