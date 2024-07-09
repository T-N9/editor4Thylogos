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
import TableOfContent from '../table-of-content';
function Placeholder() {
    return <div className="editor-placeholder">Enter some rich text...</div>;
}

interface MyOnChangePluginProps {
    onChange: (editorState: EditorState, editor: LexicalEditor) => void;
    setEditorState: (state: LocalEditorState) => void;
}

interface TextEditorProps {
    editorState: LocalEditorState;
    setEditorState: (state: LocalEditorState) => void;
    setIsPreviewMode: (isPreviewMode: boolean) => void;
}

export interface LocalEditorState {
    editorState: string;
    contentSize: number
}

const MyOnChangePlugin: React.FC<MyOnChangePluginProps> = ({ onChange, setEditorState }) => {
    const [editor] = useLexicalComposerContext();
    const [localizedEditorState, setLocalizedEditorState] = useLocalStorage<
        LocalEditorState | null
    >('my-editor-state-key', null)
    const [isFirstRender, setIsFirstRender] = useState(true)

    useEffect(() => {
        if (isFirstRender) {
            setIsFirstRender(false)

            if (localizedEditorState) {
                // console.log('Set Editor State')
                const initialEditorState = editor.parseEditorState(localizedEditorState.editorState)
                setEditorState({ editorState: localizedEditorState.editorState, contentSize: localizedEditorState.contentSize })
                editor.setEditorState(initialEditorState)
            }
        }
    }, [isFirstRender, localizedEditorState?.editorState, editor])

    useEffect(() => {
        return editor.registerUpdateListener(({ editorState }) => {
            setLocalizedEditorState((prevState) => ({
                editorState: JSON.stringify(editorState.toJSON()),
                contentSize: prevState?.contentSize ?? 1,
            }));
            onChange(editorState, editor);
        });
    }, [editor, onChange]);

    return null;
};

export const contentSizeClass = ['lg:w-[845px] lg:min-w-[845px]', 'lg:w-[1095px] lg:min-w-[1095px]', 'lg:w-[1440px] lg:min-w-[1440px]']

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

    const onChange = (onChangeEditorState: EditorState, editor: LexicalEditor) => {
        const editorStateJSON = onChangeEditorState.toJSON();
        setEditorState({ editorState: JSON.stringify(editorStateJSON), contentSize: editorState.contentSize });
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
        editorState: editorState.editorState,
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
                    className={`editor-container mx-auto ${contentSizeClass[editorState.contentSize]}`}>
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
                    {/* <TreeViewPlugin /> */}
                    <LayoutPlugin />
                    <TableOfContent />

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
