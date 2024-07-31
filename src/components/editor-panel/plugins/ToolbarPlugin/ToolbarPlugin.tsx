'use client';
/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import {
  $isCodeNode,
  CODE_LANGUAGE_FRIENDLY_NAME_MAP,
  getLanguageFriendlyName,
} from '@lexical/code';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { mergeRegister } from '@lexical/utils';
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
import { InsertImageDialog } from '../ImagesPlugin';
import { EmbedConfigs } from '../AutoEmbedPlugin';
import { $patchStyleText } from '@lexical/selection';

import { TOGGLE_LINK_COMMAND } from '@lexical/link';
import { INSERT_HORIZONTAL_RULE_COMMAND } from '@lexical/react/LexicalHorizontalRuleNode';
import { Dispatch, useCallback, useEffect } from 'react';

/* Utils */
import { sanitizeUrl } from '@/utils/url';

import { useToolbarContext } from '@/context/ToolbarStateContext';
import BlockFormatDropDown from '../../block-format-dropdown';
import ContentResizer from '../../content-resizer';
import UndoRedoButtonGroup from '../../endo-redo';
import TextAlignmentDropdown from '../../text-alignment-dropdown';
import InsertLayoutDialog from '../LayoutPlugin/InsertLayoutDialog';
import useToolbar from './useToolbar';
import { INSERT_COLLAPSIBLE_COMMAND } from '../CollapsiblePlugin';
import { INSERT_EMBED_COMMAND } from '@lexical/react/LexicalAutoEmbedPlugin';
import { InsertTableDialog } from '../TablePlugin';
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
  setIsLinkEditMode: Dispatch<boolean>;
  setIsPreviewMode: Dispatch<boolean>;
}) {
  const [editor] = useLexicalComposerContext();

  const { canViewerSeeInsertDropdown, blockTypeToBlockName, $updateToolbar } =
    useToolbar(editor);

  const {
    activeEditor,
    setActiveEditor,
    blockType,
    rootType,
    selectedElementKey,
    toolbarRef,
    setCanUndo,
    setCanRedo,
    isLink,
    isEditable,
    codeLanguage,
    elementFormat,
    isRTL,
    modal,
    showModal,
  } = useToolbarContext();

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
  }, [editor, $updateToolbar, setActiveEditor]);

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
    <div
      className="toolbar mx-auto flex max-w-[825px] flex-1 items-start justify-between overflow-hidden shadow-md"
      ref={toolbarRef}>
      <div className="flex flex-wrap gap-3">
        <UndoRedoButtonGroup editor={editor} />
        {blockType in blockTypeToBlockName && activeEditor === editor && (
          <>
            <BlockFormatDropDown
              disabled={!isEditable}
              blockType={blockType}
              rootType={rootType}
              editor={activeEditor}
              isOnlyIcon={true}
            />
          </>
        )}

        {blockType === 'code' && (
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
        )}

        <TextAlignmentDropdown
          disabled={!isEditable}
          value={elementFormat}
          editor={activeEditor}
          isRTL={isRTL}
          isOnlyIcon={true}
        />

        {blockType !== 'code' && (
          <button
            type="button"
            onClick={() => {
              activeEditor.dispatchCommand(
                INSERT_HORIZONTAL_RULE_COMMAND,
                undefined,
              );
            }}
            className="toolbar-item">
            <i className="icon horizontal-rule !mr-0" />
          </button>
        )}

        {canViewerSeeInsertDropdown && blockType !== 'code' && (
          <>
            <DropDown
              disabled={!isEditable}
              buttonClassName="toolbar-item spaced"
              buttonLabel="Insert"
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

              <DropDownItem
                onClick={() => {
                  editor.dispatchCommand(
                    INSERT_COLLAPSIBLE_COMMAND,
                    undefined,
                  );
                }}
                className="item">
                <i className="icon caret-right" />
                <span className="text">Collapsible container</span>
              </DropDownItem>
              {EmbedConfigs.map((embedConfig) => (
                <DropDownItem
                  key={embedConfig.type}
                  onClick={() => {
                    activeEditor.dispatchCommand(
                      INSERT_EMBED_COMMAND,
                      embedConfig.type,
                    );
                  }}
                  className="item">
                  {embedConfig.icon}
                  <span className="text">{embedConfig.contentName}</span>
                </DropDownItem>
              ))}
              <DropDownItem
                onClick={() => {
                  showModal('Insert Table', (onClose) => (
                    <InsertTableDialog
                      activeEditor={activeEditor}
                      onClose={onClose}
                    />
                  ));
                }}
                className="item">
                <i className="icon table" />
                <span className="text">Table</span>
              </DropDownItem>
            </DropDown>
          </>
        )}


        {blockType !== 'code' && (
          <button
            type="button"
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
            <span className="text">Columns Layout</span>
          </button>
        )}

        <ContentResizer />
      </div>
      {modal}
    </div>
  );
}
