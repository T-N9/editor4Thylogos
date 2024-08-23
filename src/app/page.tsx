
import BlogCatalogue from "@/components/blog-catalogue";
import { Button } from "@nextui-org/react";

export default function Home() {
  return (
    <section className='text-black'>
      <div className='max-w-[1350px] mx-auto my-5 mb-10'>
        <section className="bg-gray-100 rounded-lg dark:bg-gray-900 text-gray-800 dark:text-gray-100 py-20 px-5 md:px-10">
          <div className="container mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Welcome to <span className="text-indigo-600">TN Notes</span>
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
