import ScrollIndicator from "@/components/ui/ScrollIndicator"
import { getBlogBySlug, getAllBlogSlug } from "../fetchers"
import Link from "next/link"

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
      <ScrollIndicator />
      <main className="prose mx-4 filtered-content">
        <div className="mt-5">
          <h1 className="text-primary">{blog.frontmatter.title}</h1>
          

          <div className="flex justify-between items-center">
            <div>
              <Link className="text-primary no-underline" href="/marks">Marks</Link> / {blog.slug}
            </div>

            <p>{blog.frontmatter.publishDate}</p>
          </div>
        </div>
        <hr />
        <article className="mdx-wrapper" style={{ fontFamily: 'Inter' }}>
          {blog.content}
        </article>
      </main>
    </>
  )
}
