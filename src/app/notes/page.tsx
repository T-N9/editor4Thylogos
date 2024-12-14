import BlogCatalogue from '@/components/blog-catalogue'
import { fetchAllBlogData, fetchAllPinnedBlogData } from '@/lib/firebase';
import React from 'react'

const BlogPage = async() => {

  const serverData = await fetchAllBlogData();
  const serverPinnedData = await fetchAllPinnedBlogData();
  if(!serverData) {
    return(
      <div className="flex justify-center items-center h-screen w-full text-primary-600">Loading notes...</div>
    )
  }

  return (
    <section className='text-black'>
        <div className='max-w-[1350px] mx-auto py-5 mb-10'>
          <h1 className='text-2xl font-bold text-blue-500 mb-3'>Published articles</h1>
          <BlogCatalogue pinnedData={serverPinnedData} blogData={serverData}/>
        </div>
    </section>
  )
}

export default BlogPage