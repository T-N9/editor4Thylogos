import { useCallback } from 'react';

import DropDown, { DropDownItem } from '../../ui/DropDown';

import {
    $patchStyleText,
} from '@lexical/selection';

import {
    $getSelection,

    LexicalEditor,
} from 'lexical';
import { dropDownActiveClass } from '../plugins/ToolbarPlugin';

const FONT_FAMILY_OPTIONS: [string, string][] = [
    ['Arial', 'Arial'],
    ['Courier New', 'Courier New'],
    ['Georgia', 'Georgia'],
    ['Times New Roman', 'Times New Roman'],
    ['Trebuchet MS', 'Trebuchet MS'],
    ['Verdana', 'Verdana'],
    [`Roboto`, 'Roboto'],
    [`Indie Flower`, 'Indie Flower']
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
            buttonIconClassName={
                style === 'font-family' ? 'icon block-type font-family' : ''
            }
            buttonAriaLabel={buttonAriaLabel}>
            {(style === 'font-family' ? FONT_FAMILY_OPTIONS : FONT_SIZE_OPTIONS).map(
                ([option, text]) => (
                    <DropDownItem
                        className={`item ${dropDownActiveClass(value === option)} ${style === 'font-size' ? 'fontsize-item' : ''
                            }`}
                        onClick={() => handleClick(option)}
                        key={option}>
                        <span className="text">{text}</span>
                    </DropDownItem>
                ),
            )}
        </DropDown>
    );
}