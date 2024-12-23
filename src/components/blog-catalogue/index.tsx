'use client';
import React, { useEffect } from 'react';
import useBlogCatalogue, { ThumbnailBlogItem } from './useBlogCatalogue';
import Link from 'next/link';
import { Button } from '@nextui-org/react';
import moment from 'moment';
import { fadeInOut, slideInOut } from '@/animation';
import { useTransitionRouter } from 'next-view-transitions';
import { useRouter } from 'next/navigation';

interface BlogCardProps {
  blog: any;
  pathname: string;
  isPinned?: boolean;
}

export const BlogCard: React.FC<BlogCardProps> = ({ blog, pathname, isPinned }) => {
  const isManageMode = pathname.includes('/manage');
  const router = useTransitionRouter()
  const nextRouter = useRouter()

  useEffect(() => {
    nextRouter.prefetch(`/notes/${blog.slug}`);
    // console.log('Prefetching' + `/notes/${blog.slug}`)
  }, [nextRouter, blog.slug]);

  return (
    <div className="note-card pb-5">
      {isManageMode && (
        <>
          <Button
            href={`/notes/${blog.slug}`}
            as={Link}
            type="button"
            isIconOnly
            size="sm"
            className="absolute right-16 top-3 bg-primary-600 hover:bg-primary-700 text-white rounded-full p-2 transition-colors duration-300">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5">
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
            className="absolute right-3 top-3 bg-primary-600 hover:bg-primary-700 text-white rounded-full p-2 transition-colors duration-300">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
              />
            </svg>
          </Button>
        </>
      )}

      {isManageMode ? (
        <div className='p-4'>
          <h1 className="text-2xl md:text-3xl font-semibold text-gray-800 dark:text-gray-100">
            {blog.title}
          </h1>
          <p className="my-4 text-gray-600 dark:text-gray-400 line-clamp-3">
            {blog.summary}...
          </p>

          <div className="flex justify-between items-center">
            <div className="flex flex-wrap">
              {blog.tags.map((tag: string, index: number) => (
                <span
                  key={index}
                  className="text-sm bg-gray-200 text-primary-600 rounded-full px-3 py-1 mr-2 mb-2">
                  {tag}
                </span>
              ))}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {moment(new Date(blog.createdAt.seconds * 1000)).format('D MMM YYYY, h:mm a')}
            </div>
          </div>
        </div>
      ) : (
        <Link prefetch className='inline-flex h-full w-full' href={`/notes/${blog.slug}`}>

          <div className="group flex flex-col justify-between w-full">
            {isPinned && <span className="text-3xl absolute -right-2 -top-0 z-20">📌</span>}
            <div
              style={{ fontFamily: 'MiSans, Inter' }}
              className="text-2xl w-full p-5 note-card-header  leading-10 group-hover:underline text-primary-700 decoration-primary-600  underline-offset-2 md:text-xl font-bold transition-all duration-300 dark:text-white">
              <h1 style={{ viewTransitionName: `title-${blog.slug}` }} className='line-clamp-2'>{blog.title}</h1>
            </div>
            <p style={{ fontFamily: 'Walone' }} className={`my-3 ${!isPinned && 'max-w-[350px] lg:max-w-[440px]'}  p-5 py-0 text-gray-700 dark:text-gray-300 line-clamp-3`}>
              {blog.summary}...
            </p>

            <div className="flex justify-between items-center mt-4 px-5">
              <div className="flex flex-wrap">
                {blog.tags.map((tag: string, index: number) => (
                  <span
                    key={index}
                    className="text-xs md:text-sm bg-primary-50 dark:bg-slate-700 text-primary-600 rounded-full px-2 py-1 mr-2 mb-2">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="text-xs md:text-sm text-gray-500 dark:text-gray-400">
                {moment(new Date(blog.createdAt.seconds * 1000)).format('D MMM YYYY')}
              </div>
            </div>
          </div>

        </Link>
      )}
    </div>
  );
};


const BlogCatalogue = ({pinnedData, blogData} : {pinnedData : ThumbnailBlogItem[], blogData : ThumbnailBlogItem[]}) => {
  const { pathname } = useBlogCatalogue();

  const isManageMode = pathname.includes('/manage');

  return (
    <div>
      {
        isManageMode &&
        <div className=" mb-4">
          <div className="lg:max-w-[800px] mx-auto">
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-1">
              {pinnedData?.map((blog, index) => (
                <BlogCard key={index} blog={blog} pathname={pathname} isPinned={true} />
              ))}
            </div>
          </div>
        </div>
      }

      <div className="lg:max-w-[1350px] mx-auto min-h-screen">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {isManageMode ? blogData?.map((blog, index) => (
            <BlogCard key={index} blog={blog} pathname={pathname} />
          )) :
            blogData.slice(2, blogData.length)?.map((blog, index) => (
              <BlogCard key={index} blog={blog} pathname={pathname} />
            ))}

        </div>
      </div>
    </div>
  );
};
export default BlogCatalogue;
