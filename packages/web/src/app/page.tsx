"use client";

import Image from "next/image";
import { DemoButton } from "../components/DemoButton";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#fafafa] font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-[800px] flex-col items-start justify-between bg-white px-15 py-30 max-sm:px-6 max-sm:py-12 dark:bg-black">
        <DemoButton />
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={100}
          height={20}
          priority
        />
        <div className="flex flex-col items-start gap-6 text-left max-sm:gap-4">
          <h1 className="max-w-80 text-[40px] font-semibold leading-[48px] tracking-[-2.4px] text-balance text-black max-sm:text-[32px] max-sm:leading-[40px] max-sm:tracking-[-1.92px] dark:text-[#ededed]">
            To get started, edit the page.tsx file.
          </h1>
          <p className="max-w-[440px] text-lg leading-8 text-balance text-[#666] dark:text-[#999]">
            Looking for a starting point or more instructions? Head over to{" "}
            <a
              href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-black dark:text-[#ededed]"
            >
              Templates
            </a>{" "}
            or the{" "}
            <a
              href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-black dark:text-[#ededed]"
            >
              Learning
            </a>{" "}
            center.
          </p>
        </div>
        <div className="flex w-full max-w-[440px] flex-row gap-4 text-sm">
          <a
            className="flex h-10 w-fit cursor-pointer items-center justify-center gap-2 rounded-full border border-transparent bg-black px-4 font-medium text-[#fafafa] transition-[background-color] duration-200 hover:bg-[#383838] dark:bg-[#ededed] dark:text-black dark:hover:bg-[#ccc]"
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className="dark:invert"
              src="/vercel.svg"
              alt="Vercel logomark"
              width={16}
              height={16}
            />
            Deploy Now
          </a>
          <a
            className="flex h-10 w-fit cursor-pointer items-center justify-center rounded-full border border-[#ebebeb] px-4 font-medium transition-[background-color] duration-200 hover:bg-[#f2f2f2] dark:border-[#1a1a1a] dark:hover:bg-[#1a1a1a]"
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Documentation
          </a>
        </div>
      </main>
    </div>
  );
}
