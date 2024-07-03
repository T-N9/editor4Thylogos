/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $getNodeByKey,

  $getSelection,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  COMMAND_PRIORITY_CRITICAL,
  COMMAND_PRIORITY_NORMAL,
  KEY_MODIFIER_COMMAND,
  SELECTION_CHANGE_COMMAND,
} from 'lexical';
import DropDown, { DropDownItem } from '../../../ui/DropDown';
import {

  $isCodeNode,
  CODE_LANGUAGE_FRIENDLY_NAME_MAP,

  getLanguageFriendlyName,
} from '@lexical/code';
import {
  mergeRegister,
} from '@lexical/utils';
import {
  InsertImageDialog,
} from "../ImagesPlugin";

import {

  $patchStyleText,

} from '@lexical/selection';

import { INSERT_HORIZONTAL_RULE_COMMAND } from '@lexical/react/LexicalHorizontalRuleNode';
import { useCallback, useEffect, useRef, useState, Dispatch } from "react";
import { TOGGLE_LINK_COMMAND } from "@lexical/link";

/* Utils */
import { sanitizeUrl } from "@/app/utils/url";

/* Icons */
import FontSizeStepper from "../../font-size-stepper/FontSizeStepper";
import FontPicker from "../../font-picker/FontPicker";
import DropdownColorPicker from "../../../ui/DropdownColorPicker";

import InsertLayoutDialog from "../LayoutPlugin/InsertLayoutDialog";
import UndoRedoButtonGroup from "../../endo-redo";
import useToolbar from "./useToolbar";
import BlockFormatDropDown from "../../block-format-dropdown";
import TextFormatter from "../../text-fomatter";
import Divider from "../../divider";
import TextAlignmentDropdown from "../../text-alignment-dropdown";
const LowPriority = 1;

export function dropDownActiveClass(active: boolean) {
  if (active) {
    return 'active dropdown-item-active';
  } else {
    return '';
  }
}

export default function ToolbarPlugin({
  setIsLinkEditMode,
  setIsPreviewMode,
}: {
  setIsLinkEditMode: Dispatch<boolean>,
  setIsPreviewMode: Dispatch<boolean>,
}) {


  const [editor] = useLexicalComposerContext();

  const {  
    activeEditor,
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
 
    blockTypeToBlockName,

    setCanUndo,
    setCanRedo,
    setActiveEditor,

    $updateToolbar,
  } = useToolbar(editor)

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

  return (
    <div className="toolbar max-w-[1095px] mx-auto flex-1 shadow-md flex justify-between items-start overflow-hidden" ref={toolbarRef}>
      <div className="flex flex-wrap  gap-1">
        <div className="flex gap-1">

          <UndoRedoButtonGroup editor={editor} />
          <Divider />
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
              <TextFormatter editor={editor} setIsLinkEditMode={setIsLinkEditMode}/>
              <Divider />
            </>
          }

          <TextAlignmentDropdown
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

        <div className="flex gap-1">
          <button
            onClick={() => {
              activeEditor.dispatchCommand(
                INSERT_HORIZONTAL_RULE_COMMAND,
                undefined,
              );
            }}
            className=" toolbar-item">
            <i className="icon !mr-0 horizontal-rule" />
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
              </DropDown>
            </>
          )}

          <Divider />
          <button
            onClick={() => {
              showModal('Insert Columns Layout', (onClose) => (
                <InsertLayoutDialog
                  activeEditor={activeEditor}
                  onClose={onClose}
                />
              ));
            }}
            className="item toolbar-item">
            <i className="icon columns" />
            <span className="text ">Columns Layout</span>
          </button>

        </div>
      </div>
      {modal}
    </div>
  );
}