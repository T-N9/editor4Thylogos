import {FORMAT_TEXT_COMMAND, LexicalEditor} from 'lexical';
import React, {Dispatch, useCallback} from 'react';
import useToolbar from '../plugins/ToolbarPlugin/useToolbar';
import {dropDownActiveClass} from '../plugins/ToolbarPlugin/ToolbarPlugin';
import {sanitizeUrl} from '@/app/utils/url';

import {TOGGLE_LINK_COMMAND} from '@lexical/link';

interface TextFormatterProps {
  editor: LexicalEditor;
  setIsLinkEditMode: Dispatch<boolean>;
}
const TextFormatter: React.FC<TextFormatterProps> = ({
  editor,
  setIsLinkEditMode,
}) => {
  const {
    activeEditor,
    isEditable,
    isCode,
    isLink,
    isBold,
    isItalic,
    isSuperscript,
    isStrikethrough,
    isSubscript,
    isUnderline,
    canViewerSeeInsertCodeButton,
    clearFormatting,
  } = useToolbar(editor);

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

  return (
    <>
      <div className="flex justify-start gap-1">
        <button
          onClick={() => {
            editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold');
          }}
          className={'toolbar-item spaced ' + (isBold ? 'active' : '')}
          aria-label="Format Bold">
          <i className="format bold" />
        </button>
        <button
          onClick={() => {
            editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic');
          }}
          className={'toolbar-item spaced ' + (isItalic ? 'active' : '')}
          aria-label="Format Italics">
          <i className="format italic" />
        </button>
        <button
          onClick={() => {
            editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline');
          }}
          className={'toolbar-item spaced ' + (isUnderline ? 'active' : '')}
          aria-label="Format Underline">
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
          type="button">
          <i className="format link" />
        </button>
        <button
          onClick={() => {
            activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough');
          }}
          className={
            'toolbar-item spaced' + dropDownActiveClass(isStrikethrough)
          }
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
            activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'superscript');
          }}
          className={
            'toolbar-item spaced ' + dropDownActiveClass(isSuperscript)
          }
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
    </>
  );
};

export default TextFormatter;
