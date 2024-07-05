'use client'
// EditorStateContext.tsx
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { CAN_USE_DOM } from '../shared/canUseDOM';

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
const initialData: string = '{"root":{"children":[{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1,"textFormat":0}],"direction":null,"format":"","indent":0,"type":"root","version":1}}';

const localState = (): string => {
    try {
        if (CAN_USE_DOM) {
            // console.log('localState is got');
            return localStorage.getItem('thylogos-editorState') || initialData;
        } else {
            return initialData;
        }
    } catch (e) {
        console.error('Error retrieving editor state from localStorage:', e);
        return initialData;
    }
};

export const EditorStateProvider: React.FC<EditorStateProviderProps> = ({ children }) => {

    const [editorState, setEditorState] = useState<string>(initialData);
    const [isPreviewMode, setIsPreviewMode] = useState<boolean>(false);

    return (
        <EditorStateContext.Provider value={{ editorState, isPreviewMode, setEditorState, setIsPreviewMode }}>
            {children}
        </EditorStateContext.Provider>
    );
};
