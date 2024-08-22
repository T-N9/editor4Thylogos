'use client'
import React from 'react'
import useBlogCatalogue from './useBlogCatalogue'
import Link from 'next/link';
import { Button } from '@nextui-org/react';

const BlogCatalogue = () => {

    const { blogData } = useBlogCatalogue();

    return (
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
            {
                blogData.map((blog, index) => (
                    <div key={index} className='relative border p-3 rounded-md'>
                        <Link href={`/update/${blog.slug}`}>
                            <Button isIconOnly size='sm' className='absolute right-2 top-2 bg-blue-500'><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#fff" className="size-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                            </svg>
                            </Button>
                        </Link>
                        <Link key={blog.id} href={`/blog/${blog.slug}`}>

                            <div key={index}>
                                <h1 className='text-4xl'>{blog.title}</h1>
                                <p className='my-5 line-clamp-3'>{blog.summary}...</p>

                                <div>
                                    {
                                        blog.tags.map((tag, index) => {
                                            return <span className='bg-gray-100 px-2 py-1 rounded-full' key={index} style={{ marginRight: '5px' }}>{tag}</span>
                                        })
                                    }
                                </div>

                            </div>
                        </Link>
                    </div>
                ))
            }
        </div>
    )
}

export default BlogCatalogue