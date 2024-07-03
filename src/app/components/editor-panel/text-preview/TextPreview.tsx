"use client";

import React, { Dispatch, useEffect } from "react";

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
import PreviewToolBar from "../preview-toolbar";
import { ImageNode } from "../nodes/image-node";
import { LayoutContainerNode } from "../nodes/layout-node/LayoutContainerNode";
import { LayoutItemNode } from "../nodes/layout-node/LayoutItemNode";
import TableOfContentsPlugin from "../plugins/TableOfContentPlugin";


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
    nodes: [LinkNode, HeadingNode, ListNode, ListItemNode, QuoteNode, CodeNode, CodeHighlightNode, HorizontalRuleNode, ImageNode, LayoutContainerNode, LayoutItemNode],
    onError(error: Error) {
      console.error(error);
      throw error;
    },
    editorState: editorState,
    editable: false,
    theme: ExampleTheme,
  };

  useEffect(() => {
      scrollToTop()
  }, [])
  // console.log({ editorState })
  return (


    <main className="w-full inline-block">
      <PreviewToolBar />
      <section className="">
        <LexicalComposer initialConfig={initialConfig}>
          <div className={`editor-container mx-auto min-w-full lg:min-w-[1095px]`}>
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
            <TableOfContentsPlugin />
          </div>
        </LexicalComposer>
      </section>
    </main>
  );
};

export default TextPreview;
