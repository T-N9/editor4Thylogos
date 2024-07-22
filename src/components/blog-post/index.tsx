'use client'
import { LexicalComposer } from '@lexical/react/LexicalComposer'


/* Nodes */
import { LinkNode } from '@lexical/link'
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { ListNode, ListItemNode } from '@lexical/list';
import { ImageNode } from '../editor-panel/nodes/image-node';
import { CodeHighlightNode, CodeNode } from "@lexical/code";
import { HorizontalRuleNode } from '@lexical/react/LexicalHorizontalRuleNode';
import { LayoutContainerNode } from '../editor-panel/nodes/layout-node/LayoutContainerNode';
import { LayoutItemNode } from '../editor-panel/nodes/layout-node/LayoutItemNode';

import { useEditorState } from '@/context/EditorStateContext';
import TextPreview from '../editor-panel/text-preview/TextPreview';

import ExampleTheme from '../editor-panel/editor-theme/DefaultTheme';
import Image from 'next/image';
import { BgQuoteNode } from '../editor-panel/nodes/bgQuote-node';

interface BlogPostProps {
    title: string;
    slug: string;
    author: string;
    date: string;
    image: string;
    editorState: string; // Assuming editorState is a string containing JSON
    contentSize: number;
}
const BlogPost = ({ title, slug, author, date, image, editorState, contentSize }: BlogPostProps) => {

    const { setEditorState } = useEditorState();

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
            BgQuoteNode
        ],
        onError(error: Error) {
            console.error(error);
            throw error;
        },
        editorState: editorState,
        editable: false,
        theme: ExampleTheme,
    };
    return (
        <LexicalComposer initialConfig={initialConfig}>
            <main className={`flex editor-shell mx-auto mt-8 rounded-sm 2xl:max-w-[1440px] max-w-[1300px] 2xl:w-[1440px] lg:w-[1300px] flex-col gap-2 text-gray-800 relative leading-7 font-normal justify-center`}>
                <div className='max-w-[845px] lg:min-w-[845px] mx-auto space-y-8'>
                    <h1 style={{
                        fontFamily : 'Strong'
                    }} className='text-7xl text-red-800 leading-[5rem]'>{title}</h1>
                    <Image className='w-screen lg:w-full h-[200px] md:h-[400px] object-cover' src={image} width={600} height={400} alt={title}/>
                </div>
                <TextPreview editorState={{ editorState: editorState, contentSize: contentSize }} isBlogMode={true} />
            </main>
        </LexicalComposer>
    )
}

export default BlogPost