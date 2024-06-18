'use client';

import React, { useState, useEffect, Dispatch } from 'react';
import { $getRoot, $getSelection } from 'lexical';
import ExampleTheme from '../editor-theme/DefaultTheme';

import { LinkNode } from '@lexical/link'
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
<<<<<<< HEAD
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { CheckListPlugin } from '@lexical/react/LexicalCheckListPlugin';
=======
import {ListPlugin} from '@lexical/react/LexicalListPlugin';
>>>>>>> 9b910c7 ([Editor] ul feature added)
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { EditorState, createEditor } from 'lexical';
import ToolbarPlugin from '../plugins/ToolbarPlugin';
import TreeViewPlugin from '../plugins/TreeViewPlugin';
import LinkPlugin from '../plugins/LinkPlugin';
<<<<<<< HEAD
import CodeHighlightPlugin from '../plugins/CodeHighlightPlugin';
import DraggableBlockPlugin from '../plugins/DraggableBlockPlugin';
=======
>>>>>>> 9b910c7 ([Editor] ul feature added)

import { CAN_USE_DOM } from '@/app/shared/canUseDOM';
import FloatingLinkEditorPlugin from '../plugins/FloatingLinkEditorPlugin/FloatingLinkEditorPlugin';
import { EyeIcon } from '@heroicons/react/16/solid';

import { useEditorState } from '@/app/context/EditorStateContext';

<<<<<<< HEAD
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { ListNode, ListItemNode } from '@lexical/list';
import {
    CodeHighlightNode,
    CodeNode,
    getCodeLanguages,
    registerCodeHighlighting,
} from "@lexical/code";
import CodeActionMenuPlugin from '../plugins/CodeActionMenuPlugin';
import TabFocusPlugin from '../plugins/TabFocusPlugin';
=======
import { HeadingNode } from '@lexical/rich-text'
import { ListNode, ListItemNode } from '@lexical/list'
>>>>>>> 9b910c7 ([Editor] ul feature added)
function Placeholder() {
    return <div className="editor-placeholder">Enter some rich text...</div>;
}

interface MyOnChangePluginProps {
    onChange: (editorState: EditorState) => void;
}

interface TextEditorProps {
    editorState: string;
    setEditorState: (state: string) => void;
    setIsPreviewMode: (isPreviewMode: boolean) => void;
}

const MyOnChangePlugin: React.FC<MyOnChangePluginProps> = ({ onChange }) => {
    const [editor] = useLexicalComposerContext();

    useEffect(() => {
        return editor.registerUpdateListener(({ editorState }) => {
            onChange(editorState);
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

    const onChange = (editorState: EditorState) => {
        const editorStateJSON = editorState.toJSON();
        setEditorState(JSON.stringify(editorStateJSON));
<<<<<<< HEAD
        // console.log({ editorStateJSON });
=======
        console.log({editorStateJSON});
>>>>>>> 9b910c7 ([Editor] ul feature added)
    };

    const initialConfig = {
        namespace: 'React.js Demo',
        nodes: [
            LinkNode,
            HeadingNode,
            ListNode,
            ListItemNode,
<<<<<<< HEAD
            QuoteNode,
            CodeNode,
            CodeHighlightNode,
=======
>>>>>>> 9b910c7 ([Editor] ul feature added)
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
                    className={`editor-container`}>
                    <RichTextPlugin
                        contentEditable={<div className="editor-scroller">
                            <div className="editor" ref={onRef}>
                                <ContentEditable className='contentEditable' />
                            </div>
                        </div>}
                        placeholder={<Placeholder />}
                        ErrorBoundary={LexicalErrorBoundary}
                    />
                    <LinkPlugin />
                    <ListPlugin />
<<<<<<< HEAD
                    <CheckListPlugin />
                    <CodeHighlightPlugin />
                    <HistoryPlugin />
                    <AutoFocusPlugin />
                    <TabFocusPlugin/>
                    <TreeViewPlugin />
                    {floatingAnchorElem && !isSmallWidthViewport && (
                        <>
                            <DraggableBlockPlugin anchorElem={floatingAnchorElem} />
                            <CodeActionMenuPlugin anchorElem={floatingAnchorElem} />
=======
                    <HistoryPlugin />
                    <AutoFocusPlugin />
                    <TreeViewPlugin />
                    {floatingAnchorElem && !isSmallWidthViewport && (
                        <>
>>>>>>> 9b910c7 ([Editor] ul feature added)
                            <FloatingLinkEditorPlugin
                                anchorElem={floatingAnchorElem}
                                isLinkEditMode={isLinkEditMode}
                                setIsLinkEditMode={setIsLinkEditMode}
                            />
                        </>
                    )}
                    <MyOnChangePlugin onChange={onChange} />
                </div>
            </LexicalComposer>

        </>
    );
};

export default TextEditor;
