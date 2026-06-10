import { NextResponse } from "next/server";
import { projects } from "@/lib/projects";
import fs from "fs";
import path from "path";

const DATA_PATH = path.join(process.cwd(), "data", "projects.json");

function readProjects() {
  // 优先读文件（本地后台可写），失败则用内嵌数据（Vercel 可靠）
  try {
    return JSON.parse(fs.readFileSync(DATA_PATH, "utf-8"));
  } catch {
    return projects;
  }
}

function writeProjects(data: unknown) {
  try {
    const dir = path.dirname(DATA_PATH);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));
  } catch {
    // Vercel 上只读，静默忽略
  }
}

export async function GET() {
  return NextResponse.json(readProjects(), {
    headers: { "Cache-Control": "no-store, max-age=0" },
  });
}

export async function POST(req: Request) {
  const body = await req.json();
  const list = readProjects();
  const newProject = {
    ...body,
    slug: body.slug || body.titleEn?.toLowerCase().replace(/\s+/g, "-") || `project-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  list.push(newProject);
  writeProjects(list);
  return NextResponse.json(newProject, { status: 201 });
}

export async function PUT(req: Request) {
  const body = await req.json();
  const list = readProjects();
  const idx = list.findIndex((p: { slug: string }) => p.slug === body.slug);
  if (idx === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });
  list[idx] = { ...list[idx], ...body };
  writeProjects(list);
  return NextResponse.json(list[idx]);
}

export async function DELETE(req: Request) {
  const { slug } = await req.json();
  let list = readProjects();
  list = list.filter((p: { slug: string }) => p.slug !== slug);
  writeProjects(list);
  return NextResponse.json({ ok: true });
}
