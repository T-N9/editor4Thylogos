'use client'
import React from 'react';

/* Nodes */
import { LinkNode } from '@lexical/link'
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { ListNode, ListItemNode } from '@lexical/list';
import { ImageNode } from '../editor-panel/nodes/image-node';
import { CodeHighlightNode, CodeNode } from "@lexical/code";
import { HorizontalRuleNode } from '@lexical/react/LexicalHorizontalRuleNode';
import { LayoutContainerNode } from '../editor-panel/nodes/layout-node/LayoutContainerNode';
import { LayoutItemNode } from '../editor-panel/nodes/layout-node/LayoutItemNode';
import { v4 as uuidv4 } from 'uuid';
import { Parser } from 'htmlparser2';
import { DomHandler, Element, Node } from 'domhandler';
import { render } from 'dom-serializer';
import { useEditorState } from '@/context/EditorStateContext';
import TextPreview from '../editor-panel/text-preview/TextPreview';
import { LexicalComposer } from '@lexical/react/LexicalComposer';

import ExampleTheme from '../editor-panel/editor-theme/DefaultTheme';
import PreviewToolBar from '../editor-panel/preview-toolbar';

interface HeadingInfo {
    content: string;
    tag: string;
    link: string;
}

const addUniqueIdsToHeadings = (htmlString: string): { html: string, headings: HeadingInfo[] } => {
    const headings: HeadingInfo[] = [];

    const handler = new DomHandler((error: Error | null, dom: Node[]) => {
        if (error) {
            throw new Error("Error parsing HTML");
        }

        const traverseAndAddIds = (nodes: Node[]) => {
            nodes.forEach(node => {
                const uuid = uuidv4();
                if (node instanceof Element && /^h[1-6]$/.test(node.tagName)) {
                    const content = node.children.map(child => (child as any).children[0]?.data || '').join('');
                    node.attribs.id = `${content.split(' ').join('-').toLowerCase()}-${uuid.split('-')[1]}`;

                    // console.log({ content })
                    headings.push({ content, tag: node.tagName, link: `${content.split(' ').join('-').toLowerCase()}-${uuid.split('-')[1]}` });
                }
                if ('children' in node && Array.isArray(node.children)) {
                    traverseAndAddIds(node.children);
                }
            });
        };

        traverseAndAddIds(dom);
    });

    const parser = new Parser(handler, { lowerCaseTags: true });
    parser.write(htmlString);
    parser.end();

    return { html: render(handler.dom), headings };
};

const BlogPost = () => {

    const { editorState, setIsPreviewMode } = useEditorState();

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
        ],
        onError(error: Error) {
            console.error(error);
            throw error;
        },
        editorState: editorState.editorState,
        editable: false,
        theme: ExampleTheme,
    };


    return (
        <LexicalComposer initialConfig={initialConfig}>
            <main className={`flex editor-shell mx-auto mt-8 rounded-sm 2xl:max-w-[1440px] max-w-[1300px] 2xl:w-[1440px] lg:w-[1300px] flex-col gap-2 text-gray-800 relative leading-7 font-normal justify-center`}>
                <TextPreview editorState={editorState} isBlogMode={true} setIsPreviewMode={setIsPreviewMode} />
            </main>

            <PreviewToolBar />

        </LexicalComposer>
    )
}

export default BlogPost