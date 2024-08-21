'use client'
import DropDown, { DropDownItem } from '@/components/ui/DropDown'
import React, { useEffect, useState } from 'react';
import { useLocalStorage } from 'react-use'
import { LocalEditorState } from '../text-editor/TextEditor'
import { initialData, useEditorState } from '@/context/EditorStateContext'
import useLocalData from '../useLocalData';

export const contentSizers = [
    { size: '625', text: 'X-small', icon: 'icon icon-cube-sm' },
    { size: '845', text: 'Small', icon: 'icon icon-cube-sm' },
    { size: '1095', text: 'Medium', icon: 'icon icon-cube-md' },
    { size: '1440', text: 'Large', icon: 'icon icon-cube-lg' }
]

const ContentResizer = () => {
    const [currentSize, setCurrentSize] = useState<number>(0)
    // const [localizedEditorState, setLocalizedEditorState] = useLocalStorage<
    //     LocalEditorState | null
    // >('my-editor-state-key', null);

    const { localizedEditorState, setLocalizedEditorState, isUpdateRoute } = useLocalData();
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
                buttonIconClassName={contentSizers[currentSize].icon}
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
                            <span className={size.icon}></span>

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