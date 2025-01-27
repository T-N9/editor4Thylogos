/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import type { TableOfContentsEntry } from '@lexical/react/LexicalTableOfContentsPlugin';
import type { HeadingTagType } from '@lexical/rich-text';
import type { NodeKey } from 'lexical';
import './index.css'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { TableOfContentsPlugin as LexicalTableOfContentsPlugin } from '@lexical/react/LexicalTableOfContentsPlugin';
import { useEffect, useRef, useState } from 'react';
import * as React from 'react';
import { useEditorState } from '@/context/EditorStateContext';

const MARGIN_ABOVE_EDITOR = 624;
const HEADING_WIDTH = 9;

function indent(tagName: HeadingTagType) {
    if (tagName === 'h2') {
        return 'heading2';
    } else if (tagName === 'h3') {
        return 'heading3';
    }
}

function isHeadingAtTheTopOfThePage(element: HTMLElement): boolean {
    const elementYPosition = element?.getClientRects()[0]?.y;
    return (
        elementYPosition >= MARGIN_ABOVE_EDITOR &&
        elementYPosition <= MARGIN_ABOVE_EDITOR + HEADING_WIDTH
    );
}
function isHeadingAboveViewport(element: HTMLElement): boolean {
    const elementYPosition = element?.getClientRects()[0]?.y;
    return elementYPosition < MARGIN_ABOVE_EDITOR;
}
function isHeadingBelowTheTopOfThePage(element: HTMLElement): boolean {
    const elementYPosition = element?.getClientRects()[0]?.y;
    return elementYPosition >= MARGIN_ABOVE_EDITOR + HEADING_WIDTH;
}

function TableOfContentsList({
    tableOfContents,
}: {
    tableOfContents: Array<TableOfContentsEntry>;
}): JSX.Element {
    const [selectedKey, setSelectedKey] = useState('');
    const selectedIndex = useRef(0);
    const [editor] = useLexicalComposerContext();

    function scrollToNode(key: NodeKey, currIndex: number) {
        editor.getEditorState().read(() => {
            const domElement = editor.getElementByKey(key);
            if (domElement !== null) {
                domElement.scrollIntoView();
                setSelectedKey(key);
                selectedIndex.current = currIndex;
            }
        });
    }

    useEffect(() => {
        function scrollCallback() {
            if (
                tableOfContents.length !== 0 &&
                selectedIndex.current < tableOfContents.length - 1
            ) {
                let currentHeading = editor.getElementByKey(
                    tableOfContents[selectedIndex.current][0],
                );
                if (currentHeading !== null) {
                    if (isHeadingBelowTheTopOfThePage(currentHeading)) {
                        //On natural scroll, user is scrolling up
                        while (
                            currentHeading !== null &&
                            isHeadingBelowTheTopOfThePage(currentHeading) &&
                            selectedIndex.current > 0
                        ) {
                            const prevHeading = editor.getElementByKey(
                                tableOfContents[selectedIndex.current - 1][0],
                            );
                            if (
                                prevHeading !== null &&
                                (isHeadingAboveViewport(prevHeading) ||
                                    isHeadingBelowTheTopOfThePage(prevHeading))
                            ) {
                                selectedIndex.current--;
                            }
                            currentHeading = prevHeading;
                        }
                        const prevHeadingKey = tableOfContents[selectedIndex.current][0];
                        setSelectedKey(prevHeadingKey);
                    } else if (isHeadingAboveViewport(currentHeading)) {
                        //On natural scroll, user is scrolling down
                        while (
                            currentHeading !== null &&
                            isHeadingAboveViewport(currentHeading) &&
                            selectedIndex.current < tableOfContents.length - 1
                        ) {
                            const nextHeading = editor.getElementByKey(
                                tableOfContents[selectedIndex.current + 1][0],
                            );
                            if (
                                nextHeading !== null &&
                                (isHeadingAtTheTopOfThePage(nextHeading) ||
                                    isHeadingAboveViewport(nextHeading))
                            ) {
                                selectedIndex.current++;
                            }
                            currentHeading = nextHeading;
                        }
                        const nextHeadingKey = tableOfContents[selectedIndex.current][0];
                        setSelectedKey(nextHeadingKey);
                    }
                }
            } else {
                selectedIndex.current = 0;
            }
        }
        let timerId: ReturnType<typeof setTimeout>;

        function debounceFunction(func: () => void, delay: number) {
            clearTimeout(timerId);
            timerId = setTimeout(func, delay);
        }

        function onScroll(): void {
            debounceFunction(scrollCallback, 10);
        }

        document.addEventListener('scroll', onScroll);
        return () => document.removeEventListener('scroll', onScroll);
    }, [tableOfContents, editor]);

    const { isContentShown, setIsContentShown } = useEditorState()

    return (
        <>
            {tableOfContents.length > 0 &&
                <aside className={`${!isContentShown ? 'transform translate-x-60' : 'translate-x-0'} fixed right-0 transform  top-1/2 -translate-y-1/2 flex z-50 items-start duration-300`}>
                    <button type='button' className='inline-block py-2 px-2 rounded-md rounded-tr-none rounded-br-none bg-gray-100 shadow' onClick={() => setIsContentShown(!isContentShown)}>
                        {
                            !isContentShown ?
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="var(--primary-600)" className="size-4 text-primary-600">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m18.75 4.5-7.5 7.5 7.5 7.5m-6-15L5.25 12l7.5 7.5" />
                                </svg>

                                :
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="var(--primary-600)" className="size-4 text-primary-600">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m5.25 4.5 7.5 7.5-7.5 7.5m6-15 7.5 7.5-7.5 7.5" />
                                </svg>
                        }
                    </button>
                    <div className="table-of-contents shadow border-r-4 border-primary-600">
                        <h1 className='font-bold text-primary-300'>In this article</h1>
                        <ul className="headings flex flex-col gap-2">
                            {tableOfContents.map(([key, text, tag], index) => {
                                return (
                                    <div
                                        className={`normal-heading-wrapper ${selectedKey === key ? 'selected-heading-wrapper' : ''
                                            }`}
                                        key={key}>
                                        <div
                                            onClick={() => scrollToNode(key, index)}
                                            role="button"
                                            className={indent(tag)}
                                            tabIndex={0}>
                                            <li
                                                className={`normal-heading hover:!text-primary-800 ${selectedKey === key ? 'selected-heading' : ''
                                                    }
                                    `}>
                                                {('' + text).length > 27
                                                    ? text.substring(0, 27) + '...'
                                                    : text}
                                            </li>
                                        </div>
                                    </div>
                                );
                            })
                            }
                        </ul>
                    </div>
                </aside>

            }

        </>

    );
}

export default function TableOfContentsPlugin() {
    return (
        <LexicalTableOfContentsPlugin>
            {(tableOfContents) => {
                return <TableOfContentsList tableOfContents={tableOfContents} />;
            }}
        </LexicalTableOfContentsPlugin>
    );
}
