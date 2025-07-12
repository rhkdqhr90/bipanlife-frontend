"use client";
import Link from "next/link";
import { useEffect } from "react";

interface SubMenuProps {
  menuItems: { name: string; href: string }[];
}

export const SubMenu = ({ menuItems }: SubMenuProps) => {
  useEffect(() => {
    console.log("SubMenu menuItems:", menuItems);
  }, [menuItems]);

  return (
    <div className="bg-white border-b border-gray-200 py-3 shadow-sm">
      <div className="w-full max-w-6xl mx-auto px-4 flex justify-center space-x-8 text-sm">
        {menuItems.length === 0 ? (
          <p>메뉴 항목이 없습니다.</p>
        ) : (
          menuItems.map(item => (
            <Link
              key={item.name}
              href={item.href}
              className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
            >
              {item.name}
            </Link>
          ))
        )}
      </div>
    </div>
  );
};
