import React, { createContext, useContext, useState, useRef, ReactNode } from 'react';
import { blockTypeToBlockName, rootTypeToRootName } from '@/components/editor-panel/plugins/ToolbarPlugin/useToolbar';
import useModal from '@/hooks/useModal';
import { ElementFormatType, NodeKey, LexicalEditor } from 'lexical';

interface ToolbarContextType {
  activeEditor: LexicalEditor;
  setActiveEditor: React.Dispatch<React.SetStateAction<LexicalEditor>>;
  blockType: keyof typeof blockTypeToBlockName;
  setBlockType: React.Dispatch<React.SetStateAction<keyof typeof blockTypeToBlockName>>;
  rootType: keyof typeof rootTypeToRootName;
  setRootType: React.Dispatch<React.SetStateAction<keyof typeof rootTypeToRootName>>;
  selectedElementKey: NodeKey | null;
  setSelectedElementKey: React.Dispatch<React.SetStateAction<NodeKey | null>>;
  toolbarRef: React.RefObject<HTMLDivElement>;
  canUndo: boolean;
  setCanUndo: React.Dispatch<React.SetStateAction<boolean>>;
  canRedo: boolean;
  setCanRedo: React.Dispatch<React.SetStateAction<boolean>>;
  isBold: boolean;
  setIsBold: React.Dispatch<React.SetStateAction<boolean>>;
  isItalic: boolean;
  setIsItalic: React.Dispatch<React.SetStateAction<boolean>>;
  isUnderline: boolean;
  setIsUnderline: React.Dispatch<React.SetStateAction<boolean>>;
  isStrikethrough: boolean;
  setIsStrikethrough: React.Dispatch<React.SetStateAction<boolean>>;
  isLink: boolean;
  setIsLink: React.Dispatch<React.SetStateAction<boolean>>;
  isEditable: boolean;
  setIsEditable: React.Dispatch<React.SetStateAction<boolean>>;
  codeLanguage: string;
  setCodeLanguage: React.Dispatch<React.SetStateAction<string>>;
  fontSize: string;
  setFontSize: React.Dispatch<React.SetStateAction<string>>;
  fontFamily: string;
  setFontFamily: React.Dispatch<React.SetStateAction<string>>;
  fontColor: string;
  setFontColor: React.Dispatch<React.SetStateAction<string>>;
  bgColor: string;
  setBgColor: React.Dispatch<React.SetStateAction<string>>;
  isSubscript: boolean;
  setIsSubscript: React.Dispatch<React.SetStateAction<boolean>>;
  isSuperscript: boolean;
  setIsSuperscript: React.Dispatch<React.SetStateAction<boolean>>;
  elementFormat: ElementFormatType;
  setElementFormat: React.Dispatch<React.SetStateAction<ElementFormatType>>;
  isRTL: boolean;
  setIsRTL: React.Dispatch<React.SetStateAction<boolean>>;
  isCode: boolean;
  setIsCode: React.Dispatch<React.SetStateAction<boolean>>;
  isImageCaption: boolean;
  setIsImageCaption: React.Dispatch<React.SetStateAction<boolean>>;
  modal: any;
  showModal: (title: string, showModal: (onClose: () => void) => JSX.Element) => void;
}

const ToolbarContext = createContext<ToolbarContextType | undefined>(undefined);

export const ToolbarProvider = ({ editor, children }: { editor: LexicalEditor; children: ReactNode }) => {
  const [activeEditor, setActiveEditor] = useState(editor);
  const [blockType, setBlockType] = useState<keyof typeof blockTypeToBlockName>('paragraph');
  const [rootType, setRootType] = useState<keyof typeof rootTypeToRootName>('root');
  const [selectedElementKey, setSelectedElementKey] = useState<NodeKey | null>(null);
  const toolbarRef = useRef<HTMLDivElement>(null);
  const [canUndo, setCanUndo] = useState<boolean>(false);
  const [canRedo, setCanRedo] = useState<boolean>(false);
  const [isBold, setIsBold] = useState<boolean>(false);
  const [isItalic, setIsItalic] = useState<boolean>(false);
  const [isUnderline, setIsUnderline] = useState<boolean>(false);
  const [isStrikethrough, setIsStrikethrough] = useState<boolean>(false);
  const [isLink, setIsLink] = useState<boolean>(false);
  const [isEditable, setIsEditable] = useState(() => editor.isEditable());
  const [codeLanguage, setCodeLanguage] = useState<string>('');
  const [fontSize, setFontSize] = useState<string>('18px');
  const [fontFamily, setFontFamily] = useState<string>('Roboto');
  const [fontColor, setFontColor] = useState<string>('#000');
  const [bgColor, setBgColor] = useState<string>('#fff');
  const [isSubscript, setIsSubscript] = useState<boolean>(false);
  const [isSuperscript, setIsSuperscript] = useState<boolean>(false);
  const [elementFormat, setElementFormat] = useState<ElementFormatType>('left');
  const [isRTL, setIsRTL] = useState<boolean>(false);
  const [isCode, setIsCode] = useState<boolean>(false);
  const [isImageCaption, setIsImageCaption] = useState<boolean>(false);
  const [modal, showModal] = useModal();

  return (
    <ToolbarContext.Provider
      value={{
        activeEditor,
        setActiveEditor,
        blockType,
        setBlockType,
        rootType,
        setRootType,
        selectedElementKey,
        setSelectedElementKey,
        toolbarRef,
        canUndo,
        setCanUndo,
        canRedo,
        setCanRedo,
        isBold,
        setIsBold,
        isItalic,
        setIsItalic,
        isUnderline,
        setIsUnderline,
        isStrikethrough,
        setIsStrikethrough,
        isLink,
        setIsLink,
        isEditable,
        setIsEditable,
        codeLanguage,
        setCodeLanguage,
        fontSize,
        setFontSize,
        fontFamily,
        setFontFamily,
        fontColor,
        setFontColor,
        bgColor,
        setBgColor,
        isSubscript,
        setIsSubscript,
        isSuperscript,
        setIsSuperscript,
        elementFormat,
        setElementFormat,
        isRTL,
        setIsRTL,
        isCode,
        setIsCode,
        isImageCaption,
        setIsImageCaption,
        modal,
        showModal,
      }}
    >
      {children}
    </ToolbarContext.Provider>
  );
};

export const useToolbarContext = () => {
  const context = useContext(ToolbarContext);
  if (!context) {
    throw new Error('useToolbarContext must be used within a ToolbarProvider');
  }
  return context;
};
