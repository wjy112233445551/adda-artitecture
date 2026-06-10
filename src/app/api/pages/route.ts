import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DATA_PATH = path.join(process.cwd(), "data", "pages.json");

function read() {
  try { return JSON.parse(fs.readFileSync(DATA_PATH, "utf-8")); }
  catch { return {}; }
}
function write(data: unknown) {
  const dir = path.dirname(DATA_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));
}

export async function GET() {
  return NextResponse.json(read());
}

export async function POST(req: Request) {
  const body = await req.json();
  write(body);
  return NextResponse.json({ success: true });
}
