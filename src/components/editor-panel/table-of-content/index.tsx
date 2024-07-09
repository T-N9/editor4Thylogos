import { useEditorState } from '@/context/EditorStateContext'
import React from 'react'
import TableOfContentsPlugin from '../plugins/TableOfContentPlugin'

const TableOfContent = () => {

    return (
        <>
            <TableOfContentsPlugin />
        </>
    )
}

export default TableOfContent