import Link from "next/link";
import BlogPage from "./blog/page";

export default function Home() {
  return (
    <main className="h-screen w-full ">
      <BlogPage/>
      <Link className="mx-auto table" href={'/upload'}>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Click to Upload
        </button>
      </Link>
    </main>
  );
}
