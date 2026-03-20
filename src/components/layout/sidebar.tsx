"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ClipboardList,
  Cog,
  ShieldCheck,
  Package,
  ChevronLeft,
  Factory,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const menuItems = [
  {
    id: "dashboard",
    name: "首页",
    icon: LayoutDashboard,
    route: "/",
  },
  {
    id: "work-orders",
    name: "生产工单",
    icon: ClipboardList,
    route: "/work-orders",
  },
  {
    id: "equipment",
    name: "设备管理",
    icon: Cog,
    route: "/equipment",
  },
  {
    id: "quality",
    name: "质量管理",
    icon: ShieldCheck,
    route: "/quality",
  },
  {
    id: "materials",
    name: "物料管理",
    icon: Package,
    route: "/materials",
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "h-screen bg-sidebar text-sidebar-foreground border-r border-sidebar-border flex flex-col flex-shrink-0 transition-all duration-200",
        collapsed ? "w-16" : "w-56"
      )}
    >
      {/* Logo */}
      <div className="h-14 flex items-center gap-2 px-4 border-b border-sidebar-border">
        <div className="h-8 w-8 rounded-lg bg-sidebar-primary flex items-center justify-center flex-shrink-0">
          <Factory className="h-4 w-4 text-sidebar-primary-foreground" />
        </div>
        {!collapsed && (
          <span className="text-sm font-semibold tracking-tight truncate">
            MES 生产管理
          </span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-3 px-2 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive =
            item.route === "/"
              ? pathname === "/"
              : pathname.startsWith(item.route);

          return (
            <Link
              key={item.id}
              href={item.route}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
              )}
            >
              <item.icon className="h-4 w-4 flex-shrink-0" />
              {!collapsed && <span>{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Collapse toggle */}
      <div className="p-2 border-t border-sidebar-border">
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-center text-sidebar-foreground/50 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
          onClick={() => setCollapsed(!collapsed)}
        >
          <ChevronLeft
            className={cn(
              "h-4 w-4 transition-transform",
              collapsed && "rotate-180"
            )}
          />
        </Button>
      </div>
    </aside>
  );
}
