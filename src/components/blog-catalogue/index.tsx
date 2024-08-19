'use client'
import React from 'react'
import useBlogCatalogue from './useBlogCatalogue'
import Link from 'next/link';

const BlogCatalogue = () => {

    const { blogData } = useBlogCatalogue();

    return (
        <div>
            {
                blogData.map((blog, index) => (
                    <Link key={blog.id} href={`/blog/${blog.slug}`}>
                        <div key={index}>
                            <h1 className='text-4xl'>{blog.title}</h1>
                            <p className='my-5'>{blog.summary}...</p>

                            <div>
                                {
                                    blog.tags.map((tag, index) => {
                                        return <span className='bg-gray-100 px-2 py-1 rounded-full' key={index} style={{ marginRight: '5px' }}>{tag}</span>
                                    })
                                }
                            </div>

                        </div>
                    </Link>
                ))
            }
        </div>
    )
}

export default BlogCatalogue