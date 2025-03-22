import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const isMaintenance = true;

  if (isMaintenance) {
    return new NextResponse(
      JSON.stringify({ message: "Site en maintenance, revenez plus tard !" }),
      {
        status: 503,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
