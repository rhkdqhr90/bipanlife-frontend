// ✅ src/components/layout/Menu/SubMenu.tsx
"use client";

import Link from "next/link";
import { MenuItem } from "@/types/MenuItem";
import { usePathname } from "next/navigation";

interface SubMenuProps {
  menuItems: MenuItem[];
}

export const SubMenu = ({ menuItems }: SubMenuProps) => {
  const pathname = usePathname();

  if (menuItems.length === 0) return null;

  return (
    <div className="bg-white border-b border-gray-200 shadow-sm">
      <div className="w-full max-w-6xl mx-auto px-4 flex justify-center space-x-6 text-sm py-2">
        {menuItems.map(item => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`transition-colors ${
                isActive ? "text-blue-600 font-semibold" : "text-gray-600 hover:text-blue-600"
              }`}
            >
              {item.name}
            </Link>
          );
        })}
      </div>
    </div>
  );
};
