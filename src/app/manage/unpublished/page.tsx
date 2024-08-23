import UnpublishedBlogCatalogue from '@/components/blog-catalogue/UnpublishedBlogCatalogue'
import React from 'react'

const UnpublishedItemsPage = () => {
  return (
    <section className='text-black'>
    <div className='max-w-[1350px] mx-auto my-5 mb-10'>
        <h1 className='text-2xl font-bold text-blue-500 mb-3'>Unpublished articles</h1>
        <UnpublishedBlogCatalogue />
    </div>
</section>
  )
}

export default UnpublishedItemsPage