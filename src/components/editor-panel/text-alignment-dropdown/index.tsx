import { ElementFormatType, FORMAT_ELEMENT_COMMAND, INDENT_CONTENT_COMMAND, LexicalEditor, OUTDENT_CONTENT_COMMAND } from 'lexical';
import React from 'react'
import DropDown, { DropDownItem } from '../../ui/DropDown';
import { ELEMENT_FORMAT_OPTIONS } from '../plugins/ToolbarPlugin/useToolbar';
import Divider from '../divider';

export default function TextAlignmentDropdown({
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