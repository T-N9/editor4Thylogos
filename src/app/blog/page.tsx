import React from 'react'
import { blogData } from '@/data/blog-post'
import Link from 'next/link'

const BlogPage = () => {
    
  return (
    <section className='text-black'>
        <div className='max-w-[1350px] mx-auto my-5'>
          <ul className='space-y-5'>
            {blogData.map(post => (
              <li key={post.title}>
                <Link href={`/blog/${post.slug}`}>
                  <h2 className='text-2xl'>{post.title}</h2>
                  <p>{post.date}</p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
  
    </section>
  )
}

export default BlogPage