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
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { CheckListPlugin } from '@lexical/react/LexicalCheckListPlugin';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { EditorState, createEditor } from 'lexical';
import ToolbarPlugin from '../plugins/ToolbarPlugin/ToolbarPlugin';
import TreeViewPlugin from '../plugins/TreeViewPlugin';
import LinkPlugin from '../plugins/LinkPlugin';
import CodeHighlightPlugin from '../plugins/CodeHighlightPlugin';
import DraggableBlockPlugin from '../plugins/DraggableBlockPlugin';
import { HorizontalRulePlugin } from '@lexical/react/LexicalHorizontalRulePlugin';

import { CAN_USE_DOM } from '@/app/shared/canUseDOM';
import FloatingLinkEditorPlugin from '../plugins/FloatingLinkEditorPlugin/FloatingLinkEditorPlugin';
import FloatingTextFormatToolbarPlugin from '../plugins/FloatingTextFormatToolbarPlugin/FloatingTextFormatToolbarPlugin';
import { EyeIcon } from '@heroicons/react/16/solid';

import { useEditorState } from '@/app/context/EditorStateContext';

import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { ListNode, ListItemNode } from '@lexical/list';
import { ImageNode } from '../nodes/image-node';
import {
    CodeHighlightNode,
    CodeNode,
    getCodeLanguages,
    registerCodeHighlighting,
} from "@lexical/code";
import { HorizontalRuleNode } from '@lexical/react/LexicalHorizontalRuleNode';
import CodeActionMenuPlugin from '../plugins/CodeActionMenuPlugin';
import TabFocusPlugin from '../plugins/TabFocusPlugin';
import PreviewToolBar from '../preview-toolbar';
import ImagesPlugin from '../plugins/ImagesPlugin';
import { LayoutPlugin } from '../plugins/LayoutPlugin/LayoutPlugin';
import { LayoutContainerNode } from '../nodes/layout-node/LayoutContainerNode';
import { LayoutItemNode } from '../nodes/layout-node/LayoutItemNode';
import { useLocalStorage } from 'react-use'
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
    const [serializedEditorState, setSerializedEditorState] = useLocalStorage<
    string | null
  >('my-editor-state-example-key', null)
  const [isFirstRender, setIsFirstRender] = useState(true)

  useEffect(() => {
    if (isFirstRender) {
      setIsFirstRender(false)

      if (serializedEditorState) {
        const initialEditorState = editor.parseEditorState(serializedEditorState)
        editor.setEditorState(initialEditorState)
      }
    }
  }, [isFirstRender, serializedEditorState, editor])

    useEffect(() => {
        return editor.registerUpdateListener(({ editorState }) => {
            setSerializedEditorState(JSON.stringify(editorState.toJSON()))
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
        // console.log({ editorStateJSON });
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

                    <PreviewToolBar/>
                    <ImagesPlugin/>
                    <LinkPlugin />
                    <ListPlugin />
                    <CheckListPlugin />
                    <CodeHighlightPlugin />
                    <HistoryPlugin />
                    <AutoFocusPlugin />
                    <TabFocusPlugin />
                    <HorizontalRulePlugin />
                    <TreeViewPlugin />
                    <LayoutPlugin/>
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
                    <MyOnChangePlugin onChange={onChange} />
                </div>
            </LexicalComposer>

        </>
    );
};

export default TextEditor;
