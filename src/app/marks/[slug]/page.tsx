import ScrollIndicator from "@/components/ui/ScrollIndicator"
import { getBlogBySlug, getAllBlogSlug } from "../fetchers"
import Link from "next/link"
import './starry.css'


export async function generateStaticParams() {
  return getAllBlogSlug()
}

export default async function BlogPage({
  params,
}: {
  params: { slug: string }
}) {
  const blog = await getBlogBySlug(params.slug)
  return (
    <>
      <head>
        <title>{blog.frontmatter.title}</title>
      </head>
      <ScrollIndicator />
      <main className="prose mx-4 lg:mx-auto filtered-content pt-5 lg:pt-10">
        <div className="mt-5">
          <h1 style={{
            fontFamily : 'Walone'
          }} className="dark:text-gray-200 font-bold text-slate-800 text-3xl lg:!text-7xl mb-2">{blog.frontmatter.title}</h1>


          <div className="flex justify-between items-center">
            <div>
              <Link className="text-primary no-underline" href="/marks">Marks</Link> / <span className="text-gray-400">{blog.slug}</span>
            </div>

            <p className="m-0 text-gray-400">{blog.frontmatter.publishDate}</p>
          </div>
        </div>
        <hr />
        <article className="mdx-wrapper" style={{ fontFamily: 'MiSans,Inter' }}>
          {blog.content}
        </article>
      </main>
    </>
  )
}
