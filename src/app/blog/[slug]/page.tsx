import BlogPost from "@/components/blog-post"
import { blogData } from "@/data/blog-post"

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