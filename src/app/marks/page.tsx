import Link from "next/link";
import { getBlogs } from "./fetchers";

export default async function BlogsPage() {
  const blogs = await getBlogs();
  return (
    <main className="min-h-screen filtered-content max-w-[650px] mx-auto p-6">
      {blogs.map((blog, i) => (
        <article
          key={i}
          className="grid grid-cols-4 gap-4 p-6 mb-6 bg-white"
        >
          <h1 className="col-span-3 text-3xl font-bold text-gray-800">
            {blog.frontmatter.title}
          </h1>
          <p className="text-sm text-gray-600">{blog.frontmatter.publishDate}</p>
          <Link
            href={`/marks/${blog.slug}`}
            className="col-span-1 text-sm text-indigo-600 hover:text-indigo-800"
            style={{ color: '#4f46e5' }}
          >
            Read More
          </Link>
        </article>
      ))}
    </main>
  );
}
