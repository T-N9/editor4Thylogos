'use client'
import { BlogCard } from '../blog-catalogue';
import useBlogCatalogue from '../blog-catalogue/useBlogCatalogue';
import HeroLogo from '../ui/HeroLogo'
import LatestLogo from '../ui/LatestLogo';

const HeroBento = () => {
    const { pathname, fetchedBlogData, fetchedPinnedBlogData } = useBlogCatalogue();
    return (
        <section>
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-5'>
                <div className="bg-gray-100 relative rounded-lg dark:bg-indigo-950 text-gray-800 dark:text-gray-100 py-5 lg:py-10 px-5 md:px-10">
                    <div className="absolute bottom-0 rounded-lg left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]"></div>
                    <div className="container mx-auto text-center">
                        <HeroLogo />
                        <h1 className="text-4xl md:text-6xl font-bold mb-4 text-indigo-950 dark:text-slate-200">
                            Welcome to <br className="block" /><span style={{ fontFamily: 'Indie Flower' }} className="text-indigo-600 font-bold text-5xl lg:text-7xl">TN Notes</span>
                        </h1>
                        <p className="text-lg md:text-xl mb-8">
                            A tiny space of <a className="text-indigo-600 underline" href="https://www.tenyain.com/" target="_blank" rel="noreferrer">mine</a>  for capturing ideas and thoughts.
                        </p>
                    </div>
                </div>
                <div>
                    <div className="px-2 py-4 mb-5 bg-indigo-400 relative rounded-md">
                        <div className="absolute bottom-0 rounded-md left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]"></div>
                        <div className="lg:max-w-[800px] mx-auto">
                            <div className="grid grid-cols-1 gap-4 lg:grid-cols-1">
                                {fetchedPinnedBlogData?.map((blog, index) => (
                                    <BlogCard key={index} blog={blog} pathname={pathname} isPinned={true} />
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="w-full relative">
                        <LatestLogo className='absolute -top-4 z-20 left-0 lg:-left-4'/>
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