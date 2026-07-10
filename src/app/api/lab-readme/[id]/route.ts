import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// Files live in public/lab-data/<folder>/ — served by Next.js static file handling
// but still readable server-side via the filesystem during SSR/API routes.
const LAB_FOLDER_MAP: Record<string, string> = {
  "active-directory": "active-directory",
  "pfsense-vlan":     "pfsense-vlan",
  "wireguard-vpn":    "wireguard-vpn",
  "ospf-routing":     "OSPFRoutingLab(FRRouting)",
  "bgp-routing":      "BGPRoutingLab(FRRouting)",
  "pfsense-wazuh-siem": "pfSense_WazuhSIEMIntegrationLab",
};

const README_NAME: Record<string, { en: string; th: string }> = {
  "active-directory": { en: "01-active-directory-README.md",    th: "01-active-directory-README.th.md" },
  "pfsense-vlan":     { en: "02-pfsense-vlan-README.md",        th: "02-pfsense-vlan-README.th.md" },
  "wireguard-vpn":    { en: "03-wireguard-vpn-README.md",        th: "03-wireguard-vpn-README.th.md" },
  "ospf-routing":     { en: "ospf-routing-README.md",            th: "ospf-routing-README.th.md" },
  "bgp-routing":      { en: "bgp-routing-README.md",             th: "bgp-routing-README.th.md" },
  "pfsense-wazuh-siem": { en: "README.md",                      th: "README.th.md" },
};

function labDir(folder: string) {
  return path.join(process.cwd(), "public", "lab-data", folder);
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const folder  = LAB_FOLDER_MAP[id];
  const names   = README_NAME[id];

  if (!folder || !names) {
    return NextResponse.json({ error: "Lab not found" }, { status: 404 });
  }

  const lang     = req.nextUrl.searchParams.get("lang") ?? "en";
  const filename = lang === "th" ? names.th : names.en;
  const filePath = path.join(labDir(folder), filename);

  try {
    const content = fs.readFileSync(filePath, "utf-8");
    return NextResponse.json({ content });
  } catch {
    // Fall back to English if Thai file not found
    if (lang === "th") {
      try {
        const content = fs.readFileSync(path.join(labDir(folder), names.en), "utf-8");
        return NextResponse.json({ content });
      } catch {
        return NextResponse.json({ error: "README not found" }, { status: 404 });
      }
    }
    return NextResponse.json({ error: "README not found" }, { status: 404 });
  }
}
