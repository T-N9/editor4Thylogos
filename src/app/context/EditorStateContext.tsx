'use client'
// EditorStateContext.tsx
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface EditorStateContextProps {
    editorState: string;
    isPreviewMode: boolean;
    /* actions */
    setEditorState: (state: string) => void;
    setIsPreviewMode: (state: boolean) => void;
}

const EditorStateContext = createContext<EditorStateContextProps | undefined>(undefined);

export const useEditorState = () => {
    const context = useContext(EditorStateContext);
    if (!context) {
        throw new Error('useEditorState must be used within an EditorStateProvider');
    }
    return context;
};

interface EditorStateProviderProps {
    children: ReactNode;
}

export const EditorStateProvider: React.FC<EditorStateProviderProps> = ({ children }) => {

    const [localState, setLocalState] = useState('');

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const savedState = localStorage.getItem('thylogos-editorState');
            setLocalState(savedState || '');
        }
    }, []);
    const [editorState, setEditorState] = useState<string>(localState ? localState : '{"root":{"children":[{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1,"textFormat":0}],"direction":null,"format":"","indent":0,"type":"root","version":1}}');
    const [isPreviewMode, setIsPreviewMode] = useState<boolean>(false);

    return (
        <EditorStateContext.Provider value={{ editorState, isPreviewMode, setEditorState, setIsPreviewMode }}>
            {children}
        </EditorStateContext.Provider>
    );
};
