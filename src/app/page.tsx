import TestForm from "@/components/testForm";
import { Button } from "@/components/ui/button";
import { Layout } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const items = [
    {
      title: "page 1",
      url: "url",
    },
  ];
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <Link href="/dashboard">
            <Button>
              <Layout className="size-4" />
              Go to dashboard
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
