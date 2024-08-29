'use client';

import { useEditorState } from '@/context/EditorStateContext';
import { CAN_USE_DOM } from '@/shared/canUseDOM';
import React, { useEffect, useState } from 'react';
import { useLocalStorage } from 'react-use';

/* Lexical Core */
import { $generateHtmlFromNodes } from '@lexical/html';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { CheckListPlugin } from '@lexical/react/LexicalCheckListPlugin';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { HorizontalRulePlugin } from '@lexical/react/LexicalHorizontalRulePlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { EditorState, LexicalEditor } from 'lexical';

/* Plugins */
import { TablePlugin } from '@lexical/react/LexicalTablePlugin';
import AutoEmbedPlugin from '../plugins/AutoEmbedPlugin';
import CodeActionMenuPlugin from '../plugins/CodeActionMenuPlugin';
import CodeHighlightPlugin from '../plugins/CodeHighlightPlugin';
import CollapsiblePlugin from '../plugins/CollapsiblePlugin';
import DraggableBlockPlugin from '../plugins/DraggableBlockPlugin';
import FigmaPlugin from '../plugins/FigmaPlugin';
import FloatingLinkEditorPlugin from '../plugins/FloatingLinkEditorPlugin/FloatingLinkEditorPlugin';
import FloatingTextFormatToolbarPlugin from '../plugins/FloatingTextFormatToolbarPlugin/FloatingTextFormatToolbarPlugin';
import ImagesPlugin from '../plugins/ImagesPlugin';
import { LayoutPlugin } from '../plugins/LayoutPlugin/LayoutPlugin';
import LinkPlugin from '../plugins/LinkPlugin';
import TabFocusPlugin from '../plugins/TabFocusPlugin';
import TableHoverActionsPlugin from '../plugins/TablePlugin/TableHoverActionPlugin';
import ToolbarPlugin from '../plugins/ToolbarPlugin/ToolbarPlugin';
import TwitterPlugin from '../plugins/TwitterPlugin';
import YouTubePlugin from '../plugins/YouTubePlugin';
import PreviewToolBar from '../preview-toolbar';
import TableOfContent from '../table-of-content';

import { useSettings } from '@/context/SettingsContext';
import dynamic from 'next/dynamic';
import { fetchBlogDataBySlug, fetchDraftedBlogData, fetchUnpublishedBlogDataBySlug } from '@/lib/firebase';
import { usePathname } from 'next/navigation';

const TableCellResizer = dynamic(() => import('../plugins/TablePlugin/TableCellResizer'), {
  loading: () => <p>Loading Table Cell Resizer</p>,
})

const TableCellActionMenuPlugin = dynamic(() => import('../plugins/TablePlugin/TableActionMenuPlugin'), {
  loading: () => <p>Loading Table Cell Action Menu Plugin</p>,
})

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
  // const [localizedEditorState, setLocalizedEditorState] = useLocalStorage<
  //   LocalEditorState | null
  // >('my-editor-state-key', null)
  const { currentBlogData, setCurrentBlogData } = useEditorState();

  const pathname = usePathname();
  const isUpdateRoute = pathname.includes('/update');
  const isUnpublishedRoute = pathname.includes('/unpublished');
  const isDraftedRoute = pathname.includes('/drafts')

  const [localizedEditorState, setLocalizedEditorState] =
  useLocalStorage<LocalEditorState | null>('my-editor-state-key', null);

  const [isFirstRender, setIsFirstRender] = useState(true)



  useEffect(() => {
    if (isFirstRender) {
      setIsFirstRender(false)

      if (localizedEditorState && !isUpdateRoute && !isUnpublishedRoute && !isDraftedRoute) {

        console.log('Set Editor State Local upload')
        // console.log({localizedEditorState});
        const initialEditorState = editor?.parseEditorState(localizedEditorState.editorState)
        setEditorState({ editorState: localizedEditorState.editorState, contentSize: localizedEditorState.contentSize })
        editor.setEditorState(initialEditorState)
      } else if (isUpdateRoute) {
        const blogData = fetchBlogDataBySlug(pathname.split('/')[3]);
        blogData.then((data) => {
          // console.log({ state : JSON.parse(data?.content)});
          setCurrentBlogData(data);
          setEditorState({ editorState: JSON.parse(data?.content).editorState, contentSize: JSON.parse(data?.content).contentSize })
          editor.setEditorState(editor?.parseEditorState(JSON.parse(data?.content).editorState))
        })
      } else if (isUnpublishedRoute) {
        const blogData = fetchUnpublishedBlogDataBySlug(pathname.split('/')[3]);
        blogData.then((data) => {
          // console.log({ state : JSON.parse(data?.content)});
          setCurrentBlogData(data);
          setEditorState({ editorState: JSON.parse(data?.content).editorState, contentSize: JSON.parse(data?.content).contentSize })
          editor.setEditorState(editor?.parseEditorState(JSON.parse(data?.content).editorState))
        })
      } else if (isDraftedRoute) {
        const pathnameLocal = window.location.pathname + window.location.search; // Get both pathname and 
        const blogData = fetchDraftedBlogData(pathnameLocal);
        blogData.then((data) => {
          // console.log({ state : JSON.parse(data?.content)});
          setCurrentBlogData(data);
          setEditorState({ editorState: JSON.parse(data?.content).editorState, contentSize: JSON.parse(data?.content).contentSize })
          editor.setEditorState(editor?.parseEditorState(JSON.parse(data?.content).editorState))
        })
      }


    }
  }, [isFirstRender, localizedEditorState?.editorState, editor, localizedEditorState, setEditorState])

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      if (!isUpdateRoute) {
        setLocalizedEditorState((prevState) => ({
          editorState: JSON.stringify(editorState.toJSON()),
          contentSize: prevState?.contentSize ?? 1,
        }));
      }

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

  const {editorState : localState ,htmlData, setHtmlData } = useEditorState();

  useEffect(() => {
    console.log({htmlData});
  }, [localState])

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
    // console.log({ editorData: JSON.stringify(editorStateJSON) });
    editor.update(() => {
      const raw = $generateHtmlFromNodes(editor, null)
      console.log({ rawHtml: raw })
      setHtmlData(raw)
    })
  };

  const {
    settings: {
      tableCellMerge,
      tableCellBackgroundColor,
    },
  } = useSettings();

  return (
    <>
      <ToolbarPlugin
        setIsLinkEditMode={setIsLinkEditMode}
        setIsPreviewMode={setIsPreviewMode}
      />
      <section
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
        <TablePlugin
          hasCellMerge={tableCellMerge}
          hasCellBackgroundColor={tableCellBackgroundColor}
        />

        <TableCellResizer />
        <TableHoverActionsPlugin />
        <TableHoverActionsPlugin />

        {/* <PreviewToolBar /> */}
        <ImagesPlugin />
        <LinkPlugin />
        <ListPlugin />
        <CheckListPlugin />
        <CodeHighlightPlugin />
        <HistoryPlugin />
        <AutoFocusPlugin />
        <TabFocusPlugin />
        <HorizontalRulePlugin />
        <CollapsiblePlugin />
        <LayoutPlugin />
        <TableOfContent />
        <AutoEmbedPlugin />
        <TwitterPlugin />
        <YouTubePlugin />
        <FigmaPlugin />


        {floatingAnchorElem && !isSmallWidthViewport && (
          <>
            <DraggableBlockPlugin anchorElem={floatingAnchorElem} />
            <CodeActionMenuPlugin anchorElem={floatingAnchorElem} />
            <FloatingLinkEditorPlugin
              anchorElem={floatingAnchorElem}
              isLinkEditMode={isLinkEditMode}
              setIsLinkEditMode={setIsLinkEditMode}
            />
            <TableCellActionMenuPlugin
              anchorElem={floatingAnchorElem}
              cellMerge={true}
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
      </section>
    </>
  );
};

export default TextEditor;
