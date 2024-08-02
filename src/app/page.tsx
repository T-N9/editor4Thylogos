import Link from "next/link";

export default function Home() {
  return (
    <main className="h-screen w-full flex justify-center items-center">
      <Link href={'/upload'}>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Click to Upload
        </button>
      </Link>
    </main>
  );
}
