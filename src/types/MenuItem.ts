// ✅ src/types/MenuItem.ts
export interface MenuItem {
  name: string;
  href: string;
}
export interface NavLink {
  name: string;
  href?: string;
  dropdown?: {
    name: string;
    href: string;
  }[];
}
