
import BlogCatalogue from "@/components/blog-catalogue";
import HeroLogo from "@/components/ui/HeroLogo";
import { Button } from "@nextui-org/react";
import Image from "next/image";

export default function Home() {
  return (
    <section className='text-black filtered-content'>
      <div className='max-w-[1350px] mx-auto py-5 mb-10'>
        {/* <div className="relative h-screen w-full bg-white"><div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]"></div></div> */}
        <section className="bg-gray-100 relative rounded-lg dark:bg-indigo-950 text-gray-800 dark:text-gray-100 py-20 px-5 md:px-10">
        <div className="absolute bottom-0 rounded-lg left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]"></div>
          <div className="container mx-auto text-center">
            {/* <Image src={'/images/Logo.png'} width={100} height={100} className="rounded-full border-4 mb-4 border-indigo-600 mx-auto" alt="TN Notes Logo" /> */}
            <HeroLogo />
            <h1 className="text-4xl md:text-6xl font-bold mb-4 text-indigo-950 dark:text-slate-200">
              Welcome to <br className="block lg:hidden" /><span style={{ fontFamily: 'Indie Flower' }} className="text-indigo-600 font-bold text-5xl lg:text-7xl">TN Notes</span>
            </h1>
            <p className="text-lg md:text-xl mb-8">
              A tiny space of <a className="text-indigo-600 underline" href="https://www.tenyain.com/" target="_blank" rel="noreferrer">mine</a>  for capturing ideas and thoughts.
            </p>
            <div className="mt-8">
              <a href="#explore">
                <Button
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-8 rounded-full shadow-lg transition-all duration-300 ease-in-out"
                >
                  Explore
                </Button>
              </a>
            </div>
          </div>
        </section>
        <section id="explore" className="py-5">
          <BlogCatalogue />
        </section>
      </div>
    </section>
  );
}
