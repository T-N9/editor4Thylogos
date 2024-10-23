'use client'
import { BlogCard } from '../blog-catalogue';
import useBlogCatalogue from '../blog-catalogue/useBlogCatalogue';
import LatestLogo from '../ui/LatestLogo';
import { Logo } from '../ui/Logo';


const HeroBento = () => {
    const { pathname, fetchedBlogData, fetchedPinnedBlogData } = useBlogCatalogue();
    return (
        <section>
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-5'>
                <div className="bg-gray-100 card-shadow relative rounded-lg dark:bg-indigo-950 text-gray-800 dark:text-gray-100 py-5 lg:py-10 px-5 md:px-10">
                    <div className="container mx-auto text-center">
                        {/* <HeroLogo /> */}
                        <div className='flex justify-center items-center mb-5'>
                            <Logo width ={200} height={200} />
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold mb-4 text-indigo-950 dark:text-slate-200">
                            Welcome to <br className="block" /><span style={{ fontFamily: 'Indie Flower' }} className="text-indigo-600 font-bold text-5xl lg:text-7xl">TN Notes</span>
                        </h1>
                        <p className="text-lg md:text-xl mb-8">
                            A tiny space of <a className="text-indigo-600 underline cursor-pointer" href="https://www.tenyain.com/" target="_blank" rel="noreferrer">mine</a>  for capturing ideas and thoughts.
                        </p>
                    </div>
                </div>
                <div className='flex gap-5 flex-col'>
                    <div className="">
                        <div className="lg:max-w-[800px] mx-auto">
                            <div className="grid grid-cols-1 gap-4 lg:grid-cols-1">
                                {fetchedPinnedBlogData?.map((blog, index) => (
                                    <BlogCard key={index} blog={blog} pathname={pathname} isPinned={true} />
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="w-full relative">
                        {
                            fetchedBlogData.length > 1 && <LatestLogo className='absolute -top-4 z-20 left-0 lg:-left-0'/>
                        }
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-2">
                            {fetchedBlogData.slice(0, 2)?.map((blog, index) => (
                                <BlogCard key={index} blog={blog} pathname={pathname} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>


        </section>
    )
}

export default HeroBento