// middleware.ts (선택사항)
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 정적 파일은 그대로 통과
  if (pathname.match(/\.(jpg|jpeg|png|gif|svg|ico|css|js|json)$/i)) {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
