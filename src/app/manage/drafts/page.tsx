import DraftedBlogCatalogue from '@/components/blog-catalogue/DraftedBlogCatalogue'
import React from 'react'

const DraftedItemsPage = () => {
  return (
    <section className='text-black'>
    <div className='max-w-[1350px] mx-auto my-5 mb-10'>
        <h1 className='text-2xl font-bold text-blue-500 mb-3'>Drafted articles</h1>
        <DraftedBlogCatalogue />
    </div>
</section>
  )
}

export default DraftedItemsPage