"use client";
import { usePathname } from "next/navigation";
import { SubMenu } from "./SubMenu";
import { NavLink } from "@/types/MenuItem";

interface SubMenuWrapperProps {
  navLinks: NavLink[];
}

export const SubMenuWrapper = ({ navLinks }: SubMenuWrapperProps) => {
  const pathname = usePathname();

  // 현재 path와 가장 먼저 일치하는 navLink 선택
  const matched = navLinks.find(link => {
    if (link.href && pathname.startsWith(link.href)) {
      return true;
    }
    if (link.dropdown) {
      return link.dropdown.some(item => pathname.startsWith(item.href));
    }
    return false;
  });
  const menuItems = matched?.dropdown ?? [];

  return menuItems.length > 0 ? <SubMenu menuItems={menuItems} /> : null;
};
