import { Metadata } from "next"

import BlogPost from "@/components/blog-post"
import { blogData } from "@/data/blog-post"

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
    const post = blogData.find((post) => post.slug === params.slug)

    if (post) {
        return {
            title: post.title,
            description: 'This is a description',
            openGraph: {
                title: post.title,
                description:'This is a description',
                images: post.image,
            },
        }
    }

    return {
        title: "Blog Post Not Found",
        description: "The blog post you are looking for does not exist.",
    }
}

const BlogPostPage = ({ params }: { params: { slug: string } }) => {
    const post = blogData.find((post) => post.slug === params.slug)
    return (
        <>{
            post &&
            <BlogPost
                author={post.author}
                contentSize={post.contentSize}
                date={post.date}
                editorState={post.editorState}
                image={post.image}
                slug={post.slug}
                title={post.title}
            />

        }
        </>
    )
}

export default BlogPostPage