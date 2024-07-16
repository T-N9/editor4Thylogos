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
  DISPLAY = 'icon-display',
  PARA = 'icon-para',
  WRITING ='icon-writing',
}

const FONT_FAMILY_OPTIONS: {
  info: [string, string];
  lang?: LanguageOptions;
  type?: BlockTypeOptions;
}[] = [
  {info: ['Arial', 'Arial']},
  {info: [`Yati`, 'Yati'], lang: LanguageOptions.MM},
  {info: [`MiSans, Roboto`, 'MiSans'], lang: LanguageOptions.MM},
  {info: [`Walone`, 'Walone'], lang: LanguageOptions.MM},
  {info: [`Strong`, 'Strong'], lang: LanguageOptions.MM, type: BlockTypeOptions.DISPLAY},
  {info: [`Spring Rev`, 'Spring Rev'], lang: LanguageOptions.MM, type: BlockTypeOptions.DISPLAY},
  {info: [`U Moe`, 'U Moe'], lang: LanguageOptions.MM, type: BlockTypeOptions.WRITING},
  {info: [`Modern`, 'Modern'], lang: LanguageOptions.MM, type: BlockTypeOptions.DISPLAY},
  {info: [`Burmese Handwriting`, 'Burmese Handwriting'], lang: LanguageOptions.MM, type: BlockTypeOptions.WRITING},
  {info: [`Typewriter`, 'Typewriter'], lang: LanguageOptions.MM, type: BlockTypeOptions.WRITING},
  {info: [`Press`, 'Press'], lang: LanguageOptions.MM, type: BlockTypeOptions.WRITING},
  {info: ['Courier New', 'Courier New']},
  {info: ['Aqrada', 'Aqrada'], type: BlockTypeOptions.DISPLAY},
  {info: ['Yellowtail', 'Yellowtail'], type: BlockTypeOptions.WRITING},
  {info: ['Times New Roman', 'Times New Roman']},
  {info: [`Roboto`, 'Roboto']},
  {info: [`Indie Flower`, 'Indie Flower'], type : BlockTypeOptions.WRITING},
  {info : ['Noto Sans JP', 'Noto Sans JP'] ,lang: LanguageOptions.JP},
  {info : ['Noto Serif JP', 'Noto Serif JP'] ,lang: LanguageOptions.JP , type : BlockTypeOptions.WRITING},
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
      {FONT_FAMILY_OPTIONS.map((option, index) => (
        <DropDownItem
          className={`item ${dropDownActiveClass(value === option.info[1])} ${
            style === 'font-size' ? 'fontsize-item' : ''
          }`}
          onClick={() => handleClick(option.info[0])}
          key={option.info[0]}>
          <span className="text flex gap-1">
            <span>{option.info[1]}</span>{' '}
            <span className='flex'>
              {' '}
              {option.lang && <span className={`icon ${option.lang} rounded-md opacity-70 !mr-0`}></span>}
              {option.type && <span className={`icon ${option.type} rounded-md opacity-70 !mr-0`}></span>}
            </span>{' '}
          </span>
        </DropDownItem>
      ))}
    </DropDown>
  );
}
