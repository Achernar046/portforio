import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const LAB_FOLDER_MAP: Record<string, string> = {
  "active-directory": "active-directory",
  "pfsense-vlan":     "pfsense-vlan",
  "wireguard-vpn":    "wireguard-vpn",
  "ospf-routing":     "OSPFRoutingLab(FRRouting)",
  "bgp-routing":      "BGPRoutingLab(FRRouting)",
};

const IMAGE_EXTS = new Set([".png", ".jpg", ".jpeg", ".webp", ".gif"]);

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const folder  = LAB_FOLDER_MAP[id];

  if (!folder) {
    return NextResponse.json({ error: "Lab not found" }, { status: 404 });
  }

  const dir = path.join(process.cwd(), "public", "lab-data", folder);

  try {
    const files  = fs.readdirSync(dir);
    const images = files
      .filter((f) => IMAGE_EXTS.has(path.extname(f).toLowerCase()))
      .sort();
    return NextResponse.json({ images });
  } catch {
    return NextResponse.json({ error: "Directory not found" }, { status: 404 });
  }
}
