import Link from "next/link";
import BlogPage from "./blog/page";

import { Button } from "@nextui-org/react";

export default function Home() {
  return (
    <main className="h-screen w-full ">
      <BlogPage/>
      <Link className="mx-auto table" href={'/upload'}>
        <Button color="primary">
          Click to Upload
        </Button>
      </Link>
    </main>
  );
}
