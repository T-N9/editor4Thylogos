import { useEditorState } from '@/context/EditorStateContext'
import React from 'react'
import TableOfContentsPlugin from '../plugins/TableOfContentPlugin'

const TableOfContent = () => {

    const { isContentShown, setIsContentShown } = useEditorState()

    return (
        <aside className={`${isContentShown ? 'transform translate-x-60' : 'translate-x-0'} fixed right-0 transform  top-1/2 -translate-y-1/2 flex z-50 items-start duration-300`}>
            <button className='inline-block p-1 rounded-md bg-gray-200 shadow' onClick={() => setIsContentShown(!isContentShown)}>
                {
                    isContentShown ?
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#545454" className="size-6 text-gray-500">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m18.75 4.5-7.5 7.5 7.5 7.5m-6-15L5.25 12l7.5 7.5" />
                        </svg>

                        :
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#545454" className="size-6 text-gray-500">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m5.25 4.5 7.5 7.5-7.5 7.5m6-15 7.5 7.5-7.5 7.5" />
                        </svg>
                }
            </button>
            <TableOfContentsPlugin />
        </aside>
    )
}

export default TableOfContent