import BlogCatalogue from "@/components/blog-catalogue";
import HeroBento from "@/components/hero-bento/HeroBento";
import { fetchAllBlogData, fetchAllPinnedBlogData } from "@/lib/firebase";

export const revalidate = 60; // Revalidate every 60 seconds

export default async function Home() {

  const serverData = await fetchAllBlogData();
  const serverPinnedData = await fetchAllPinnedBlogData();
  if(!serverData) {
    return(
      <div className="flex justify-center items-center h-screen w-full text-primary-600">Loading notes...</div>
    )
  }

  return (
    <section className='text-black filtered-content px-2.5'>
      <div className='max-w-[1350px] mx-auto py-5 mb-10'>
        <HeroBento pinnedData={serverPinnedData} blogData={serverData}/>
        <section id="explore" className="py-5">
          <BlogCatalogue pinnedData={serverPinnedData} blogData={serverData}/>
        </section>
      </div>
    </section>
  );
}
