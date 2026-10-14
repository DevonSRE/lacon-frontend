import CaseWorkspace from "@/features/cases/_components/CaseWorkspace";
import Link from "next/link";

export default async function CasePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <div className="mx-auto w-full max-w-5xl p-4"><Link href="/cases" className="text-sm underline">Back to cases</Link><CaseWorkspace id={id} /></div>;
}
