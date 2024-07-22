import Link from "next/link";

export default function Home() {
  return (
    <main className="h-screen w-full flex justify-center items-center">
      <Link href={'/upload'}>
        Upload Contents
      </Link>
    </main>
  );
}
