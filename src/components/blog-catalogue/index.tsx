'use client';
import React from 'react';
import useBlogCatalogue from './useBlogCatalogue';
import Link from 'next/link';
import {Button} from '@nextui-org/react';

const BlogCatalogue = () => {
  const {pathname, fetchedBlogData} = useBlogCatalogue();

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      {fetchedBlogData?.map((blog, index) => (
        <div key={index} className="relative rounded-md border p-3">
          {pathname.includes('/manage') && (
            <>
              <Button
                href={`/blog/${blog.slug}`}
                as={Link}
                type="button"
                isIconOnly
                size="sm"
                className="absolute right-12 top-2 bg-orange-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="#fff"
                  className="size-4">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                  />
                </svg>
              </Button>

              <Button
                href={`/manage/update/${blog.slug}`}
                as={Link}
                type="button"
                isIconOnly
                size="sm"
                className="absolute right-2 top-2 bg-blue-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="#fff"
                  className="size-4">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                  />
                </svg>
              </Button>
            </>
          )}
          {pathname.includes('/manage') ? (
            <div key={index}>
              <h1 className="text-4xl">{blog.title}</h1>
              <p className="my-5 line-clamp-3">{blog.summary}...</p>

              <div>
                {blog.tags.map((tag, index) => {
                  return (
                    <span
                      className="rounded-full bg-gray-100 px-2 py-1"
                      key={index}
                      style={{marginRight: '5px'}}>
                      {tag}
                    </span>
                  );
                })}
              </div>
            </div>
          ) : (
            <Link href={`/blog/${blog.slug}`}>
              <div key={index}>
                <h1 className="text-4xl">{blog.title}</h1>
                <p className="my-5 line-clamp-3">{blog.summary}...</p>

                <div>
                  {blog.tags.map((tag, index) => {
                    return (
                      <span
                        className="rounded-full bg-gray-100 px-2 py-1"
                        key={index}
                        style={{marginRight: '5px'}}>
                        {tag}
                      </span>
                    );
                  })}
                </div>
              </div>
            </Link>
          )}
        </div>
      ))}
    </div>
  );
};

export default BlogCatalogue;
