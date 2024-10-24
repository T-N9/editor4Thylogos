import React from 'react'
import BlogCatalogue from '@/components/blog-catalogue'

const ManagementPage = () => {
    return (
        <section className='text-black'>
            <div className='max-w-[1350px] mx-auto my-5 mb-10'>
                <h1 className='text-2xl font-bold text-blue-500 mb-3'>Published articles</h1>
                <BlogCatalogue />
            </div>
        </section>
    )
}

export default ManagementPage