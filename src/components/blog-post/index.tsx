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
    loading: () => <p>Loading...</p>,
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

    // console.log({ date: createdAt.seconds });
    return (
        <LexicalComposer initialConfig={initialConfig}>
            <main className={`flex editor-shell mx-auto mt-8 rounded-sm 2xl:max-w-[1440px] max-w-[1300px] 2xl:w-[1440px] lg:w-[1300px] flex-col gap-2 text-gray-700 relative leading-7 font-normal justify-center`}>
                <div className="">
                    <div className="max-w-[845px] lg:min-w-[850px] lg:px-8 mx-auto flex flex-col gap-4">
                        <div className='flex-1 flex flex-col gap-4'>
                            <h1
                                style={{ fontFamily: 'MiSans, Inter' }}
                                className="text-4xl lg:text-6xl font-bold text-indigo-950 dark:text-white leading-tight lg:leading-[5rem]"
                            >
                                {title}
                            </h1>

                            <div className="flex justify-between items-center flex-wrap gap-2">
                                <div className="flex flex-wrap gap-2">
                                    {tags.map((tag) => (
                                        <span
                                            key={tag}
                                            className="inline-block text-base text-indigo-600 bg-indigo-100 px-3 py-1 rounded-full"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>

                                <p className="text-gray-500 dark:text-gray-400 text-sm">
                                    {moment(new Date(createdAt.seconds * 1000)).format("D MMM YYYY, h:mm a")}
                                </p>
                            </div>

                            <div className="flex gap-2 items-center  dark:text-indigo-400">
                                <Link href={'/'}>
                                    <span className="text-sm ">Blog</span>
                                </Link>

                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                                </svg>

                                <span className="text-xs text-indigo-600">{title}</span>
                            </div>
                        </div>

                        {/* <div className='flex-1 hidden flex-col gap-4'>
                            <Image
                                className="w-full lg:h-[400px] shadow-md h-[200px] md:h-[500px] object-cover mt-2"
                                src={image}
                                width={600}
                                height={400}
                                alt={title}
                            />

                            {imageCaption && (
                                <div
                                    className="text-xs text-right image-caption -mt-2 text-gray-500 dark:text-gray-400 lg:text-sm"
                                    dangerouslySetInnerHTML={{ __html: imageCaption }}
                                ></div>
                            )}
                        </div> */}
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
    )
}

export default BlogPost