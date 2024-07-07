'use client';
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

interface EditorStateContextProps {
  editorState: string;
  isPreviewMode: boolean;
  htmlData: string;
  headingItems: HeadingItem[];
  isContentShown: boolean;
  /* actions */
  setEditorState: (state: string) => void;
  setIsPreviewMode: (state: boolean) => void;
  setHtmlData: (data: string) => void;
  setHeadingItems: (items: HeadingItem[]) => void;
  setIsContentShown: (state: boolean) => void;
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
  const [editorState, setEditorState] = useState<string>(initialData);
  const [isPreviewMode, setIsPreviewMode] = useState<boolean>(false);
  const [htmlData, setHtmlData] = useState<string>('');
  const [headingItems, setHeadingItems] = useState<HeadingItem[]>([]);
  const [isContentShown, setIsContentShown] = useState<boolean>(false);

  return (
    <EditorStateContext.Provider
      value={{
        editorState,
        isPreviewMode,
        htmlData,
        headingItems,
        isContentShown,
        setEditorState,
        setIsPreviewMode,
        setHtmlData,
        setHeadingItems,
        setIsContentShown
      }}>
      {children}
    </EditorStateContext.Provider>
  );
};
