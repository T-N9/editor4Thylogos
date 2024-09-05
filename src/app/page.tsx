
import BlogCatalogue from "@/components/blog-catalogue";
import HeroBento from "@/components/hero-bento/HeroBento";
// import HeroLogo from "@/components/ui/HeroLogo";
// import { Button } from "@nextui-org/react";

export default function Home() {
  return (
    <section className='text-black filtered-content'>
      <div className='max-w-[1350px] mx-auto py-5 mb-10'>
        <HeroBento/>
        <section id="explore" className="py-5">
          <BlogCatalogue />
        </section>
      </div>
    </section>
  );
}
