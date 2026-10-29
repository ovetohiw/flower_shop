import { NextRequest, NextResponse } from "next/server";
import { listPickupPoints } from "@/lib/integrations/cdek";

export async function GET(request: NextRequest) {
  const city = request.nextUrl.searchParams.get("city") || "Москва";
  const points = await listPickupPoints(city);
  return NextResponse.json({ points });
}
