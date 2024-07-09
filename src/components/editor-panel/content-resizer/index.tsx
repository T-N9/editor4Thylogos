'use client'
import DropDown, { DropDownItem } from '@/components/ui/DropDown'
import React, { useEffect, useState } from 'react';
import { useLocalStorage } from 'react-use'
import { LocalEditorState } from '../text-editor/TextEditor'
import { initialData, useEditorState } from '@/context/EditorStateContext'

export const contentSizers = ['845', '1095', '1440']

const ContentResizer = () => {
    const [currentSize, setCurrentSize] = useState<number>(0)
    const [localizedEditorState, setLocalizedEditorState] = useLocalStorage<
        LocalEditorState | null
    >('my-editor-state-key', null);
    const { setEditorState } = useEditorState()

    useEffect(() => {
        setCurrentSize(localizedEditorState?.contentSize ?? 0)
    },[localizedEditorState?.contentSize])

    return (
        <>
            {/* {
                localizedEditorState && */}

            <DropDown
                disabled={false}
                buttonClassName="toolbar-item block-controls"
                buttonIconClassName={''}
                buttonLabel={'W '+ contentSizers[currentSize]}
                buttonAriaLabel="Width options for content container">
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
                            W{" "}
                            {size}
                        </DropDownItem>
                    ))
                }
            </DropDown>
            {/* } */}
        </>

    )
}

export default ContentResizer