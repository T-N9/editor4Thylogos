import React from 'react'
import BlogCatalogue from '@/components/blog-catalogue'
import { fetchAllBlogData, fetchAllPinnedBlogData } from '@/lib/firebase';

export const revalidate = 60; // Revalidate every 60 seconds

const ManagementPage = async() => {

    const serverData = await fetchAllBlogData();
    const serverPinnedData = await fetchAllPinnedBlogData();

    if(!serverData) {
      return(
        <div className="flex justify-center items-center h-screen w-full text-primary-600">Loading notes...</div>
      )
    }

    return (
        <section className='text-black'>
            <div className='max-w-[1350px] mx-auto my-5 mb-10'>
                <h1 className='text-2xl font-bold text-blue-500 mb-3'>Published articles</h1>
                <BlogCatalogue pinnedData={serverPinnedData} blogData={serverData}/>
            </div>
        </section>
    )
}

export default ManagementPage