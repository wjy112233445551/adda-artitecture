import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DATA_PATH = path.join(process.cwd(), "data", "renderings.json");

export async function GET() {
  try {
    const data = JSON.parse(fs.readFileSync(DATA_PATH, "utf-8"));
    return NextResponse.json(data, {
      headers: { "Cache-Control": "no-store, max-age=0" },
    });
  } catch {
    return NextResponse.json([]);
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = JSON.parse(fs.readFileSync(DATA_PATH, "utf-8"));
    const newProject = {
      ...body,
      slug: body.slug || `fx_${Date.now().toString(36)}`,
      createdAt: new Date().toISOString(),
    };
    data.push(newProject);
    fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));
    return NextResponse.json(newProject, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const data = JSON.parse(fs.readFileSync(DATA_PATH, "utf-8"));
    const idx = data.findIndex((p: any) => p.slug === body.slug);
    if (idx === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });
    data[idx] = { ...data[idx], ...body };
    fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));
    return NextResponse.json(data[idx]);
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { slug } = await req.json();
    let data = JSON.parse(fs.readFileSync(DATA_PATH, "utf-8"));
    data = data.filter((p: any) => p.slug !== slug);
    fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
