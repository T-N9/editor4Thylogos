'use client'
import { BlogCard } from '../blog-catalogue';
import useBlogCatalogue, { ThumbnailBlogItem } from '../blog-catalogue/useBlogCatalogue';
import NewsletterForm from '../newsletter-form/NewsletterForm';
import LatestLogo from '../ui/LatestLogo';
import { Logo } from '../ui/Logo';


const HeroBento = ({pinnedData, blogData} : {pinnedData : ThumbnailBlogItem[], blogData : ThumbnailBlogItem[]}) => {
    const { pathname } = useBlogCatalogue();
    return (
        <section>
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-5'>
                <div className="bg-gray-100 card-shadow relative rounded-lg dark:bg-slate-800 text-gray-800 dark:text-gray-100 py-5 lg:py-10 px-5 md:px-10">
                    <div className="container mx-auto text-left">
                        {/* <HeroLogo /> */}

                        <h1 className="text-4xl md:text-4xl font-bold mb-4 text-primary-950 dark:text-slate-200">
                            Welcome to <br className="block" /><span style={{ fontFamily: 'Indie Flower' }} className="text-primary-600 font-bold text-5xl lg:text-7xl">TN Notes</span>
                        </h1>
                        <p className="text-lg md:text-xl mb-8">
                            A tiny space of <a className="text-primary-600 underline cursor-pointer" href="https://www.tenyain.com/" target="_blank" rel="noreferrer">TeNyain တည်ငြိမ်</a>  for capturing ideas and thoughts.
                        </p>
                        <div className='flex justify-center items-center mb-5'>
                            {/* <Logo width ={200} height={200} /> */}
                            <NewsletterForm/>
                        </div>
                    </div>
                </div>
                <div className='flex gap-5 flex-col'>
                    <div className="">
                        <div className="lg:max-w-[800px] mx-auto">
                            <div className="grid grid-cols-1 gap-4 lg:grid-cols-1">
                                {pinnedData?.map((blog, index) => (
                                    <BlogCard key={index} blog={blog} pathname={pathname} isPinned={true} />
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="w-full relative">
                        {
                            blogData.length > 1 && <LatestLogo className='absolute -top-4 z-20 left-0 lg:-left-0'/>
                        }
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-2">
                            {blogData.slice(0, 2)?.map((blog, index) => (
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