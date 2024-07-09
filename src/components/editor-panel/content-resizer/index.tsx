'use client'
import DropDown, { DropDownItem } from '@/components/ui/DropDown'
import React, { useEffect, useState } from 'react';
import { useLocalStorage } from 'react-use'
import { LocalEditorState } from '../text-editor/TextEditor'
import { initialData, useEditorState } from '@/context/EditorStateContext'

export const contentSizers = [{ size: '845', text: 'Small' }, { size: '1095', text: 'Medium' }, { size: '1440', text: 'Large' }]

const ContentResizer = () => {
    const [currentSize, setCurrentSize] = useState<number>(0)
    const [localizedEditorState, setLocalizedEditorState] = useLocalStorage<
        LocalEditorState | null
    >('my-editor-state-key', null);
    const { setEditorState } = useEditorState()

    useEffect(() => {
        setCurrentSize(localizedEditorState?.contentSize ?? 0)
    }, [localizedEditorState?.contentSize])

    return (
        <>
            {/* {
                localizedEditorState && */}

            <DropDown
                disabled={false}
                buttonClassName="toolbar-item block-controls"
                buttonIconClassName={'icon icon-cube'}
                buttonLabel={contentSizers[currentSize].text}
                buttonAriaLabel="Select Content Width">
                {
                    contentSizers.map((size, index) => (
                        <DropDownItem
                            key={index}
                            onClick={() => {
                                setLocalizedEditorState((prevState) => ({
                                    editorState: prevState?.editorState ?? initialData,
                                    contentSize: index,
                                }));
                                setEditorState({
                                    editorState: localizedEditorState?.editorState ?? initialData,
                                    contentSize: index,
                                })
                            }}
                            className={'item'}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#545454" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m21 7.5-2.25-1.313M21 7.5v2.25m0-2.25-2.25 1.313M3 7.5l2.25-1.313M3 7.5l2.25 1.313M3 7.5v2.25m9 3 2.25-1.313M12 12.75l-2.25-1.313M12 12.75V15m0 6.75 2.25-1.313M12 21.75V19.5m0 2.25-2.25-1.313m0-16.875L12 2.25l2.25 1.313M21 14.25v2.25l-2.25 1.313m-13.5 0L3 16.5v-2.25" />
                            </svg>

                            {size.text}
                        </DropDownItem>
                    ))
                }
            </DropDown>
            {/* } */}
        </>

    )
}

export default ContentResizer