/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $createParagraphNode,
  $getNodeByKey,
  $getRoot,
  $getSelection,
  $isElementNode,
  $isRangeSelection,
  $isRootOrShadowRoot,
  $isTextNode,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  COMMAND_PRIORITY_CRITICAL,
  COMMAND_PRIORITY_NORMAL,
  ElementFormatType,
  FORMAT_ELEMENT_COMMAND,
  FORMAT_TEXT_COMMAND,
  INDENT_CONTENT_COMMAND,
  KEY_MODIFIER_COMMAND,
  LexicalEditor,
  NodeKey,
  OUTDENT_CONTENT_COMMAND,
  REDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
  UNDO_COMMAND,
} from 'lexical';
import useModal from "@/app/hooks/useModal";
import DropDown, { DropDownItem } from '../../ui/DropDown';
import {
  $createCodeNode,
  $isCodeNode,
  CODE_LANGUAGE_FRIENDLY_NAME_MAP,
  CODE_LANGUAGE_MAP,
  getLanguageFriendlyName,
} from '@lexical/code';
import {
  $findMatchingParent,
  $getNearestBlockElementAncestorOrThrow,
  $getNearestNodeOfType,
  $isEditorIsNestedEditor,
  mergeRegister,
} from '@lexical/utils';
import {
  INSERT_IMAGE_COMMAND,
  InsertImageDialog,
  InsertImagePayload,
} from "./ImagesPlugin";

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
  HeadingTagType,
} from '@lexical/rich-text';
import { INSERT_HORIZONTAL_RULE_COMMAND } from '@lexical/react/LexicalHorizontalRuleNode';
import { $isDecoratorBlockNode } from '@lexical/react/LexicalDecoratorBlockNode';
import { useCallback, useEffect, useRef, useState, Dispatch } from "react";
import { $isLinkNode, TOGGLE_LINK_COMMAND } from "@lexical/link";

/* Utils */
import { getSelectedNode } from "@/app/utils/getSelectedNode";
import { sanitizeUrl } from "@/app/utils/url";

/* Icons */
import { EyeIcon } from "@heroicons/react/24/outline";
import FontSizeStepper from "../font-size-stepper/FontSizeStepper";
import FontPicker from "../font-picker/FontPicker";
import DropdownColorPicker from "../../ui/DropdownColorPicker";

import { scrollToTop } from "@/app/utils/scrollToTop";
const LowPriority = 1;

function Divider() {
  return <div className="divider" />;
}



const ELEMENT_FORMAT_OPTIONS: {
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

export function dropDownActiveClass(active: boolean) {
  if (active) {
    return 'active dropdown-item-active';
  } else {
    return '';
  }
}

function ElementFormatDropdown({
  editor,
  value,
  isRTL,
  disabled = false,
}: {
  editor: LexicalEditor;
  value: ElementFormatType;
  isRTL: boolean;
  disabled: boolean;
}) {
  const formatOption = ELEMENT_FORMAT_OPTIONS[value || 'left'];

  return (
    <DropDown
      disabled={disabled}
      buttonLabel={formatOption.name}
      buttonIconClassName={`icon ${isRTL ? formatOption.iconRTL : formatOption.icon
        }`}
      buttonClassName="toolbar-item spaced alignment"
      buttonAriaLabel="Formatting options for text alignment">
      <DropDownItem
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'left');
        }}
        className="item">
        <i className="icon left-align" />
        <span className="text">Left Align</span>
      </DropDownItem>
      <DropDownItem
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'center');
        }}
        className="item">
        <i className="icon center-align" />
        <span className="text">Center Align</span>
      </DropDownItem>
      <DropDownItem
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'right');
        }}
        className="item">
        <i className="icon right-align" />
        <span className="text">Right Align</span>
      </DropDownItem>
      <DropDownItem
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'justify');
        }}
        className="item">
        <i className="icon justify-align" />
        <span className="text">Justify Align</span>
      </DropDownItem>
      <DropDownItem
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'start');
        }}
        className="item">
        <i
          className={`icon ${isRTL
            ? ELEMENT_FORMAT_OPTIONS.start.iconRTL
            : ELEMENT_FORMAT_OPTIONS.start.icon
            }`}
        />
        <span className="text">Start Align</span>
      </DropDownItem>
      <DropDownItem
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'end');
        }}
        className="item">
        <i
          className={`icon ${isRTL
            ? ELEMENT_FORMAT_OPTIONS.end.iconRTL
            : ELEMENT_FORMAT_OPTIONS.end.icon
            }`}
        />
        <span className="text">End Align</span>
      </DropDownItem>
      <Divider />
      <DropDownItem
        onClick={() => {
          editor.dispatchCommand(OUTDENT_CONTENT_COMMAND, undefined);
        }}
        className="item">
        <i className={'icon ' + (isRTL ? 'indent' : 'outdent')} />
        <span className="text">Outdent</span>
      </DropDownItem>
      <DropDownItem
        onClick={() => {
          editor.dispatchCommand(INDENT_CONTENT_COMMAND, undefined);
        }}
        className="item">
        <i className={'icon ' + (isRTL ? 'outdent' : 'indent')} />
        <span className="text">Indent</span>
      </DropDownItem>
    </DropDown>
  );
}

export default function ToolbarPlugin({
  setIsLinkEditMode,
  setIsPreviewMode,
}: {
  setIsLinkEditMode: Dispatch<boolean>,
  setIsPreviewMode: Dispatch<boolean>,
}) {
  const [editor] = useLexicalComposerContext();
  const [activeEditor, setActiveEditor] = useState(editor);
  const [blockType, setBlockType] =
    useState<keyof typeof blockTypeToBlockName>('paragraph');
  const [rootType, setRootType] =
    useState<keyof typeof rootTypeToRootName>('root');
  const [selectedElementKey, setSelectedElementKey] = useState<NodeKey | null>(
    null,
  );
  const toolbarRef = useRef(null);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const [isLink, setIsLink] = useState(false);
  const [isEditable, setIsEditable] = useState(() => editor.isEditable());
  const [codeLanguage, setCodeLanguage] = useState<string>('');
  const [fontSize, setFontSize] = useState<string>('15px');
  const [fontFamily, setFontFamily] = useState<string>('Arial');
  const [fontColor, setFontColor] = useState<string>('#000');
  const [bgColor, setBgColor] = useState<string>('#fff');
  const [isSubscript, setIsSubscript] = useState(false);
  const [isSuperscript, setIsSuperscript] = useState(false);
  const [elementFormat, setElementFormat] = useState<ElementFormatType>('left');
  const [isRTL, setIsRTL] = useState(false);
  const [isCode, setIsCode] = useState(false);
  const [isImageCaption, setIsImageCaption] = useState(false);
  const [modal, showModal] = useModal();

  const blockTypeToBlockName = {
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
  };


  function BlockFormatDropDown({
    editor,
    blockType,
    rootType,
    disabled = false,
  }: {
    blockType: keyof typeof blockTypeToBlockName;
    rootType: keyof typeof rootTypeToRootName;
    editor: LexicalEditor;
    disabled?: boolean;
  }): JSX.Element {
    // console.log({ blockType, rootType, editor, activeEditor })
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
          $setBlocksType(selection, () => $createHeadingNode(headingSize));
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
    return (
      <DropDown
        disabled={disabled}
        buttonClassName="toolbar-item block-controls"
        buttonIconClassName={'icon block-type ' + blockType}
        buttonLabel={blockTypeToBlockName[blockType]}
        buttonAriaLabel="Formatting options for text style">
        <DropDownItem
          className={'item ' + dropDownActiveClass(blockType === 'paragraph')}
          onClick={formatParagraph}>
          <i className="icon paragraph" />
          <span className="text">Normal</span>
        </DropDownItem>
        <DropDownItem
          className={'item ' + dropDownActiveClass(blockType === 'h1')}
          onClick={() => formatHeading('h1')}>
          <i className="icon h1" />
          <span className="text">Heading 1</span>
        </DropDownItem>
        <DropDownItem
          className={'item ' + dropDownActiveClass(blockType === 'h2')}
          onClick={() => formatHeading('h2')}>
          <i className="icon h2" />
          <span className="text">Heading 2</span>
        </DropDownItem>
        <DropDownItem
          className={'item ' + dropDownActiveClass(blockType === 'h3')}
          onClick={() => formatHeading('h3')}>
          <i className="icon h3" />
          <span className="text">Heading 3</span>
        </DropDownItem>
        <DropDownItem
          className={'item ' + dropDownActiveClass(blockType === 'bullet')}
          onClick={formatBulletList}>
          <i className="icon bullet-list" />
          <span className="text">Bullet List</span>
        </DropDownItem>
        <DropDownItem
          className={'item ' + dropDownActiveClass(blockType === 'number')}
          onClick={formatNumberedList}>
          <i className="icon numbered-list" />
          <span className="text">Numbered List</span>
        </DropDownItem>
        <DropDownItem
          className={'item ' + dropDownActiveClass(blockType === 'check')}
          onClick={formatCheckList}>
          <i className="icon check-list" />
          <span className="text">Check List</span>
        </DropDownItem>
        <DropDownItem
          className={'item ' + dropDownActiveClass(blockType === 'quote')}
          onClick={formatQuote}>
          <i className="icon quote" />
          <span className="text">Quote</span>
        </DropDownItem>
        <DropDownItem
          className={'item ' + dropDownActiveClass(blockType === 'code')}
          onClick={formatCode}>
          <i className="icon code" />
          <span className="text">Code Block</span>
        </DropDownItem>
      </DropDown>
    );
  }

  const rootTypeToRootName = {
    root: 'Root',
    table: 'Table',
  };

  function getCodeLanguageOptions(): [string, string][] {
    const options: [string, string][] = [];

    for (const [lang, friendlyName] of Object.entries(
      CODE_LANGUAGE_FRIENDLY_NAME_MAP,
    )) {
      options.push([lang, friendlyName]);
    }

    return options;
  }

  const CODE_LANGUAGE_OPTIONS = getCodeLanguageOptions();

  const onCodeLanguageSelect = useCallback(
    (value: string) => {
      activeEditor.update(() => {
        if (selectedElementKey !== null) {
          const node = $getNodeByKey(selectedElementKey);
          if ($isCodeNode(node)) {
            node.setLanguage(value);
          }
        }
      });
    },
    [activeEditor, selectedElementKey],
  );
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
      setIsBold(selection.hasFormat("bold"));
      setIsItalic(selection.hasFormat("italic"));
      setIsUnderline(selection.hasFormat("underline"));
      setIsStrikethrough(selection.hasFormat("strikethrough"));
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
        $getSelectionStyleValueForProperty(selection, 'font-family', 'Arial'),
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
        $getSelectionStyleValueForProperty(selection, 'font-size', '15px'),
      );
    }
  }, [activeEditor, editor]);

  const applyStyleText = useCallback(
    (styles: Record<string, string>, skipHistoryStack?: boolean) => {
      activeEditor.update(
        () => {
          const selection = $getSelection();
          if (selection !== null) {
            $patchStyleText(selection, styles);
          }
        },
        skipHistoryStack ? { tag: 'historic' } : {},
      );
    },
    [activeEditor],
  );

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

  const onFontColorSelect = useCallback(
    (value: string, skipHistoryStack: boolean) => {
      applyStyleText({ color: value }, skipHistoryStack);
    },
    [applyStyleText],
  );

  const onBgColorSelect = useCallback(
    (value: string, skipHistoryStack: boolean) => {
      applyStyleText({ 'background-color': value }, skipHistoryStack);
    },
    [applyStyleText],
  );
  useEffect(() => {
    return editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      (_payload, newEditor) => {
        setActiveEditor(newEditor);
        $updateToolbar();
        return false;
      },
      COMMAND_PRIORITY_CRITICAL,
    );
  }, [editor, $updateToolbar]);

  useEffect(() => {
    activeEditor.getEditorState().read(() => {
      $updateToolbar();
    });
  }, [activeEditor, $updateToolbar]);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
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
        LowPriority
      ),
      editor.registerCommand(
        CAN_UNDO_COMMAND,
        (payload) => {
          setCanUndo(payload);
          return false;
        },
        LowPriority
      ),
      editor.registerCommand(
        CAN_REDO_COMMAND,
        (payload) => {
          setCanRedo(payload);
          return false;
        },
        LowPriority
      )
    );
  }, [editor, $updateToolbar]);

  useEffect(() => {
    return activeEditor.registerCommand(
      KEY_MODIFIER_COMMAND,
      (payload) => {
        const event: KeyboardEvent = payload;
        const { code, ctrlKey, metaKey } = event;

        if (code === 'KeyK' && (ctrlKey || metaKey)) {
          event.preventDefault();
          let url: string | null;
          if (!isLink) {
            setIsLinkEditMode(true);
            url = sanitizeUrl('https://');
          } else {
            setIsLinkEditMode(false);
            url = null;
          }
          return activeEditor.dispatchCommand(TOGGLE_LINK_COMMAND, url);
        }
        return false;
      },
      COMMAND_PRIORITY_NORMAL,
    );
  }, [activeEditor, isLink, setIsLinkEditMode]);

  const insertLink = useCallback(() => {
    if (!isLink) {
      setIsLinkEditMode(true);
      activeEditor.dispatchCommand(
        TOGGLE_LINK_COMMAND,
        sanitizeUrl('https://'),
      );
    } else {
      setIsLinkEditMode(false);
      activeEditor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
    }
  }, [activeEditor, isLink, setIsLinkEditMode]);

  const canViewerSeeInsertDropdown = !isImageCaption;
  const canViewerSeeInsertCodeButton = !isImageCaption;

  return (
    <div className="toolbar flex-1 shadow-md flex justify-between items-start overflow-hidden" ref={toolbarRef}>
      <div className="flex flex-col gap-1">
        <div className="flex flex-col  gap-1">
          {/* //#region */}
          {/* Undo Redo Buttons */}
          <div className="flex justify-center gap-1">
            <button
              disabled={!canUndo}
              onClick={() => {
                editor.dispatchCommand(UNDO_COMMAND, undefined);
              }}
              className="toolbar-item spaced"
              aria-label="Undo"
            >
              <i className="format undo" />
            </button>
            <button
              disabled={!canRedo}
              onClick={() => {
                editor.dispatchCommand(REDO_COMMAND, undefined);
              }}
              className="toolbar-item"
              aria-label="Redo"
            >
              <i className="format redo" />
            </button>
          </div>
          {/* //#endregion */}
          <Divider />

          {/* //#region */}
          {/* BlockType Dropdown */}
          {blockType in blockTypeToBlockName && activeEditor === editor && (
            <>
              <BlockFormatDropDown
                disabled={!isEditable}
                blockType={blockType}
                rootType={rootType}
                editor={activeEditor}
              />
              <Divider />
            </>
          )}
          {/* //#endregion */}

          {
            blockType === 'code' ? (
              <DropDown
                disabled={!isEditable}
                buttonClassName="toolbar-item code-language"
                buttonLabel={getLanguageFriendlyName(codeLanguage)}
                buttonAriaLabel="Select language">
                {CODE_LANGUAGE_OPTIONS.map(([value, name]) => {
                  return (
                    <DropDownItem
                      className={`item ${dropDownActiveClass(
                        value === codeLanguage,
                      )}`}
                      onClick={() => onCodeLanguageSelect(value)}
                      key={value}>
                      <span className="text">{name}</span>
                    </DropDownItem>
                  );
                })}
              </DropDown>
            )
              :
              <>
                <div className="flex gap-1 justify-between items-center">
                  <FontPicker
                    disabled={!isEditable}
                    style={'font-family'}
                    value={fontFamily}
                    editor={activeEditor}
                  />

                  <FontSizeStepper
                    selectionFontSize={fontSize.slice(0, -2)}
                    editor={activeEditor}
                    disabled={!isEditable} />
                </div>
                <Divider />
              </>
          }
          {
            blockType !== 'code' &&
            <>
              <div className="flex flex-wrap justify-start gap-1">
                <button
                  onClick={() => {
                    editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
                  }}
                  className={"toolbar-item spaced " + (isBold ? "active" : "")}
                  aria-label="Format Bold"
                >
                  <i className="format bold" />
                </button>
                <button
                  onClick={() => {
                    editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic");
                  }}
                  className={"toolbar-item spaced " + (isItalic ? "active" : "")}
                  aria-label="Format Italics"
                >
                  <i className="format italic" />
                </button>
                <button
                  onClick={() => {
                    editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline");
                  }}
                  className={"toolbar-item spaced " + (isUnderline ? "active" : "")}
                  aria-label="Format Underline"
                >
                  <i className="format underline" />
                </button>
                {canViewerSeeInsertCodeButton && (
                  <button
                    disabled={!isEditable}
                    onClick={() => {
                      activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'code');
                    }}
                    className={'toolbar-item spaced ' + (isCode ? 'active' : '')}
                    title="Insert code block"
                    type="button"
                    aria-label="Insert code block">
                    <i className="format code" />
                  </button>
                )}
                <button
                  onClick={insertLink}
                  className={'toolbar-item spaced ' + (isLink ? 'active' : '')}
                  aria-label="Insert link"
                  title="Insert link"
                  type="button"
                >
                  <i className="format link" />
                </button>
                <button
                  onClick={() => {
                    activeEditor.dispatchCommand(
                      FORMAT_TEXT_COMMAND,
                      'strikethrough',
                    );
                  }}
                  className={'toolbar-item spaced' + dropDownActiveClass(isStrikethrough)}
                  title="Strikethrough"
                  aria-label="Format text with a strikethrough">
                  <i className="format strikethrough" />
                  {/* <span className="text"></span> */}
                </button>
                <button
                  onClick={() => {
                    activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'subscript');
                  }}
                  className={'toolbar-item spaced' + dropDownActiveClass(isSubscript)}
                  title="Subscript"
                  aria-label="Format text with a subscript">
                  <i className="format subscript" />

                </button>
                <button
                  onClick={() => {
                    activeEditor.dispatchCommand(
                      FORMAT_TEXT_COMMAND,
                      'superscript',
                    );
                  }}
                  className={'toolbar-item spaced ' + dropDownActiveClass(isSuperscript)}
                  title="Superscript"
                  aria-label="Format text with a superscript">
                  <i className="format superscript" />

                </button>
                <button
                  onClick={clearFormatting}
                  className="toolbar-item spaced"
                  title="Clear text formatting"
                  aria-label="Clear all text formatting">
                  <i className="format clear" />

                </button>
              </div>
              <Divider />
            </>
          }

          <ElementFormatDropdown
            disabled={!isEditable}
            value={elementFormat}
            editor={activeEditor}
            isRTL={isRTL}
          />
          {" "}
          {
            blockType !== 'code' &&
            <>

              <Divider />
              <div className="flex gap-1">
                <DropdownColorPicker
                  disabled={!isEditable}
                  buttonClassName="toolbar-item color-picker flex-1"
                  buttonAriaLabel="Formatting text color"
                  buttonIconClassName="icon font-color"
                  color={fontColor}
                  onChange={onFontColorSelect}
                  title="text color"
                />
                <DropdownColorPicker
                  disabled={!isEditable}
                  buttonClassName="toolbar-item color-picker flex-1"
                  buttonAriaLabel="Formatting background color"
                  buttonIconClassName="icon bg-color"
                  color={bgColor}
                  onChange={onBgColorSelect}
                  title="bg color"
                />
              </div>
              <Divider />
            </>
          }




        </div>

        <div className="flex flex-col gap-1">
          <button
            onClick={() => {
              activeEditor.dispatchCommand(
                INSERT_HORIZONTAL_RULE_COMMAND,
                undefined,
              );
            }}
            className=" toolbar-item">
            <i className="icon horizontal-rule" />
            <span className="text">Divider</span>
          </button>

          {canViewerSeeInsertDropdown && (
            <>
              <Divider />
              <DropDown
                disabled={!isEditable}
                buttonClassName="toolbar-item spaced"
                buttonLabel="Image"
                buttonAriaLabel="Insert Image"
                buttonIconClassName="icon plus">
                <DropDownItem
                  onClick={() => {
                    showModal('Insert Image', (onClose) => (
                      <InsertImageDialog
                        activeEditor={activeEditor}
                        onClose={onClose}
                      />
                    ));
                  }}
                  className="item">
                  <i className="icon image" />
                  <span className="text">Image</span>
                </DropDownItem>
                {/* <DropDownItem
                  onClick={() => {
                    showModal('Insert Inline Image', (onClose) => (
                      <InsertInlineImageDialog
                        activeEditor={activeEditor}
                        onClose={onClose}
                      />
                    ));
                  }}
                  className="item">
                  <i className="icon image" />
                  <span className="text">Inline Image</span>
                </DropDownItem> */}
              </DropDown>
            </>
          )}

        </div>
      </div>
      {modal}
    </div>
  );
}
