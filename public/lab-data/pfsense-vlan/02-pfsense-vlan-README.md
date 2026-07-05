# Homelab Project: pfSense Firewall + VLAN Segmentation

> Personal homelab project implementing a firewall/router with VLAN network segmentation using pfSense CE on Proxmox VE, running parallel to the existing Active Directory lab.

## 📋 Overview

This project sets up pfSense Community Edition as a virtual firewall/router with WAN/LAN separation, outbound NAT, and VLAN-based network segmentation. Run as an isolated parallel network alongside the existing AD lab to avoid disrupting the already-stable Domain Controller setup.

## 🏗️ Architecture

```
Home Router (192.168.1.1)
   │
   ├── vmbr0 (existing home network) ── DC01, Client01 (192.168.1.0/24) — untouched
   │
   └── pfSense VM
       ├── WAN (em0) → vmbr0 → DHCP from home router → 192.168.1.4/24
       └── LAN (em1) → vmbr1 (internal-only bridge, no physical NIC) → 10.10.10.1/24
           │
           ├── OPT1 / VLAN10-Servers → 10.10.20.1/24 (tagged VLAN, id 10)
           └── OPT2 / VLAN20-Clients → 10.10.30.1/24 (tagged VLAN, id 20)

Test client: Ubuntu VM (multi-homed)
   ├── ens18 → vmbr1 (untagged LAN)     → 10.10.10.101
   ├── ens19 → vmbr0 (home network)     → 192.168.1.9
   └── ens20 → vmbr1 (VLAN10 tagged via ens20.10) → 10.10.20.50
```

**Design decision:** pfSense runs as a fully parallel network (its own internal bridge, `vmbr1`, with no physical NIC) rather than sitting in front of the existing AD lab. This kept the stable DC01/Client01 setup untouched while still allowing full firewall/VLAN experimentation.

## 🛠️ Tech Stack

| Component | Technology |
|---|---|
| Hypervisor | Proxmox VE |
| Firewall/Router | pfSense CE 2.8.1 |
| Test/Jump Host | Ubuntu Server (multi-homed VM) |
| VLAN Tagging | Linux `vlan` package (802.1Q) at guest OS level |
| Management Access | SSH local port forwarding (tunnel to pfSense Web GUI) |

## ✅ What Was Implemented

### 1. Network Isolation Setup
- Created `vmbr1`, an internal-only Proxmox Linux Bridge with no physical NIC bound to it, keeping the pfSense LAN fully isolated from the home network
- pfSense WAN (`em0`) bridged to `vmbr0` (existing home network) for internet access via DHCP

### 2. pfSense Installation
- Installed pfSense CE 2.8.1 via ISO on a lightweight VM (1-2 core, 1-2GB RAM, SATA disk, E1000 NICs)
- Assigned WAN = em0, LAN = em1 during setup
- Changed default LAN IP from `192.168.1.1` to `10.10.10.1` to avoid conflicting with the home router

### 3. Firewall Rules
- Verified the default "allow LAN to any" rule
- Created and tested a temporary block rule (LAN → 1.1.1.1:443) to confirm rule ordering and enforcement, then removed it
- Learned that rules are evaluated top-to-bottom, first match wins

### 4. NAT (Outbound)
- Verified Automatic Outbound NAT (pfSense default) correctly translates LAN traffic (`10.10.10.0/24`) to the WAN address for internet access

### 5. VLAN Segmentation

| VLAN | Interface | Subnet | Purpose |
|---|---|---|---|
| VLAN10 | OPT1 (em1.10) | 10.10.20.0/24 | Servers (simulated) |
| VLAN20 | OPT2 (em1.20) | 10.10.30.0/24 | Clients (simulated) |

- VLANs created via pfSense's Interfaces → VLANs, then assigned as OPT1/OPT2
- Added firewall rules on OPT1 to allow traffic (required — see Problems section)
- Verified VLAN-tagged traffic reaches its corresponding pfSense gateway correctly

## 🐛 Problems Encountered & Solutions

### Problem 1: Proxmox Bridge Rejected VLAN Tag on VM Network Device
- **Symptom:** VM failed to start with error: `no physical interface on bridge 'vmbr1'... network script /usr/libexec/qemu-server/pve-bridge failed with status 65280`
- **Cause:** `vmbr1` was deliberately created with no physical NIC attached (to keep the lab network isolated). Assigning a VLAN Tag at the Proxmox hardware level requires a physical interface to build the VLAN sub-interface on — which doesn't exist on an internal-only bridge.
- **Solution:** Removed the VLAN Tag from the Proxmox network device config, added the NIC as a plain untagged interface instead, then performed VLAN tagging at the **guest OS level** (inside Ubuntu) using the `vlan` package and `ip link add ... type vlan id <N>` — the Linux bridge simply passes tagged frames through untouched since it isn't VLAN-aware.

### Problem 2: pfSense CE vs Plus Subscription Prompt
- **Symptom:** Installer showed "This device does not have an active pfSense Plus subscription"
- **Cause:** The Netgate installer defaults toward pfSense Plus (subscription-based); this is expected when installing the free Community Edition
- **Solution:** Selected "Install CE" to proceed with the free Community Edition software

### Problem 3: SSH Local Port Forwarding Run From the Wrong Machine
- **Symptom:** After running `ssh -L 8443:10.10.10.1:443 user@host` on the Ubuntu jump box itself (via Proxmox console), the browser on the Windows host couldn't reach `https://localhost:8443`
- **Cause:** SSH local port forwarding (`-L`) opens the forwarded port **on the machine where the ssh command is run** — not on the remote server. Running it from inside Ubuntu (which has no browser) opened the tunnel on Ubuntu, not on the Windows machine trying to browse to it.
- **Solution:** Ran the identical `ssh -L` command from **Windows PowerShell** on the host machine instead, so the forwarded port existed on the machine with a browser

### Problem 4: VLAN-Tagged Traffic Timed Out Despite Correct Tagging
- **Symptom:** `ping 10.10.20.1` (pfSense OPT1/VLAN10 gateway) timed out completely, while pinging OPT2 and the original LAN gateway succeeded
- **Diagnosis:** Newly created OPT interfaces in pfSense do **not** inherit any firewall rules by default — unlike the LAN interface, which ships with a "Default allow LAN to any" rule pre-configured. Every packet arriving on a new OPT interface is silently dropped until an explicit allow rule is added.
- **Solution:** Added a Pass rule on Firewall → Rules → OPT1 (and OPT2) permitting traffic from the VLAN subnet
- **Lesson:** pfSense treats every interface as its own security zone with deny-by-default behavior — LAN's permissive default is a convenience exception, not the general rule

### Problem 5: SSH Tunnel Host IP Changed After VM Reboot
- **Symptom:** A previously working SSH tunnel command failed with `Connection timed out` after the Ubuntu jump box was rebooted
- **Cause:** The jump box's home-network-facing interface (`ens19`) obtained its IP via DHCP rather than a static assignment, so its address changed across the reboot
- **Solution:** Re-checked current IP via `ip a` through the Proxmox console directly, then updated the SSH command with the new address

## 🎯 Skills Demonstrated

- pfSense firewall installation and configuration (WAN/LAN, NAT, firewall rules)
- VLAN segmentation using 802.1Q tagging, including working around hypervisor-level limitations by tagging at the guest OS layer
- Understanding of default-deny vs default-allow behavior across firewall interface zones
- SSH tunneling / local port forwarding — including correcting a directional misunderstanding of where the forwarded port is exposed
- Network isolation design (parallel lab network vs. integrating with existing production-like infrastructure)
- Systematic troubleshooting using ping, firewall rule ordering tests, and interface-level diagnostics

## 🔜 Next Steps

- [ ] WireGuard VPN (remote access into this network)
- [ ] Docker + Nginx portfolio deployment
- [ ] Prometheus/Grafana monitoring

---

*See the [main repo README](../README.md) and [Active Directory lab](../01-active-directory/) for other components.*
