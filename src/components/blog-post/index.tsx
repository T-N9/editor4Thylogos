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
import TextPreview from '../editor-panel/text-preview/TextPreview';

import ExampleTheme from '../editor-panel/editor-theme/DefaultTheme';
import Image from 'next/image';
import { BgQuoteNode } from '../editor-panel/nodes/bgQuote-node';
import { CollapsibleContentNode } from '../editor-panel/plugins/CollapsiblePlugin/CollapsibleContentNode';
import { CollapsibleContainerNode } from '../editor-panel/plugins/CollapsiblePlugin/CollapsibleContainerNode';
import { CollapsibleTitleNode } from '../editor-panel/plugins/CollapsiblePlugin/CollapsibleTitleNode';
import { TweetNode } from '../editor-panel/nodes/tweet-node/TweetNode';
import { YouTubeNode } from '../editor-panel/nodes/youtube-node/YouTubeNode';
import { FigmaNode } from '../editor-panel/nodes/figma-node';

interface BlogPostProps {
    title: string;
    slug: string;
    image: string;
    imageCaption: string;
    editorState: string; // Assuming editorState is a string containing JSON
    contentSize: number;
    tags: string[];
    createdAt: {
        seconds: number;
        nanoseconds: number;
    };
}
const BlogPost = ({ title, slug, image, imageCaption, tags, createdAt, editorState, contentSize }: BlogPostProps) => {

    // const { setEditorState } = useEditorState();

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

    console.log({ date: createdAt.seconds });
    return (
        <LexicalComposer initialConfig={initialConfig}>
            <main className={`flex editor-shell mx-auto mt-8 rounded-sm 2xl:max-w-[1440px] max-w-[1300px] 2xl:w-[1440px] lg:w-[1300px] flex-col gap-2 text-gray-700 relative leading-7 font-normal justify-center`}>
                <div className=''>
                    <div className='max-w-[845px] lg:min-w-[845px] px-8 mx-auto flex flex-col gap-2'>
                        <h1 style={{
                            fontFamily: 'Walone'
                        }} className='text-6xl font-bold text-slate-600 leading-[6rem]'>{title}</h1>
                        <div className='flex justify-between items-center'>
                            <div className='flex flex-wrap gap-2'>
                                {tags.map((tag) => (
                                    <span key={tag} className='inline-block text-base text-gray-600 bg-gray-200 px-2 py-0.5 rounded-sm'>{tag}</span>
                                ))}
                            </div>

                            <div>
                                <p className='text-gray-400'>
                                    {moment(new Date(createdAt.seconds * 1000)).format(
                                        "D MMM YYYY, h:mm a"
                                    )}
                                </p>

                            </div>
                        </div>

                        <Image className='w-screen mt-2 lg:w-full lg:h-[500px] h-[300px] md:h-[500px] object-cover' src={image} width={600} height={500} alt={title} />
                        <div className='image-caption text-sm' dangerouslySetInnerHTML={{ __html: imageCaption }} ></div>
                    </div>
                    <TextPreview editorState={{ editorState: editorState, contentSize: contentSize }} isBlogMode={true} />
                </div>
            </main>
        </LexicalComposer>
    )
}

export default BlogPost