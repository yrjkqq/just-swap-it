import Posts from "@/ui/posts";
import { Suspense } from "react";

async function getPosts() {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 12000));
  return [
    { id: "1", title: "First Post" },
    { id: "2", title: "Second Post" },
    { id: "3", title: "Start learning Next.js" },
  ];
}

export default function Page() {
  // Don't await the data fetching function
  const posts = getPosts();

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Posts posts={posts} />
    </Suspense>
  );
}
