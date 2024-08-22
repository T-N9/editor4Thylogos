import Link from "next/link";
import BlogPage from "./blog/page";

import { Button } from "@nextui-org/react";

export default function Home() {
  return (
    <main className="h-screen w-full ">
      <BlogPage />
    </main>
  );
}
