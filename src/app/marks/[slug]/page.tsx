import ScrollIndicator from "@/components/ui/ScrollIndicator"
import { getBlogBySlug, getAllBlogSlug, getBlogs } from "../fetchers"
import Link from "next/link"
import './starry.css'
import BlogLink from "@/components/ui/BlogLink"
import MarkdownContent from "@/components/markdown-content"


export async function generateStaticParams() {
  return getAllBlogSlug()
}

export default async function BlogPage({
  params,
}: {
  params: { slug: string }
}) {
  const blog = await getBlogBySlug(params.slug)
  const blogs = await getBlogs();

  // console.log({is:blog.frontmatter.isJapanese})
  return (
    <>
      <head>
        <title>{blog.frontmatter.title}</title>
      </head>
      <ScrollIndicator />
      <section className="flex lg:gap-5 relative">
        <aside className=" hidden fixed lg:block w-[300px] top-[56px] border-r-1 dark:border-gray-800 left-0 px-4 py-2 h-screen bg-white dark:bg-slate-900">
          {blogs.map((blog, i) => (
            <BlogLink
              key={i}
              title={blog.frontmatter.title}
              slug={blog.slug}
              publishDate={blog.frontmatter.publishDate}
            />
          ))}
        </aside>
        <main className="prose w-full lg:!w-[650px] px-4 lg:p-0 mx-auto filtered-content pt-5 lg:pt-2">
          <div className="mt-5 bg-primary-50 dark:bg-primary-950 shadow rounded-md p-4">
            <h1 style={{
              fontFamily: 'Inter,Walone'
            }} className="dark:text-gray-200 font-bold text-slate-800 text-3xl lg:!text-2xl mb-2">{blog.frontmatter.title}</h1>
            <div className="flex justify-between items-center">
              <div>
                <Link className="text-primary no-underline" href="/marks">Marks</Link> <span className="text-gray-400">/ {blog.slug}</span>
              </div>

              <p className="m-0 text-gray-400">{blog.frontmatter.publishDate}</p>
            </div>
          </div>
          <hr />
          <MarkdownContent content={blog.content} isJapanese={blog.frontmatter.isJapanese === 'true'}/>
        </main>
      </section>
    </>
  )
}
