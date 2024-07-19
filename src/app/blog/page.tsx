import React from 'react'
import { blogData } from '@/data/blog-post'
import Link from 'next/link'

const BlogPage = () => {
    
  return (
    <section className='text-black'>
        <ul>
          {blogData.map(post => (
            <li key={post.title}>
              <Link href={`/blog/${post.slug}`}>
                <h2>{post.title}</h2>
                <p>{post.date}</p>
              </Link>
            </li>
          ))}
        </ul>
  
    </section>
  )
}

export default BlogPage