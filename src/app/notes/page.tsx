import BlogCatalogue from '@/components/blog-catalogue'
import React from 'react'

const BlogPage = () => {

  return (
    <section className='text-black'>
        <div className='max-w-[1350px] mx-auto py-5 mb-10'>
          <h1 className='text-2xl font-bold text-blue-500 mb-3'>Published articles</h1>
          <BlogCatalogue/>
        </div>
    </section>
  )
}

export default BlogPage