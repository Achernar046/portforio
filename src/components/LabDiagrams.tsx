"use client";

/* ─── Shared primitives ─────────────────────────────────── */

function Node({
  icon, label, sub, color = "bg-slate-800 border-slate-600",
}: { icon: string; label: string; sub?: string; color?: string }) {
  return (
    <div className={`flex flex-col items-center gap-1 px-3 py-2.5 rounded-xl border ${color} text-center min-w-[90px] shadow-lg`}>
      <span className="text-xl leading-none">{icon}</span>
      <span className="text-xs font-semibold text-white leading-tight">{label}</span>
      {sub && <span className="text-[10px] text-slate-400 font-mono leading-tight">{sub}</span>}
    </div>
  );
}

function Arrow({ label, vertical = false }: { label?: string; vertical?: boolean }) {
  return vertical ? (
    <div className="flex flex-col items-center gap-0.5 my-1">
      <div className="w-px h-5 bg-slate-600" />
      {label && <span className="text-[9px] font-mono text-slate-500 px-1 py-0.5 bg-slate-800/60 rounded">{label}</span>}
      <div className="w-px h-5 bg-slate-600" />
      <svg width="8" height="6" viewBox="0 0 8 6" fill="none" className="text-slate-500">
        <path d="M4 6L0 0h8L4 6z" fill="currentColor" />
      </svg>
    </div>
  ) : (
    <div className="flex items-center gap-0.5 mx-1">
      <div className="h-px w-4 bg-slate-600" />
      {label && <span className="text-[9px] font-mono text-slate-500 px-1 whitespace-nowrap">{label}</span>}
      <div className="h-px w-4 bg-slate-600" />
      <svg width="6" height="8" viewBox="0 0 6 8" fill="none" className="text-slate-500">
        <path d="M6 4L0 0v8L6 4z" fill="currentColor" />
      </svg>
    </div>
  );
}

function Section({ title, color = "border-slate-600", children }: {
  title: string; color?: string; children: React.ReactNode;
}) {
  return (
    <div className={`rounded-xl border ${color} bg-black/30 p-3`}>
      <p className="text-[9px] font-mono text-slate-500 uppercase tracking-widest mb-2">{title}</p>
      {children}
    </div>
  );
}

/* ─── Active Directory Diagram ──────────────────────────── */
export function ADDiagram() {
  return (
    <div className="space-y-2 text-center">
      {/* Internet → Router */}
      <div className="flex justify-center">
        <Node icon="🌐" label="Internet" color="bg-slate-900 border-slate-700" />
      </div>
      <Arrow vertical label="192.168.1.x" />

      {/* Home Router */}
      <div className="flex justify-center">
        <Node icon="📡" label="Home Router" sub="192.168.1.1" color="bg-slate-800 border-slate-600" />
      </div>
      <Arrow vertical />

      {/* Proxmox host */}
      <Section title="Proxmox VE Host" color="border-blue-500/30">
        <div className="flex justify-center gap-4 flex-wrap">
          {/* DC01 */}
          <div className="flex flex-col items-center gap-1">
            <Node icon="🖥️" label="DC01" sub="192.168.1.99" color="bg-blue-900/60 border-blue-500/50" />
            <div className="space-y-0.5 text-[9px] font-mono text-slate-400 text-left bg-blue-900/20 rounded-lg px-2 py-1.5 border border-blue-500/20">
              <div>📂 AD DS</div>
              <div>🔍 DNS</div>
              <div>📋 DHCP</div>
              <div>🔒 GPO</div>
              <div className="text-blue-400">Domain: lab.local</div>
            </div>
          </div>

          {/* Client01 */}
          <div className="flex flex-col items-center gap-1">
            <Node icon="💻" label="Client01" sub="192.168.1.20" color="bg-indigo-900/60 border-indigo-500/50" />
            <div className="space-y-0.5 text-[9px] font-mono text-slate-400 text-left bg-indigo-900/20 rounded-lg px-2 py-1.5 border border-indigo-500/20">
              <div>🪟 Windows 10/11</div>
              <div className="text-indigo-400">LAB\Client01</div>
              <div>GPO applied ✓</div>
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
}

/* ─── pfSense VLAN Diagram ──────────────────────────────── */
export function PfsenseDiagram() {
  return (
    <div className="space-y-2 text-center">
      {/* Home Router */}
      <div className="flex justify-center">
        <Node icon="🏠" label="Home Router" sub="192.168.1.1" color="bg-slate-800 border-slate-600" />
      </div>
      <Arrow vertical label="vmbr0 (WAN)" />

      {/* pfSense */}
      <Section title="pfSense CE VM" color="border-orange-500/40">
        <div className="flex justify-center">
          <Node icon="🛡️" label="pfSense" sub="WAN: 192.168.1.4" color="bg-orange-900/60 border-orange-500/50" />
        </div>
        <div className="mt-2 text-[9px] font-mono text-orange-400 text-center">NAT · Firewall · VLAN trunk</div>
      </Section>
      <Arrow vertical label="vmbr1 (LAN)" />

      {/* LAN + VLANs */}
      <Section title="Internal Network (10.10.x.x)" color="border-orange-500/20">
        <div className="flex justify-center gap-3 flex-wrap">
          <div className="flex flex-col items-center gap-1">
            <Node icon="🔵" label="LAN" sub="10.10.10.0/24" color="bg-slate-800 border-slate-600" />
            <span className="text-[9px] text-slate-500 font-mono">default allow</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Node icon="🟠" label="VLAN 10" sub="10.10.20.0/24" color="bg-orange-900/40 border-orange-600/40" />
            <span className="text-[9px] text-slate-500 font-mono">Servers</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Node icon="🟡" label="VLAN 20" sub="10.10.30.0/24" color="bg-yellow-900/40 border-yellow-600/40" />
            <span className="text-[9px] text-slate-500 font-mono">Clients</span>
          </div>
        </div>
      </Section>
    </div>
  );
}

/* ─── WireGuard VPN Diagram ─────────────────────────────── */
export function WireGuardDiagram() {
  return (
    <div className="space-y-2 text-center">
      {/* Remote client */}
      <div className="flex justify-center">
        <Node icon="📱" label="Windows Client" sub="Mobile data (remote)" color="bg-green-900/40 border-green-600/40" />
      </div>
      <Arrow vertical label="🔒 WireGuard tunnel · UDP 51820" />

      {/* Internet */}
      <div className="flex justify-center">
        <Node icon="🌐" label="Internet" color="bg-slate-900 border-slate-700" />
      </div>
      <Arrow vertical label="Public IP: 182.53.x.x" />

      {/* Router */}
      <div className="flex justify-center">
        <Node icon="📡" label="Home Router" sub="Port Forward → 192.168.1.9" color="bg-slate-800 border-slate-600" />
      </div>
      <Arrow vertical />

      {/* WireGuard VM */}
      <Section title="WireGuard Server VM (Ubuntu)" color="border-green-500/40">
        <div className="flex justify-center">
          <Node icon="🔐" label="wg0" sub="10.10.99.1/24" color="bg-green-900/60 border-green-500/50" />
        </div>
        <div className="mt-2 text-[9px] font-mono text-green-400 text-center">
          iptables MASQUERADE → ens18 → Internet
        </div>
      </Section>
    </div>
  );
}

/* ─── OSPF Routing Diagram ──────────────────────────────── */
export function OspfDiagram() {
  return (
    <div className="space-y-3">
      {/* Topology row */}
      <Section title="OSPF Area 0 — 3-Router Topology" color="border-cyan-500/40">
        <div className="flex items-center justify-center gap-1 flex-wrap">
          {/* Router A */}
          <div className="flex flex-col items-center gap-1">
            <Node icon="🔀" label="Router-A" sub="lo: 1.1.1.1/32" color="bg-cyan-900/60 border-cyan-500/50" />
            <span className="text-[9px] font-mono text-slate-400">10.0.12.1/30</span>
          </div>

          {/* Link A-B */}
          <div className="flex flex-col items-center text-[9px] font-mono text-slate-500 mx-1">
            <span>vmbr2</span>
            <div className="flex items-center gap-0.5">
              <div className="h-px w-8 bg-cyan-500/40" />
              <span className="text-cyan-400">OSPF</span>
              <div className="h-px w-8 bg-cyan-500/40" />
            </div>
          </div>

          {/* Router B */}
          <div className="flex flex-col items-center gap-1">
            <Node icon="🔀" label="Router-B" sub="lo: 2.2.2.2/32" color="bg-teal-900/60 border-teal-500/50" />
            <span className="text-[9px] font-mono text-slate-400">middle node</span>
          </div>

          {/* Link B-C */}
          <div className="flex flex-col items-center text-[9px] font-mono text-slate-500 mx-1">
            <span>vmbr3</span>
            <div className="flex items-center gap-0.5">
              <div className="h-px w-8 bg-cyan-500/40" />
              <span className="text-cyan-400">OSPF</span>
              <div className="h-px w-8 bg-cyan-500/40" />
            </div>
          </div>

          {/* Router C */}
          <div className="flex flex-col items-center gap-1">
            <Node icon="🔀" label="Router-C" sub="lo: 3.3.3.3/32" color="bg-cyan-900/60 border-cyan-500/50" />
            <span className="text-[9px] font-mono text-slate-400">10.0.23.2/30</span>
          </div>
        </div>
      </Section>

      {/* Result box */}
      <div className="rounded-xl border border-cyan-500/20 bg-cyan-900/10 p-3 text-[10px] font-mono space-y-1">
        <div className="text-cyan-400 font-semibold mb-1">Router-A: show ip route ospf</div>
        <div className="text-slate-300">O 2.2.2.2/32  [110/1] via 10.0.12.2 <span className="text-green-400">✓</span></div>
        <div className="text-slate-300">O 3.3.3.3/32  [110/2] via 10.0.12.2 <span className="text-green-400">✓</span></div>
        <div className="text-slate-300">O 10.0.23.0/30 [110/2] via 10.0.12.2 <span className="text-green-400">✓</span></div>
        <div className="text-slate-500 mt-1">No static routes configured — all learned via OSPF</div>
      </div>
    </div>
  );
}

/* ─── BGP Routing Diagram ───────────────────────────────── */
export function BgpDiagram() {
  return (
    <div className="space-y-3">
      {/* AS topology */}
      <Section title="eBGP — 3 Autonomous Systems" color="border-purple-500/40">
        <div className="flex items-center justify-center gap-2 flex-wrap">
          {/* AS 65001 */}
          <div className="flex flex-col items-center gap-1">
            <div className="text-[9px] font-mono text-blue-400 font-semibold">AS 65001</div>
            <Node icon="🌍" label="Router-A" sub="lo: 1.1.1.1/32" color="bg-blue-900/60 border-blue-500/50" />
          </div>

          {/* eBGP link A-B */}
          <div className="flex flex-col items-center text-[9px] font-mono text-slate-500">
            <div className="flex items-center gap-0.5">
              <div className="h-px w-6 bg-purple-500/40" />
              <span className="text-purple-400 text-[8px]">eBGP</span>
              <div className="h-px w-6 bg-purple-500/40" />
            </div>
            <span className="text-slate-600">10.0.12.0/30</span>
          </div>

          {/* AS 65002 */}
          <div className="flex flex-col items-center gap-1">
            <div className="text-[9px] font-mono text-purple-400 font-semibold">AS 65002</div>
            <Node icon="🌍" label="Router-B" sub="lo: 2.2.2.2/32" color="bg-purple-900/60 border-purple-500/50" />
          </div>

          {/* eBGP link B-C */}
          <div className="flex flex-col items-center text-[9px] font-mono text-slate-500">
            <div className="flex items-center gap-0.5">
              <div className="h-px w-6 bg-purple-500/40" />
              <span className="text-purple-400 text-[8px]">eBGP</span>
              <div className="h-px w-6 bg-purple-500/40" />
            </div>
            <span className="text-slate-600">10.0.23.0/30</span>
          </div>

          {/* AS 65003 */}
          <div className="flex flex-col items-center gap-1">
            <div className="text-[9px] font-mono text-orange-400 font-semibold">AS 65003</div>
            <Node icon="🌍" label="Router-C" sub="lo: 3.3.3.3/32" color="bg-orange-900/60 border-orange-500/50" />
          </div>
        </div>
      </Section>

      {/* BGP table */}
      <div className="rounded-xl border border-purple-500/20 bg-purple-900/10 p-3 text-[10px] font-mono space-y-1">
        <div className="text-purple-400 font-semibold mb-1">Router-A: show ip bgp</div>
        <div className="text-slate-300">
          <span className="text-blue-400">1.1.1.1/32</span>  Path: <span className="text-green-400">i</span>  <span className="text-slate-500">(local origin)</span>
        </div>
        <div className="text-slate-300">
          <span className="text-purple-400">2.2.2.2/32</span>  Path: <span className="text-yellow-400">65002 i</span>  <span className="text-slate-500">(1-hop)</span>
        </div>
        <div className="text-slate-300">
          <span className="text-orange-400">3.3.3.3/32</span>  Path: <span className="text-orange-400">65002 65003 i</span>  <span className="text-slate-500">(transit)</span>
        </div>
        <div className="text-slate-500 mt-1">RFC 8212: route-map ALLOW-ALL applied on all sessions</div>
      </div>
    </div>
  );
}

/* ─── Index map ─────────────────────────────────────────── */
import React from "react";

const diagramMap: Record<string, React.ReactNode> = {
  "active-directory": <ADDiagram />,
  "pfsense-vlan":     <PfsenseDiagram />,
  "wireguard-vpn":    <WireGuardDiagram />,
  "ospf-routing":     <OspfDiagram />,
  "bgp-routing":      <BgpDiagram />,
};

export function getLabDiagram(labId: string): React.ReactNode | null {
  return diagramMap[labId] ?? null;
}
