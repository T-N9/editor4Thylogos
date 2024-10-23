'use client'
import React from 'react';

/* Nodes */
import { v4 as uuidv4 } from 'uuid';
import { Parser } from 'htmlparser2';
import { DomHandler, Element, Node } from 'domhandler';
import { render } from 'dom-serializer';
import { useEditorState } from '@/context/EditorStateContext';
import { contentSizeClass } from '../editor-panel/text-editor/TextEditor';

interface HeadingInfo {
    content: string;
    tag: string;
    link: string;
}

export const addUniqueIdsToHeadings = (htmlString: string): { html: string, headings: HeadingInfo[] } => {
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
                    node.attribs.id = `${content.split(' ').join('-').toLowerCase()}`;

                    // console.log({ content })
                    headings.push({ content, tag: node.tagName, link: `${content.split(' ').join('-').toLowerCase()}` });
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

    const { htmlData, editorState } = useEditorState();

    return (

        <main className={`flex  pt-8 rounded-sm flex-col gap-2 text-gray-700 dark:text-white relative leading-7 font-normal justify-center`}>
            <article className="inline-block w-full previewing">
                <div className={`editor-container mx-auto {${contentSizeClass[editorState.contentSize]}`} aria-readonly>
                    <div dangerouslySetInnerHTML={{ __html: htmlData }}>
                    
                    </div>
                </div>
            </article>
        </main>

    )
}

export default BlogPost