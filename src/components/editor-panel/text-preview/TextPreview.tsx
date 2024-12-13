'use client';

import React, { useEffect } from 'react';

/* Lexical core and plugins */
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import CodeHighlightPlugin from '../plugins/CodeHighlightPlugin';
import { scrollToTop } from '@/utils/scrollToTop';

import TableOfContent from '../table-of-content';
import { contentSizeClass, LocalEditorState } from '../text-editor/TextEditor';
import { addUniqueIdsToHeadings } from '@/components/preview-post';
import { useEditorState } from '@/context/EditorStateContext';

interface TextPreviewProps {
  editorState: LocalEditorState;
  isBlogMode?: boolean;
  htmlData: string;
}

const TextPreview: React.FC<TextPreviewProps> = ({
  editorState,
  htmlData,
  isBlogMode,
}) => {

  const headingData = addUniqueIdsToHeadings(htmlData);
  const { isContentShown, setIsContentShown } = useEditorState()

  useEffect(() => {
    scrollToTop();
  }, []);

  return (
    <article className="inline-block w-full previewing">
      <section className="">
        <div
          className={`editor-container mx-auto ${contentSizeClass[editorState.contentSize]}`}>
          {headingData.headings.length > 0 && <div className='bg-gray-100 rounded-lg max-w-[500px] mx-auto dark:bg-gray-800 p-5 mt-10'>
            <h1 className='font-bold text-primary-600 opacity-50'>In this article</h1>
            <ul className=" flex flex-col gap-2">
              {headingData.headings.map((item, index) => {
                const Tag = item.tag as keyof JSX.IntrinsicElements; // Dynamic tag rendering

                return (
                  <li className={``}
                    key={index}>
                    <a href={`#${item.link}`}>
                      <Tag>{item.content}</Tag>
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>}
          {/* <RichTextPlugin
            contentEditable={
              <div className="editor-scroller !hidden">
                <div className="editor filtered-content">
                  <ContentEditable readOnly className="contentEditable" />
                </div>
              </div>
            }
            placeholder={null}
            ErrorBoundary={LexicalErrorBoundary}
          /> 
          <CodeHighlightPlugin /> */}
          {/* <TableOfContent /> */}

          {
            headingData.headings.length > 0 &&
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
                  {headingData.headings.map((item, index) => {
                    const Tag = item.tag as keyof JSX.IntrinsicElements; // Dynamic tag rendering

                    return (
                      <li className={`normal-heading-wrapper line-clamp-1`}
                        key={index}>
                        <a href={`#${item.link}`}>
                          <Tag>{item.content}</Tag>
                        </a>
                      </li>
                    );
                  })}
                </ul>

              </div>
            </aside>
          }

          <div className="editor-scroller">
            <div className="editor filtered-content">
              <div dangerouslySetInnerHTML={{ __html: htmlData }} className='contentEditable' aria-readonly>

              </div>
            </div>
          </div>
        </div>

      </section>
    </article>
  );
};

export default TextPreview;
