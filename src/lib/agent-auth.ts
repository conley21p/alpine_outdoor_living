import { timingSafeEqual } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { getServerConfig } from "@/lib/config";

const safeCompare = (a: string, b: string): boolean => {
  const aBuffer = Buffer.from(a);
  const bBuffer = Buffer.from(b);
  if (aBuffer.length !== bBuffer.length) {
    return false;
  }
  return timingSafeEqual(aBuffer, bBuffer);
};

export const validateAgentKey = (request: NextRequest): NextResponse | null => {
  const candidate = request.headers.get("x-agent-key");
  const { openclawAgentApiKey } = getServerConfig();

  if (!candidate || !safeCompare(candidate, openclawAgentApiKey)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return null;
};
