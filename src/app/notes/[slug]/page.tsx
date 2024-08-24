import { Metadata } from "next"

import BlogPost from "@/components/blog-post"
import { fetchBlogDataBySlug } from "@/lib/firebase"
// import { blogData } from "@/data/blog-post"

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
    // const post = blogData.find((post) => post.slug === params.slug)
    try {
        const blogData = await fetchBlogDataBySlug(params.slug);
        if (blogData) {
            return {
                title: blogData.title,
                description: blogData.summary,
                openGraph: {
                    title: blogData.title,
                    description:blogData.summary,
                    images: blogData.featureImage,
                },
            }
        }
    }catch (err) {
        console.log({err});
    }

    return {
        title: "Blog Post Not Found",
        description: "The blog post you are looking for does not exist.",
    }
}

const BlogPostPage = async({ params }: { params: { slug: string } }) => {
    // const post = blogData.find((post) => post.slug === params.slug)
    const blogData = await fetchBlogDataBySlug(params.slug);
    const createdAt = {
        seconds: blogData?.createdAt.seconds,
        nanoseconds: blogData?.createdAt.nanoseconds,
        date: new Date(blogData?.createdAt.seconds * 1000).toISOString() // Convert to ISO string
    };
    const blogContentBody = JSON.parse(blogData?.content).editorState;
    const blogContentSize = JSON.parse(blogData?.content).contentSize;
    if (!blogData) {
        return <div>Blog post not found.</div>
    }
    return (
        <>{
            blogData &&
            <BlogPost
                contentSize={blogContentSize}
                createdAt={createdAt}
                tags={blogData.tags}
                editorState={blogContentBody}
                image={blogData.image}
                imageCaption={blogData.imageCaption}
                slug={blogData.slug}
                title={blogData.title}
            />

        }
        </>
    )
}

export default BlogPostPage