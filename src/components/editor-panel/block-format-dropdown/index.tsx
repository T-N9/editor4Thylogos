import {
  LexicalEditor,
} from 'lexical';
import useToolbar, {
  blockTypeToBlockName,
  rootTypeToRootName,
} from '../plugins/ToolbarPlugin/useToolbar';

import DropDown, {DropDownItem} from '../../ui/DropDown';
import {dropDownActiveClass} from '../plugins/ToolbarPlugin/ToolbarPlugin';

export default function BlockFormatDropDown({
  editor,
  blockType,
  rootType,
  disabled = false,
  isOnlyIcon = false,
}: {
  blockType: keyof typeof blockTypeToBlockName;
  rootType: keyof typeof rootTypeToRootName;
  editor: LexicalEditor;
  disabled?: boolean;
  isOnlyIcon?: boolean;
}): JSX.Element {
  const {
    formatBulletList,
    formatCheckList,
    formatParagraph,
    formatCode,
    formatHeading,
    formatNumberedList,
    formatQuote,
  } = useToolbar(editor);

  return (
    <DropDown
      disabled={disabled}
      buttonClassName="toolbar-item block-controls"
      buttonIconClassName={'icon block-type ' + blockType}
      buttonLabel={blockTypeToBlockName[blockType]}
      buttonAriaLabel="Formatting options for text style"
      isOnlyIcon={isOnlyIcon}>
      <DropDownItem
        className={'item ' + dropDownActiveClass(blockType === 'paragraph')}
        onClick={formatParagraph}>
        <i className="icon paragraph" />
        <span className="text">Paragraph</span>
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
        className={'item ' + dropDownActiveClass(blockType === 'h4')}
        onClick={() => formatHeading('h4')}>
        <i className="icon h4" />
        <span className="text">Heading 4</span>
      </DropDownItem>

      <DropDownItem
        className={'item ' + dropDownActiveClass(blockType === 'h5')}
        onClick={() => formatHeading('h5')}>
        <i className="icon h5" />
        <span className="text">Heading 5</span>
      </DropDownItem>

      <DropDownItem
        className={'item ' + dropDownActiveClass(blockType === 'h6')}
        onClick={() => formatHeading('h6')}>
        <i className="icon h6" />
        <span className="text">Heading 6</span>
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
