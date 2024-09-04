'use client'
import { usePathname } from 'next/navigation';
import Link from 'next/link';

interface BlogLinkProps {
    slug: string;
    title: string;
    publishDate: string;
}


const BlogLink: React.FC<BlogLinkProps> = ({ slug, title, publishDate }) => {
    const pathname = usePathname().split('/')[2];

    console.log({pathname});
    return (
        <Link
            href={`/marks/${slug}`}
            className={`table ${slug === pathname && 'bg-indigo-50'} duration-300 transition-all hover:bg-gray-100 rounded w-full text-sm text-indigo-600 hover:text-indigo-800`}
            style={{ color: '#4f46e5' }}
            prefetch
        >
            <div className="p-2 rounded">
                <h1 style={{ fontFamily: 'MiSans,Inter' }} className="col-span-3 text-sm font-bold">
                    {title}
                </h1>
                <p className="text-sm text-gray-600">{publishDate}</p>
            </div>
        </Link>
    );
};

export default BlogLink;
