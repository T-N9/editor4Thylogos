'use client';

import React, { useState, useEffect } from 'react';
import { useLocalStorage } from 'react-use';
import { CAN_USE_DOM } from '@/shared/canUseDOM';
import { useEditorState } from '@/context/EditorStateContext';

/* Lexical Core */
import { LexicalEditor, EditorState } from 'lexical';
import { $generateHtmlFromNodes } from '@lexical/html';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { CheckListPlugin } from '@lexical/react/LexicalCheckListPlugin';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { HorizontalRulePlugin } from '@lexical/react/LexicalHorizontalRulePlugin';

/* Plugins */
import ToolbarPlugin from '../plugins/ToolbarPlugin/ToolbarPlugin';
import LinkPlugin from '../plugins/LinkPlugin';
import CodeHighlightPlugin from '../plugins/CodeHighlightPlugin';
import DraggableBlockPlugin from '../plugins/DraggableBlockPlugin';
import FloatingLinkEditorPlugin from '../plugins/FloatingLinkEditorPlugin/FloatingLinkEditorPlugin';
import FloatingTextFormatToolbarPlugin from '../plugins/FloatingTextFormatToolbarPlugin/FloatingTextFormatToolbarPlugin';
import CodeActionMenuPlugin from '../plugins/CodeActionMenuPlugin';
import TabFocusPlugin from '../plugins/TabFocusPlugin';
import PreviewToolBar from '../preview-toolbar';
import ImagesPlugin from '../plugins/ImagesPlugin';
import { LayoutPlugin } from '../plugins/LayoutPlugin/LayoutPlugin';
import TableOfContent from '../table-of-content';
import CollapsiblePlugin from '../plugins/CollapsiblePlugin';
import AutoEmbedPlugin from '../plugins/AutoEmbedPlugin';
import TwitterPlugin from '../plugins/TwitterPlugin';
import YouTubePlugin from '../plugins/YouTubePlugin';
import FigmaPlugin from '../plugins/FigmaPlugin';

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
                // console.log({localizedEditorState});
                const initialEditorState = editor.parseEditorState(localizedEditorState.editorState)
                setEditorState({ editorState: localizedEditorState.editorState, contentSize: localizedEditorState.contentSize })
                editor.setEditorState(initialEditorState)
            }
        }
    }, [isFirstRender, localizedEditorState?.editorState, editor, localizedEditorState, setEditorState])

    useEffect(() => {
        return editor.registerUpdateListener(({ editorState }) => {
            setLocalizedEditorState((prevState) => ({
                editorState: JSON.stringify(editorState.toJSON()),
                contentSize: prevState?.contentSize ?? 1,
            }));
            onChange(editorState, editor);
        });
    }, [editor, onChange, setLocalizedEditorState]);

    return null;
};

export const contentSizeClass = ['lg:w-[625px] lg:min-w-[625px]', 'lg:w-[845px] lg:min-w-[845px]', 'lg:w-[1095px] lg:min-w-[1095px]', 'lg:w-[1440px] lg:min-w-[1440px]']

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

    const apiContent = '{"root":{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"ဗမာပြည်ကွန်မြူနစ်ပါတီရဲ့ အရှေ့မြောက်စစ်ဒေသ ကို ရင်ဆိုင်ဖို့ ဖွဲ့စည်းခဲ့တဲ့ လားရှိုးက တိုင်းစစ်ဌာနချုပ်ဟာ နှစ်ပေါင်း ငါးဆယ်ကျော်အတွင်း အကြီးမားဆုံးခြိမ်းခြောက် ခံနေရပါတယ်။","type":"text","version":1}],"direction":"ltr","format":"start","indent":0,"type":"paragraph","version":1,"textFormat":0},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"အရှေ့မြောက်တိုင်းစစ်ဌာနချုပ်(ရမခ) က တချိန်ကရခဲ့တဲ့ အောင်ပွဲတွေကို စစ်သားစာရေးဆရာတွေက စာအုပ်တွေထုတ်ရုံမက ဝါဒဖြန့်ရုပ်ရှင်တွေပါ တခမ်းတနား ရိုက်ခဲ့ကြပါသေးတယ်။","type":"text","version":1}],"direction":"ltr","format":"start","indent":0,"type":"paragraph","version":1,"textFormat":0}],"direction":"ltr","format":"","indent":0,"type":"root","version":1}}'

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
        // console.log({ editorData: JSON.stringify(editorStateJSON)});
        editor.update(() => {
            const raw = $generateHtmlFromNodes(editor, null)
            // console.log({ rawHtml: raw })
            setHtmlData(raw)
        })
    };

    return (
      <>
        <ToolbarPlugin
          setIsLinkEditMode={setIsLinkEditMode}
          setIsPreviewMode={setIsPreviewMode}
        />
        <div
          className={`editor-container mx-auto ${contentSizeClass[editorState.contentSize]}`}>
          <RichTextPlugin
            contentEditable={
              <div className="editor-scroller">
                <div className="editor" ref={onRef}>
                  <ContentEditable className="contentEditable" />
                </div>
              </div>
            }
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
          <CollapsiblePlugin/>
          {/* <TreeViewPlugin /> */}
          <LayoutPlugin />
          <TableOfContent />
          <AutoEmbedPlugin/>
          <TwitterPlugin/>
          <YouTubePlugin/>
          <FigmaPlugin/>

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
          <MyOnChangePlugin
            onChange={onChange}
            setEditorState={setEditorState}
          />
        </div>
      </>
    );
};

export default TextEditor;
