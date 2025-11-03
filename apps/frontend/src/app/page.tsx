import Image from "next/image";
import { GreetingsDashboard } from "./greetings-dashboard";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <div className="flex w-full max-w-3xl flex-col gap-10 px-6 py-16 sm:px-12">
        <header className="flex flex-col gap-4 text-center sm:text-left">
          <Image
            className="dark:invert"
            src="/next.svg"
            alt="Next.js logo"
            width={100}
            height={20}
            priority
          />
          <p className="text-sm uppercase tracking-[0.25em] text-zinc-500 dark:text-zinc-400">
            Full-stack demo
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            Next.js frontend + NestJS backend
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            Use the dashboard below to exercise the NestJS greetings API — list
            greetings, create new ones, look them up, and delete them again.
          </p>
        </header>

        <GreetingsDashboard />

        <section className="text-sm text-zinc-500 dark:text-zinc-400">
          <p>
            Run <code>pnpm dev:all</code> from the repository root to start both
            apps. The frontend expects the backend at{" "}
            <code>http://localhost:3001</code>; change{" "}
            <code>NEXT_PUBLIC_API_URL</code> and{" "}
            <code>NEXT_PUBLIC_API_KEY</code> if needed.
          </p>
        </section>
      </div>
    </main>
  );
}
