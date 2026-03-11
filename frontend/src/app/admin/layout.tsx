"use client";
import { usePathname } from "next/navigation";

import BoardsWorkspaceLayoutShell from "@/components/layout/BoardsWorkspaceLayoutShell";
import { Crumb } from "@/lib/types/Crumb";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const crumbs = getAdminCrumbs(pathname);

  return (
    <BoardsWorkspaceLayoutShell
      requiredPermission="user_create"
      crumbs={crumbs}
    >
      {children}
    </BoardsWorkspaceLayoutShell>
  );
}

function getAdminCrumbs(pathname: string): Crumb[] {
  if (pathname === "/admin/users") {
    return [{ title: "Boards", href: "/boards" }, { title: "Users" }];
  }

  return [{ title: "Admin" }];
}
