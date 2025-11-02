import TestForm from "@/components/testForm";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <div className="flex flex-col justify-content items-center gap-5">
        <div className="flex justify-center items-center h-70 w-70 bg-amber-500">
          <span className="text-5xl font-bold text-black">Orange</span>
        </div>
        <TestForm />
      </div>
    </div>
  );
}
