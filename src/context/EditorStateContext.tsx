'use client';
import { BlogItem } from '@/lib/firebase';
// EditorStateContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from 'react';

interface HeadingItem {
  content: string;
  tag: string;
  link: string;
}

interface ContextEditorState {
  editorState: string;
  contentSize: number;
}

interface EditorStateContextProps {
  editorState: ContextEditorState;
  isPreviewMode: boolean;
  htmlData: string;
  isContentShown: boolean;
  currentFontColor: string;
  currentBgColor: string;
  currentBlogData : BlogItem | null

  /* actions */
  setEditorState: (state: ContextEditorState) => void;
  setIsPreviewMode: (state: boolean) => void;
  setHtmlData: (data: string) => void;
  setIsContentShown: (state: boolean) => void;
  setCurrentFontColor : (state: string) => void;
  setCurrentBgColor :(state : string) => void;
  setCurrentBlogData : (state : BlogItem | null) => void;
}

const EditorStateContext = createContext<EditorStateContextProps | undefined>(
  undefined,
);

export const useEditorState = () => {
  const context = useContext(EditorStateContext);
  if (!context) {
    throw new Error(
      'useEditorState must be used within an EditorStateProvider',
    );
  }
  return context;
};

interface EditorStateProviderProps {
  children: ReactNode;
}


export const initialData: string =
  '{"root":{"children":[{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1,"textFormat":0}],"direction":null,"format":"","indent":0,"type":"root","version":1}}';



export const EditorStateProvider: React.FC<EditorStateProviderProps> = ({
  children,
}) => {
  const [editorState, setEditorState] = useState<ContextEditorState>({ editorState: initialData, contentSize: 0 });
  const [isPreviewMode, setIsPreviewMode] = useState<boolean>(false);
  const [htmlData, setHtmlData] = useState<string>('');
  const [isContentShown, setIsContentShown] = useState<boolean>(false);
  const [ currentFontColor, setCurrentFontColor] = useState<string>('');
  const [ currentBgColor, setCurrentBgColor] = useState<string>('');
  const [ currentBlogData, setCurrentBlogData] = useState<BlogItem | null>(null);

  return (
    <EditorStateContext.Provider
      value={{
        editorState,
        isPreviewMode,
        htmlData,
        currentBlogData,
        setCurrentBlogData,

        isContentShown,
        setEditorState,
        setIsPreviewMode,
        setHtmlData,
        currentFontColor,
        setCurrentFontColor,

        currentBgColor,
        setCurrentBgColor,

        setIsContentShown
      }}>
      {children}
    </EditorStateContext.Provider>
  );
};
