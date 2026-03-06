import { notFound } from "next/navigation";

export default async function BoardIdLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const hasValidBoardId = /^[1-9]\d*$/.test(id);

  if (!hasValidBoardId) {
    notFound();
  }

  return children;
}
