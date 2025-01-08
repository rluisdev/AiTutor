import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("token");

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token.value, process.env.AUTH_SECRET!);
    return NextResponse.json({ user: decoded });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
