'use client'
import { LexicalComposer } from '@lexical/react/LexicalComposer'

/* Nodes */
import { AutoLinkNode, LinkNode } from '@lexical/link'
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { ListNode, ListItemNode } from '@lexical/list';
import { ImageNode } from '../editor-panel/nodes/image-node';
import { CodeHighlightNode, CodeNode } from "@lexical/code";
import { HorizontalRuleNode } from '@lexical/react/LexicalHorizontalRuleNode';
import { LayoutContainerNode } from '../editor-panel/nodes/layout-node/LayoutContainerNode';
import { LayoutItemNode } from '../editor-panel/nodes/layout-node/LayoutItemNode';

import moment from 'moment';
import {
    TableCellNode,
    TableNode,
    TableRowNode,
} from '@lexical/table';
// import TextPreview from '../editor-panel/text-preview/TextPreview';

import ExampleTheme from '../editor-panel/editor-theme/DefaultTheme';
import Image from 'next/image';
import { BgQuoteNode } from '../editor-panel/nodes/bgQuote-node';
import { CollapsibleContentNode } from '../editor-panel/plugins/CollapsiblePlugin/CollapsibleContentNode';
import { CollapsibleContainerNode } from '../editor-panel/plugins/CollapsiblePlugin/CollapsibleContainerNode';
import { CollapsibleTitleNode } from '../editor-panel/plugins/CollapsiblePlugin/CollapsibleTitleNode';
import { TweetNode } from '../editor-panel/nodes/tweet-node/TweetNode';
import { YouTubeNode } from '../editor-panel/nodes/youtube-node/YouTubeNode';
import { FigmaNode } from '../editor-panel/nodes/figma-node';
import Link from 'next/link';
import dynamic from 'next/dynamic';

const TextPreview = dynamic(() => import('../editor-panel/text-preview/TextPreview'), {
    ssr: false,
    loading: () => <div className='text-center text-indigo-600 min-h-screen flex justify-center'>

        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 animate-spinner-ease-spin -rotate-[45deg] mt-40">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12a7.5 7.5 0 0 0 15 0m-15 0a7.5 7.5 0 1 1 15 0m-15 0H3m16.5 0H21m-1.5 0H12m-8.457 3.077 1.41-.513m14.095-5.13 1.41-.513M5.106 17.785l1.15-.964m11.49-9.642 1.149-.964M7.501 19.795l.75-1.3m7.5-12.99.75-1.3m-6.063 16.658.26-1.477m2.605-14.772.26-1.477m0 17.726-.26-1.477M10.698 4.614l-.26-1.477M16.5 19.794l-.75-1.299M7.5 4.205 12 12m6.894 5.785-1.149-.964M6.256 7.178l-1.15-.964m15.352 8.864-1.41-.513M4.954 9.435l-1.41-.514M12.002 12l-3.75 6.495" />
            </svg>

        </svg>
    </div>,
});

interface BlogPostProps {
    title: string;
    slug: string;
    image: string;
    imageCaption: string;
    editorState: string;
    contentSize: number;
    tags: string[];
    createdAt: {
        seconds: number;
        nanoseconds: number;
    };
}
const BlogPost = ({ title, slug, image, imageCaption, tags, createdAt, editorState, contentSize }: BlogPostProps) => {

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
            TableCellNode
        ],
        onError(error: Error) {
            console.error(error);
            throw error;
        },
        editorState: editorState,
        editable: false,
        theme: ExampleTheme,
    };

    type LexicalNode = {
        children?: LexicalNode[];
        text?: string;
        type: string;
    };

    type LexicalEditorState = {
        root: LexicalNode;
    };

    const calculateReadTime = (editorState: string): number => {
        try {
            const parsedState: LexicalEditorState = JSON.parse(editorState);

            const extractText = (node: LexicalNode): string => {
                let textContent = '';

                if (node.text) {
                    textContent += node.text;
                }

                if (node.children) {
                    for (const child of node.children) {
                        textContent += extractText(child);
                    }
                }

                return textContent;
            };

            const rootNode = parsedState.root;
            const textContent = extractText(rootNode);

            // Assuming average reading speed is 200 words per minute
            const wordsPerMinute = 200;
            const wordCount = textContent.split(/\s+/).filter(word => word).length;
            const readTime = Math.ceil(wordCount / wordsPerMinute);

            console.log({ readTime });
            return readTime;
        } catch (error) {
            console.error('Error parsing editor state:', error);
            return 0; // Default to 0 minutes if there is an error
        }
    };

    return (
        <>
            <LexicalComposer initialConfig={initialConfig}>
                <main className={`flex editor-shell mx-auto pt-8 rounded-sm 2xl:max-w-[1440px] max-w-[1300px] 2xl:w-[1440px] lg:w-[1300px] flex-col gap-2 text-gray-700 dark:text-white relative leading-7 font-normal justify-center`}>
                    <div className="">
                        <div className="relative filtered-content max-w-[845px] lg:min-w-[850px] lg:px-8 mx-auto flex flex-col gap-4">
                            <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]"></div>

                            <div className='flex-1 flex flex-col gap-4 relative z-10'>
                                <h1
                                    style={{ fontFamily: 'MiSans, Inter' }}
                                    className="text-4xl lg:text-6xl font-bold text-indigo-950 dark:text-gray-200 leading-tight lg:leading-[5rem]"
                                >
                                    {title}
                                </h1>

                                <div className="lg:flex justify-between items-center flex-wrap gap-2">
                                    <div className="flex flex-wrap gap-2">
                                        {tags.map((tag) => (
                                            <span
                                                key={tag}
                                                className={`${tag.toLowerCase() === "pinned" && 'relative'} inline-block text-xs lg:text-base text-indigo-600 bg-indigo-100 px-3 py-1 rounded-full`}
                                            >
                                                {tag}

                                                {tag.toLowerCase() === "pinned" && <span className='absolute -top-3 text-lg'>📌</span>}
                                            </span>
                                        ))}
                                    </div>

                                    <div className='lg:mt-4 mt-4 self-start flex gap-4'>
                                        <p className="text-gray-500 dark:text-gray-400 text-sm text-right">
                                            {moment(new Date(createdAt.seconds * 1000)).format("D MMM YYYY, h:mm a")} <br />
                                        </p>
                                        <div className='flex gap-2 justify-end items-center'>
                                            <span className="relative flex h-2 w-2">
                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                                                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                                            </span>

                                            <span className='text-sm text-gray-500'>{calculateReadTime(editorState)} min read</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-2 items-center  dark:text-gray-400">
                                    <Link href={'/'}>
                                        <span className="text-sm ">Blog</span>
                                    </Link>

                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                                    </svg>

                                    <span className="text-xs text-indigo-600">{title}</span>
                                </div>
                            </div>

                        </div>

                        <div className='flex justify-center relative items-center mt-2 border-t-2 border-indigo-400'>
                            <span className='w-[1px] h-8 bg-indigo-400'>


                            </span>
                            <span className='w-2 h-2 absolute bottom-0 rounded-full bg-indigo-400'></span>
                        </div>

                        <div className='-mt-5 min-h-screen'>
                            <TextPreview editorState={{ editorState: editorState, contentSize: contentSize }} isBlogMode={true} />
                        </div>

                        <div className='flex justify-center relative items-center mt-2 border-t-2 border-indigo-400'>
                            <span className='w-[1px] absolute -top-8 h-8 bg-indigo-400'>


                            </span>
                            <span className='w-2 h-2 absolute -top-8 rounded-full bg-indigo-400'></span>
                        </div>
                    </div>
                </main>
            </LexicalComposer>
        </>
    )
}

export default BlogPost