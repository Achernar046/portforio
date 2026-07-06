# Homelab Project: OSPF Routing Lab (FRRouting)

> A personal home lab project featuring a three-router OSPF topology—built using FRRouting on Proxmox VE—to demonstrate dynamic internal routing, route summarization, and failure detection; this setup serves as a foundation for network engineering-focused labs following the completion of the infrastructure development.

## 📋 Overview

This project builds a 3-node router topology (Router-A — Router-B — Router-C) running FRRouting, a production-grade open-source routing suite (used in real production networks, e.g. by Meta), to demonstrate OSPF (Open Shortest Path First) dynamically learning routes to non-directly-connected networks — without any static routes configured.

## 🏗️ Architecture

```
                vmbr2                       vmbr3
              (Link A-B)                  (Link B-C)
Router-A ───────────────────  Router-B  ───────────────────  Router-C
10.0.12.1/30              10.0.12.2/30  10.0.23.1/30      10.0.23.2/30
(Area 0)                                                    (Area 0)

Loopbacks (simulate networks "behind" each router):
Router-A: lo → 1.1.1.1/32
Router-B: lo → 2.2.2.2/32
Router-C: lo → 3.3.3.3/32

Management (vmbr0, DHCP — used for SSH access from the host machine):
All 3 routers also have a management-facing NIC on the home network
```

Each point-to-point link uses a `/30` subnet, following real-world network engineering convention for links with exactly two usable addresses. `vmbr2` and `vmbr3` are internal-only Proxmox bridges (no physical NIC attached) acting as "virtual cables" between router pairs — the same pattern used for the pfSense LAN in an earlier lab.

## 🛠️ Tech Stack

| Component | Technology |
|---|---|
| Hypervisor | Proxmox VE |
| Router OS | Ubuntu Server (minimal install) |
| Routing Software | FRRouting (FRR) — native, not a simulator |
| Management CLI | `vtysh` (Cisco IOS-style syntax) |

**Why FRR instead of Cisco Packet Tracer:** Packet Tracer is an educational simulator with Cisco-like syntax but doesn't run real routing logic. FRR is production routing software used in real networks — configuring it here means working with the actual OSPF implementation and its real convergence/failure behavior, not a simplified teaching model.

## ✅ What Was Implemented

### 1. Network Topology Setup
- Created two additional internal-only Proxmox bridges (`vmbr2`, `vmbr3`), each with no physical NIC, to serve as isolated point-to-point links between router pairs
- Built 3 lightweight Ubuntu VMs, each with 2-3 NICs depending on position in the topology (Router-B, as the middle node, has 3: two for the router links plus one for management)

### 2. IP Addressing
- Static IPs configured via Netplan on each router-facing interface, following `/30` point-to-point convention
- Loopback addresses (`1.1.1.1`, `2.2.2.2`, `3.3.3.3`) added to simulate a network "owned" by each router

### 3. FRR Installation and OSPF Configuration
- Installed FRR via `apt`, enabled the `ospfd` daemon in `/etc/frr/daemons`
- Configured OSPF on each router via `vtysh`, advertising each router's directly connected networks and loopback into Area 0

### 4. Verification
- Confirmed OSPF neighbor adjacency reached **Full** state on all links (`show ip ospf neighbor`)
- Confirmed Router-A's routing table (`show ip route ospf`) contained routes to Router-C's loopback and link subnet — networks it has no direct connection to — learned entirely through OSPF
- Confirmed end-to-end reachability: `ping` from Router-A to Router-C's loopback succeeded with 0% packet loss

### 5. Failure Detection Test
- Brought down Router-A's link interface (`ip link set ens18 down`) to simulate a link failure
- Confirmed OSPF detected the outage via its Dead Timer and removed the affected neighbor and all dependent routes from the routing table
- Brought the interface back up and confirmed OSPF re-established the neighbor relationship and restored the routes automatically — no manual intervention required

## 🐛 Problems Encountered & Solutions

### Problem 1: Ping Between Non-Adjacent Routers Failed Despite a Correct Routing Table
- **Symptom:** `show ip route ospf` on Router-A correctly showed routes to Router-C's loopback and link subnet, but `ping` to those addresses still failed with 100% packet loss
- **Diagnosis:** Checked OSPF neighbor state and routing tables on all three routers — everything was correct on the control-plane (routing) side. The issue turned out to be at the kernel level: `sysctl net.ipv4.ip_forward` was `0` (the Ubuntu default) on all three VMs, especially critical on Router-B, which sits in the middle of the path.
- **Solution:** Enabled IP forwarding via `/etc/sysctl.d/99-routing.conf` on all three routers
- **Lesson:** A correct routing table only describes *where* FRR believes traffic should go — it does not, by itself, make the Linux kernel actually forward packets between interfaces. Routing (control plane, managed by FRR) and forwarding (data plane, managed by the kernel) are separate concerns that both have to be correctly configured. This is the same category of issue encountered with WireGuard's NAT/MASQUERADE requirement in an earlier lab — routing/tunnel configuration succeeding doesn't guarantee packets are actually forwarded end-to-end.

## 🎯 Skills Demonstrated

- OSPF configuration and verification using production routing software (FRR), including area design, neighbor states, and Cisco-style CLI syntax via `vtysh`
- Point-to-point link addressing convention (`/30` subnets) and loopback-based network simulation
- Diagnosing routing (control plane) vs. forwarding (data plane) issues separately — recognizing that a correct routing table doesn't guarantee packet delivery
- Failure detection and self-healing behavior of a dynamic routing protocol, verified through deliberate link failure testing
- Proxmox internal-bridge networking to build isolated multi-node lab topologies without physical hardware

