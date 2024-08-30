import Link from "next/link";
import { getBlogs } from "./fetchers";

export default async function BlogsPage() {
  const blogs = await getBlogs();
  return (
    <main className="min-h-screen filtered-content max-w-[650px] mx-auto p-6">
      {blogs.map((blog, i) => (
        <article
          key={i}
          className=" gap-4 p-6 "
        >
           <Link
            href={`/marks/${blog.slug}`}
            className="table text-sm text-indigo-600 hover:text-indigo-800"
            style={{ color: '#4f46e5' }}
          >
            <h1 className="col-span-3 text-3xl font-bold">
              {blog.frontmatter.title}
            </h1>
          </Link>
          <p className="text-sm text-gray-600">{blog.frontmatter.publishDate}</p>
        </article>
      ))}
    </main>
  );
}
