'use client'
import React, { useState } from 'react'

const MarkdownContent: React.FC<{ content: any, isJapanese: boolean }> = ({ content, isJapanese }) => {
    const [showFurigana, setShowFurigana] = useState<boolean>(true);

    const toggleFurigana = () => {
        setShowFurigana((prev) => !prev);
    };
    return (
        <>
            <article className={`mdx-wrapper ${!showFurigana && 'show-f'}`} style={{ fontFamily: 'MiSans,Inter' }}>
                {content}
            </article>
            {
                isJapanese &&
                <button onClick={toggleFurigana} className={`fixed border bg-white shadow rounded-md right-5 bottom-10 px-2 ${!showFurigana && 'line-through'}`}>
                    Furigana
                </button>
            }

        </>
    )
}

export default MarkdownContent