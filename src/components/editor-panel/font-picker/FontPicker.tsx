import {useCallback} from 'react';

import DropDown, {DropDownItem} from '../../ui/DropDown';

import {$patchStyleText} from '@lexical/selection';

import {$getSelection, LexicalEditor} from 'lexical';
import {dropDownActiveClass} from '../plugins/ToolbarPlugin/ToolbarPlugin';

enum LanguageOptions {
  ENG = 'icon-english',
  MM = 'icon-myanmar',
  JP = 'icon-japanese',
}

enum BlockTypeOptions {
  DISPLAY,
  PARA,
  WRITING,
}

const FONT_FAMILY_OPTIONS: {
  info: [string, string];
  lang?: LanguageOptions;
  type?: BlockTypeOptions;
}[] = [
  {info: ['Arial', 'Arial']},
  {info: [`Yati`, 'Yati'], lang: LanguageOptions.MM},
  {info: ['Courier New', 'Courier New']},
  {info: ['Times New Roman', 'Times New Roman']},
  {info: [`Roboto`, 'Roboto']},
  {info: [`Indie Flower`, 'Indie Flower']},
];

const FONT_SIZE_OPTIONS: [string, string][] = [
  ['10px', '10px'],
  ['11px', '11px'],
  ['12px', '12px'],
  ['13px', '13px'],
  ['14px', '14px'],
  ['15px', '15px'],
  ['16px', '16px'],
  ['17px', '17px'],
  ['18px', '18px'],
  ['19px', '19px'],
  ['20px', '20px'],
];

export default function FontPicker({
  editor,
  value,
  style,
  disabled = false,
}: {
  editor: LexicalEditor;
  value: string;
  style: string;
  disabled?: boolean;
}): JSX.Element {
  const handleClick = useCallback(
    (option: string) => {
      editor.update(() => {
        const selection = $getSelection();
        if (selection !== null) {
          $patchStyleText(selection, {
            [style]: option,
          });
        }
      });
    },
    [editor, style],
  );

  const buttonAriaLabel =
    style === 'font-family'
      ? 'Formatting options for font family'
      : 'Formatting options for font size';

  return (
    <DropDown
      disabled={disabled}
      buttonClassName={'toolbar-item ' + style}
      buttonLabel={value}
      buttonIconClassName={style === 'font-family' ? 'icon font-family' : ''}
      buttonAriaLabel={buttonAriaLabel}>
      {FONT_FAMILY_OPTIONS.map((option) => (
        <DropDownItem
          className={`item ${dropDownActiveClass(value === option.info[0])} ${
            style === 'font-size' ? 'fontsize-item' : ''
          }`}
          onClick={() => handleClick(option.info[0])}
          key={option.info[0]}>
          <span className="text flex gap-3">
            <span>{option.info[1]}</span>{' '}
            <span>
              {' '}
              {option.lang && <span className={`icon ${option.lang} rounded-md opacity-70`}></span>}
              {option.type && <span> ({option.type})</span>}
            </span>{' '}
          </span>
        </DropDownItem>
      ))}
    </DropDown>
  );
}
