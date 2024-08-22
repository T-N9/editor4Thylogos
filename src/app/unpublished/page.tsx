import BlogCatalogue from '@/components/blog-catalogue'
import React from 'react'

const UnpublishedBlogPage = () => {

  return (
    <section className='text-black'>
        <div className='max-w-[1350px] mx-auto my-5 mb-10'>
          <BlogCatalogue/>
        </div>
    </section>
  )
}

export default UnpublishedBlogPage