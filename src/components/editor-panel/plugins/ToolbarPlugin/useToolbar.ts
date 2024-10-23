import {
  $createParagraphNode,
  $getSelection,
  $isElementNode,
  $isRangeSelection,
  $isRootOrShadowRoot,
  $isTextNode,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  DOMExportOutput,
  EditorConfig,
  ElementFormatType,
  LexicalEditor,
  NodeKey,
  REDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
  UNDO_COMMAND,
} from 'lexical';
import useModal from '@/hooks/useModal';
import {$createCodeNode, $isCodeNode, CODE_LANGUAGE_MAP} from '@lexical/code';
import {
  $findMatchingParent,
  $getNearestBlockElementAncestorOrThrow,
  $getNearestNodeOfType,
  // $isEditorIsNestedEditor,
  mergeRegister,
} from '@lexical/utils';

import {
  $getSelectionStyleValueForProperty,
  $isParentElementRTL,
  $patchStyleText,
  $setBlocksType,
} from '@lexical/selection';
import {
  $isListNode,
  $createListNode,
  $createListItemNode,
  INSERT_CHECK_LIST_COMMAND,
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  ListNode,
} from '@lexical/list';
import {
  $createHeadingNode,
  $createQuoteNode,
  $isHeadingNode,
  $isQuoteNode,
  HeadingNode,
  HeadingTagType,
  SerializedHeadingNode,
} from '@lexical/rich-text';
import {INSERT_HORIZONTAL_RULE_COMMAND} from '@lexical/react/LexicalHorizontalRuleNode';
import {$isDecoratorBlockNode} from '@lexical/react/LexicalDecoratorBlockNode';
import {useCallback, useEffect, useRef, useState, Dispatch} from 'react';
import {$isLinkNode, TOGGLE_LINK_COMMAND} from '@lexical/link';

/* Utils */
import {getSelectedNode} from '@/utils/getSelectedNode';
import {sanitizeUrl} from '@/utils/url';

/* Icons */
import {EyeIcon} from '@heroicons/react/24/outline';
import FontSizeStepper from '../../font-size-stepper/FontSizeStepper';
import FontPicker from '../../font-picker/FontPicker';
import DropdownColorPicker from '../../../ui/DropdownColorPicker';

import {scrollToTop} from '@/utils/scrollToTop';
import InsertLayoutDialog from '../LayoutPlugin/InsertLayoutDialog';
import {useToolbarContext} from '@/context/ToolbarStateContext';
import {$createBgQuoteNode} from '../../nodes/bgQuote-node';
import theme from '../../editor-theme/DefaultTheme';
import { $createCustomHeadingNode } from '../../nodes/heading-node/CustomHeadingNode';

const LowPriority = 1;

export const blockTypeToBlockName = {
  bullet: 'Bulleted List',
  check: 'Check List',
  code: 'Code Block',
  h1: 'Heading 1',
  h2: 'Heading 2',
  h3: 'Heading 3',
  h4: 'Heading 4',
  h5: 'Heading 5',
  h6: 'Heading 6',
  number: 'Numbered List',
  paragraph: 'Normal',
  quote: 'Quote',
  'bg-quote': 'Bg Quote',
};

export const rootTypeToRootName = {
  root: 'Root',
  table: 'Table',
};

export const ELEMENT_FORMAT_OPTIONS: {
  [key in Exclude<ElementFormatType, ''>]: {
    icon: string;
    iconRTL: string;
    name: string;
  };
} = {
  center: {
    icon: 'center-align',
    iconRTL: 'center-align',
    name: 'Center Align',
  },
  end: {
    icon: 'right-align',
    iconRTL: 'left-align',
    name: 'End Align',
  },
  justify: {
    icon: 'justify-align',
    iconRTL: 'justify-align',
    name: 'Justify Align',
  },
  left: {
    icon: 'left-align',
    iconRTL: 'left-align',
    name: 'Left Align',
  },
  right: {
    icon: 'right-align',
    iconRTL: 'right-align',
    name: 'Right Align',
  },
  start: {
    icon: 'left-align',
    iconRTL: 'right-align',
    name: 'Start Align',
  },
};

const useToolbar = (editor: LexicalEditor) => {
  const {
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
  } = useToolbarContext();

  const rootTypeToRootName = {
    root: 'Root',
    table: 'Table',
  };

  const $updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      if (activeEditor !== editor) {
        const rootElement = activeEditor.getRootElement();
        setIsImageCaption(
          !!rootElement?.parentElement?.classList.contains(
            'image-caption-container',
          ),
        );
      } else {
        setIsImageCaption(false);
      }
      const anchorNode = selection.anchor.getNode();
      let element =
        anchorNode.getKey() === 'root'
          ? anchorNode
          : $findMatchingParent(anchorNode, (e) => {
              const parent = e.getParent();
              return parent !== null && $isRootOrShadowRoot(parent);
            });

      if (element === null) {
        element = anchorNode.getTopLevelElementOrThrow();
      }
      const elementKey = element.getKey();
      const elementDOM = activeEditor.getElementByKey(elementKey);
      // Update text format
      setIsBold(selection.hasFormat('bold'));
      setIsItalic(selection.hasFormat('italic'));
      setIsUnderline(selection.hasFormat('underline'));
      setIsStrikethrough(selection.hasFormat('strikethrough'));
      setIsSubscript(selection.hasFormat('subscript'));
      setIsSuperscript(selection.hasFormat('superscript'));
      setIsRTL($isParentElementRTL(selection));

      // Update links
      const node = getSelectedNode(selection);
      const parent = node.getParent();
      if ($isLinkNode(parent) || $isLinkNode(node)) {
        setIsLink(true);
      } else {
        setIsLink(false);
      }

      if (elementDOM !== null) {
        setSelectedElementKey(elementKey);
        if ($isListNode(element)) {
          const parentList = $getNearestNodeOfType<ListNode>(
            anchorNode,
            ListNode,
          );
          const type = parentList
            ? parentList.getListType()
            : element.getListType();
          setBlockType(type);
        } else {
          const type = $isHeadingNode(element)
            ? element.getTag()
            : element.getType();
          if (type in blockTypeToBlockName) {
            setBlockType(type as keyof typeof blockTypeToBlockName);
          }
          if ($isCodeNode(element)) {
            const language =
              element.getLanguage() as keyof typeof CODE_LANGUAGE_MAP;
            setCodeLanguage(
              language ? CODE_LANGUAGE_MAP[language] || language : '',
            );
            return;
          }
        }
      }
      setFontColor(
        $getSelectionStyleValueForProperty(selection, 'color', '#000'),
      );
      setBgColor(
        $getSelectionStyleValueForProperty(
          selection,
          'background-color',
          '#fff',
        ),
      );
      setFontFamily(
        $getSelectionStyleValueForProperty(selection, 'font-family', 'Roboto'),
      );
      let matchingParent;
      if ($isLinkNode(parent)) {
        // If node is a link, we need to fetch the parent paragraph node to set format
        matchingParent = $findMatchingParent(
          node,
          (parentNode) => $isElementNode(parentNode) && !parentNode.isInline(),
        );
      }

      // If matchingParent is a valid node, pass it's format type
      setElementFormat(
        $isElementNode(matchingParent)
          ? matchingParent.getFormatType()
          : $isElementNode(node)
            ? node.getFormatType()
            : parent?.getFormatType() || 'left',
      );
    }
    if ($isRangeSelection(selection)) {
      setFontSize(
        $getSelectionStyleValueForProperty(selection, 'font-size', '18px'),
      );
    }
  }, [
    activeEditor,
    editor,
    setBgColor,
    setFontSize,
    setIsBold,
    setIsItalic,
    setSelectedElementKey,
    setIsLink,
    setBlockType,
    setIsSubscript,
    setIsSuperscript,
    setFontColor,
    setCodeLanguage,
    setElementFormat,
    setIsImageCaption,
    setIsRTL,
    setIsStrikethrough,
    setIsUnderline,
    setFontFamily,
  ]);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({editorState}) => {
        editorState.read(() => {
          $updateToolbar();
        });
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        (_payload, _newEditor) => {
          $updateToolbar();
          return false;
        },
        LowPriority,
      ),
      editor.registerCommand(
        CAN_UNDO_COMMAND,
        (payload) => {
          setCanUndo(payload);
          return false;
        },
        LowPriority,
      ),
      editor.registerCommand(
        CAN_REDO_COMMAND,
        (payload) => {
          setCanRedo(payload);
          return false;
        },
        LowPriority,
      ),
    );
  }, [editor, $updateToolbar, setCanRedo, setCanUndo]);

  const formatParagraph = () => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createParagraphNode());
      }
    });
  };
  const formatHeading = (headingSize: HeadingTagType) => {
    if (blockType !== headingSize) {
      editor.update(() => {
        const selection = $getSelection();
        $setBlocksType(selection, () => $createCustomHeadingNode(headingSize));
      });
    }
  };
  const formatBulletList = () => {
    if (blockType !== 'bullet') {
      editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
    } else {
      formatParagraph();
    }
  };
  const formatCheckList = () => {
    if (blockType !== 'check') {
      editor.dispatchCommand(INSERT_CHECK_LIST_COMMAND, undefined);
    } else {
      formatParagraph();
    }
  };
  const formatNumberedList = () => {
    if (blockType !== 'number') {
      editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
    } else {
      formatParagraph();
    }
  };
  const formatQuote = () => {
    if (blockType !== 'quote') {
      editor.update(() => {
        const selection = $getSelection();
        $setBlocksType(selection, () => $createQuoteNode());
      });
    }
  };

  const formatBgQuote = () => {
    if (blockType !== 'bg-quote') {
      editor.update(() => {
        const selection = $getSelection();
        $setBlocksType(selection, () => $createBgQuoteNode());
      });
    }
  };

  const formatCode = () => {
    if (blockType !== 'code') {
      editor.update(() => {
        let selection = $getSelection();
        if (selection !== null) {
          if (selection.isCollapsed()) {
            $setBlocksType(selection, () => $createCodeNode());
          } else {
            const textContent = selection.getTextContent();
            const codeNode = $createCodeNode();
            selection.insertNodes([codeNode]);
            selection = $getSelection();
            if ($isRangeSelection(selection)) {
              selection.insertRawText(textContent);
            }
          }
        }
      });
    }
  };

  const clearFormatting = useCallback(() => {
    activeEditor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        const anchor = selection.anchor;
        const focus = selection.focus;
        const nodes = selection.getNodes();
        const extractedNodes = selection.extract();

        if (anchor.key === focus.key && anchor.offset === focus.offset) {
          return;
        }

        nodes.forEach((node, idx) => {
          // We split the first and last node by the selection
          // So that we don't format unselected text inside those nodes
          if ($isTextNode(node)) {
            // Use a separate variable to ensure TS does not lose the refinement
            let textNode = node;
            if (idx === 0 && anchor.offset !== 0) {
              textNode = textNode.splitText(anchor.offset)[1] || textNode;
            }
            if (idx === nodes.length - 1) {
              textNode = textNode.splitText(focus.offset)[0] || textNode;
            }
            /**
             * If the selected text has one format applied
             * selecting a portion of the text, could
             * clear the format to the wrong portion of the text.
             *
             * The cleared text is based on the length of the selected text.
             */
            // We need this in case the selected text only has one format
            const extractedTextNode = extractedNodes[0];
            if (nodes.length === 1 && $isTextNode(extractedTextNode)) {
              textNode = extractedTextNode;
            }

            if (textNode.__style !== '') {
              textNode.setStyle('');
            }
            if (textNode.__format !== 0) {
              textNode.setFormat(0);
              $getNearestBlockElementAncestorOrThrow(textNode).setFormat('');
            }
            node = textNode;
          } else if ($isHeadingNode(node) || $isQuoteNode(node)) {
            node.replace($createParagraphNode(), true);
          } else if ($isDecoratorBlockNode(node)) {
            node.setFormat('');
          }
        });
      }
    });
  }, [activeEditor]);

  const canViewerSeeInsertDropdown = !isImageCaption;
  const canViewerSeeInsertCodeButton = !isImageCaption;

  return {
    activeEditor,
    canUndo,
    canRedo,
    isBold,
    isItalic,
    isUnderline,
    isStrikethrough,
    isSubscript,
    isSuperscript,
    isCode,
    isEditable,
    isLink,
    isRTL,
    blockType,
    rootType,
    codeLanguage,
    fontFamily,
    fontSize,
    fontColor,
    elementFormat,
    toolbarRef,
    bgColor,

    modal,
    showModal,

    selectedElementKey,

    canViewerSeeInsertDropdown,
    canViewerSeeInsertCodeButton,

    rootTypeToRootName,
    blockTypeToBlockName,

    UNDO_COMMAND,
    REDO_COMMAND,

    setCanUndo,
    setCanRedo,
    setActiveEditor,
    setRootType,

    formatBulletList,
    formatCheckList,
    formatCode,
    formatHeading,
    formatNumberedList,
    formatParagraph,
    formatQuote,
    formatBgQuote,

    clearFormatting,

    $updateToolbar,
  };
};

export default useToolbar;
