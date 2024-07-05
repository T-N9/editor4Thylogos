import React from 'react'

import useToolbar from '../plugins/ToolbarPlugin/useToolbar';
import { LexicalEditor } from 'lexical';

interface UndoRedoButtonGroupProps {
    editor: LexicalEditor
}

const UndoRedoButtonGroup: React.FC<UndoRedoButtonGroupProps> = ({ editor }) => {

    const {
        canUndo,
        canRedo,

        UNDO_COMMAND,
        REDO_COMMAND,

    } = useToolbar(editor);

    return (
        <div className="flex justify-center gap-1">
            <button
                disabled={!canUndo}
                onClick={() => {
                    editor.dispatchCommand(UNDO_COMMAND, undefined);
                }}
                className="toolbar-item spaced"
                aria-label="Undo"
            >
                <i className="format undo" />
            </button>
            <button
                disabled={!canRedo}
                onClick={() => {
                    editor.dispatchCommand(REDO_COMMAND, undefined);
                }}
                className="toolbar-item"
                aria-label="Redo"
            >
                <i className="format redo" />
            </button>
        </div>
    )
}

export default UndoRedoButtonGroup