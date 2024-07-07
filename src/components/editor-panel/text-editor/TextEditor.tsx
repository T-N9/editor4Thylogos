'use client';

import React, { useState, useEffect } from 'react';
import { LexicalEditor } from 'lexical';
import ExampleTheme from '../editor-theme/DefaultTheme';

import { LinkNode } from '@lexical/link'
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { CheckListPlugin } from '@lexical/react/LexicalCheckListPlugin';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { EditorState } from 'lexical';
import ToolbarPlugin from '../plugins/ToolbarPlugin/ToolbarPlugin';
import TreeViewPlugin from '../plugins/TreeViewPlugin';
import LinkPlugin from '../plugins/LinkPlugin';
import CodeHighlightPlugin from '../plugins/CodeHighlightPlugin';
import DraggableBlockPlugin from '../plugins/DraggableBlockPlugin';
import { HorizontalRulePlugin } from '@lexical/react/LexicalHorizontalRulePlugin';

import { CAN_USE_DOM } from '@/shared/canUseDOM';
import FloatingLinkEditorPlugin from '../plugins/FloatingLinkEditorPlugin/FloatingLinkEditorPlugin';
import FloatingTextFormatToolbarPlugin from '../plugins/FloatingTextFormatToolbarPlugin/FloatingTextFormatToolbarPlugin';

import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { ListNode, ListItemNode } from '@lexical/list';
import { ImageNode } from '../nodes/image-node';
import {
    CodeHighlightNode,
    CodeNode,
} from "@lexical/code";
import { HorizontalRuleNode } from '@lexical/react/LexicalHorizontalRuleNode';
import CodeActionMenuPlugin from '../plugins/CodeActionMenuPlugin';
import TableOfContentsPlugin from '../plugins/TableOfContentPlugin';
import TabFocusPlugin from '../plugins/TabFocusPlugin';
import PreviewToolBar from '../preview-toolbar';
import ImagesPlugin from '../plugins/ImagesPlugin';
import { LayoutPlugin } from '../plugins/LayoutPlugin/LayoutPlugin';
import { LayoutContainerNode } from '../nodes/layout-node/LayoutContainerNode';
import { LayoutItemNode } from '../nodes/layout-node/LayoutItemNode';
import { useLocalStorage } from 'react-use';
import { $generateHtmlFromNodes } from '@lexical/html';
import { useEditorState } from '@/context/EditorStateContext';
function Placeholder() {
    return <div className="editor-placeholder">Enter some rich text...</div>;
}

interface MyOnChangePluginProps {
    onChange: (editorState: EditorState, editor: LexicalEditor) => void;
    setEditorState: (state: string) => void;
}

interface TextEditorProps {
    editorState: string;
    setEditorState: (state: string) => void;
    setIsPreviewMode: (isPreviewMode: boolean) => void;
}

const MyOnChangePlugin: React.FC<MyOnChangePluginProps> = ({ onChange, setEditorState }) => {
    const [editor] = useLexicalComposerContext();
    const [serializedEditorState, setSerializedEditorState] = useLocalStorage<
        string | null
    >('my-editor-state-key', null)
    const [isFirstRender, setIsFirstRender] = useState(true)



    useEffect(() => {
        if (isFirstRender) {
            setIsFirstRender(false)

            if (serializedEditorState) {
                // console.log('Set Editor State')
                const initialEditorState = editor.parseEditorState(serializedEditorState)
                setEditorState(serializedEditorState)
                editor.setEditorState(initialEditorState)
            }
        }
    }, [isFirstRender, serializedEditorState, editor])

    useEffect(() => {
        return editor.registerUpdateListener(({ editorState }) => {
            setSerializedEditorState(JSON.stringify(editorState.toJSON()))
            onChange(editorState, editor);
        });
    }, [editor, onChange]);

    return null;
};

const TextEditor: React.FC<TextEditorProps> = ({ editorState, setEditorState, setIsPreviewMode }) => {
    /* States */
    const [isLinkEditMode, setIsLinkEditMode] = useState<boolean>(false);
    const [floatingAnchorElem, setFloatingAnchorElem] =
        useState<HTMLDivElement | null>(null);
    const [isSmallWidthViewport, setIsSmallWidthViewport] =
        useState<boolean>(false);

    const onRef = (_floatingAnchorElem: HTMLDivElement) => {
        if (_floatingAnchorElem !== null) {
            setFloatingAnchorElem(_floatingAnchorElem);
        }
    };

    const { isContentShown, setHtmlData, setIsContentShown } = useEditorState();

    useEffect(() => {
        const updateViewPortWidth = () => {
            const isNextSmallWidthViewport =
                CAN_USE_DOM && window.matchMedia('(max-width: 1025px)').matches;

            if (isNextSmallWidthViewport !== isSmallWidthViewport) {
                setIsSmallWidthViewport(isNextSmallWidthViewport);
            }
        };
        updateViewPortWidth();
        window.addEventListener('resize', updateViewPortWidth);

        return () => {
            window.removeEventListener('resize', updateViewPortWidth);
        };
    }, [isSmallWidthViewport]);

    const onChange = (editorState: EditorState, editor: LexicalEditor) => {
        const editorStateJSON = editorState.toJSON();
        setEditorState(JSON.stringify(editorStateJSON));
        // console.log({ editorStateJSON });
        editor.update(() => {
            const raw = $generateHtmlFromNodes(editor, null)
            // console.log({ rawHtml: raw })
            setHtmlData(raw)
        })
    };

    const initialConfig = {
        namespace: 'React.js Demo',
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
            LayoutItemNode
        ],
        editorState: editorState,
        // Handling of errors during update
        onError(error: Error) {
            console.error(error);
            throw error;
        },
        // The editor theme
        theme: ExampleTheme,
    };

    return (
        <>
            <LexicalComposer initialConfig={initialConfig}>
                <ToolbarPlugin setIsLinkEditMode={setIsLinkEditMode} setIsPreviewMode={setIsPreviewMode} />
                <div
                    className={`editor-container mx-auto flex-[6] min-w-full lg:min-w-[1095px]`}>
                    <RichTextPlugin
                        contentEditable={<div className="editor-scroller">
                            <div className="editor" ref={onRef}>
                                <ContentEditable className='contentEditable' />
                            </div>
                        </div>}
                        placeholder={<Placeholder />}
                        ErrorBoundary={LexicalErrorBoundary}
                    />

                    <PreviewToolBar />
                    <ImagesPlugin />
                    <LinkPlugin />
                    <ListPlugin />
                    <CheckListPlugin />
                    <CodeHighlightPlugin />
                    <HistoryPlugin />
                    <AutoFocusPlugin />
                    <TabFocusPlugin />
                    <HorizontalRulePlugin />
                    <TreeViewPlugin />
                    <LayoutPlugin />
                    <aside className={`${isContentShown ? 'transform translate-x-60' : 'translate-x-0'} fixed right-0 transform  top-1/2 -translate-y-1/2 flex z-50 items-start duration-300`}>
                        <button className='inline-block p-1 rounded-md bg-gray-200 shadow' onClick={() => setIsContentShown(!isContentShown)}>
                            {
                                isContentShown ?
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-gray-500">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m18.75 4.5-7.5 7.5 7.5 7.5m-6-15L5.25 12l7.5 7.5" />
                                    </svg>

                                    :
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-gray-500">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m5.25 4.5 7.5 7.5-7.5 7.5m6-15 7.5 7.5-7.5 7.5" />
                                    </svg>
                            }
                        </button>
                        <TableOfContentsPlugin />
                    </aside>

                    {floatingAnchorElem && !isSmallWidthViewport && (
                        <>
                            <DraggableBlockPlugin anchorElem={floatingAnchorElem} />
                            <CodeActionMenuPlugin anchorElem={floatingAnchorElem} />
                            <FloatingLinkEditorPlugin
                                anchorElem={floatingAnchorElem}
                                isLinkEditMode={isLinkEditMode}
                                setIsLinkEditMode={setIsLinkEditMode}
                            />
                            <FloatingTextFormatToolbarPlugin
                                anchorElem={floatingAnchorElem}
                                setIsLinkEditMode={setIsLinkEditMode}
                            />
                        </>
                    )}
                    <MyOnChangePlugin onChange={onChange} setEditorState={setEditorState} />
                </div>
            </LexicalComposer>

        </>
    );
};

export default TextEditor;
