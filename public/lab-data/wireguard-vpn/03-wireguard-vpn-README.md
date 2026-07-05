# Homelab Project: WireGuard Remote Access VPN

> Personal homelab project implementing a WireGuard VPN server for secure remote access into the home network, built as a standalone Ubuntu server rather than a pfSense package, to practice native Linux VPN configuration end-to-end.

## 📋 Overview

This project sets up a WireGuard VPN server on a dedicated Ubuntu VM, exposed to the internet through router port forwarding, allowing a remote Windows client to establish a full-tunnel VPN connection from outside the home network (tested over mobile data). Focused on Remote Access VPN only (Site-to-Site was scoped out to fit the timeline).

## 🏗️ Architecture

```
Windows Client (remote, e.g. on mobile data)
   │  WireGuard tunnel (UDP 51820)
   ▼
Home Router (Public IP: 182.53.180.190)
   │  Port Forward: UDP 51820 → 192.168.1.9
   ▼
WireGuard Server VM (Ubuntu, on vmbr0 / home network)
   IP: 192.168.1.9
   wg0 interface: 10.10.99.1/24
   │
   └── NAT (MASQUERADE) → routes client traffic out via ens18 to the internet
```

**Design decision:** Deployed WireGuard as a standalone Ubuntu server rather than the pfSense WireGuard package, to work with native `wg`/`wg-quick` tooling directly instead of a GUI wrapper, and kept it on `vmbr0` only (not bridged into the pfSense lab network) to keep this lab self-contained.

## 🛠️ Tech Stack

| Component | Technology |
|---|---|
| Hypervisor | Proxmox VE |
| VPN Server OS | Ubuntu Server |
| VPN Software | WireGuard (native `wg`/`wg-quick`) |
| Client | WireGuard for Windows |
| Router | ZTE (port forwarding) |

## ✅ What Was Implemented

### 1. Server Setup
- Deployed a lightweight Ubuntu VM (1-2 core, 1-2GB RAM) on `vmbr0`
- Enabled IPv4 forwarding via `/etc/sysctl.d/` (see Problems section)
- Generated server key pair with `wg genkey` / `wg pubkey`

### 2. WireGuard Interface Configuration

```ini
[Interface]
PrivateKey = <server private key>
Address = 10.10.99.1/24
ListenPort = 51820
PostUp = iptables -t nat -A POSTROUTING -o ens18 -j MASQUERADE; iptables -A FORWARD -i wg0 -j ACCEPT; iptables -A FORWARD -o wg0 -j ACCEPT
PostDown = iptables -t nat -D POSTROUTING -o ens18 -j MASQUERADE; iptables -D FORWARD -i wg0 -j ACCEPT; iptables -D FORWARD -o wg0 -j ACCEPT

[Peer]
PublicKey = <client public key>
AllowedIPs = 10.10.99.2/32
```

- Enabled and started via `systemctl enable/start wg-quick@wg0`

### 3. Client Configuration (Windows)
- Generated a separate key pair for the client
- Full-tunnel config (`AllowedIPs = 0.0.0.0/0`) so all client traffic routes through the VPN — chosen specifically to make the test verifiable (public IP visibly changes to the home IP)
- Imported config directly into WireGuard for Windows

### 4. Router Port Forwarding
- Forwarded UDP port `51820` on the router's WAN to the WireGuard server's LAN IP (`192.168.1.9`)
- Identified home public IP (`182.53.180.190`) to use as the client's `Endpoint`

### 5. Verification
- Confirmed handshake and active tunnel via `wg show` on the server (endpoint, latest handshake, transfer counters populated)
- Confirmed `ping 10.10.99.1` succeeded from the Windows client through the tunnel
- Confirmed full-tunnel routing by checking public IP from the client — it returned the home network's public IP (`182.53.180.190`), proving all client traffic was correctly routed through the VPN and NAT'd out to the internet

## 🐛 Problems Encountered & Solutions

### Problem 1: `/etc/sysctl.conf` Did Not Exist
- **Symptom:** `sed` command to enable IP forwarding failed with `No such file or directory`
- **Cause:** This particular Ubuntu install didn't ship with a populated `/etc/sysctl.conf` (only a README file existed in `/etc/sysctl.d/`)
- **Solution:** Created a dedicated config file instead — `echo 'net.ipv4.ip_forward=1' | sudo tee /etc/sysctl.d/99-wireguard.conf`, then applied with `sysctl -p` targeting that file directly

### Problem 2: Config Files Left With Placeholder Values (twice)
- **Symptom:** `wg-quick@wg0.service` failed to start with `Key is not the correct length or format: '<SERVER_PRIVATE_KEY>'` — the same mistake later recurred in the client config file, where the placeholder `<CLIENT1_PRIVATE_KEY>` was never replaced with the actual generated key
- **Cause:** Manually copy-pasting a config template into `nano` without substituting the placeholder text for the actual key value
- **Solution:** Switched to a one-shot heredoc command that reads the key file directly and injects it into the config, removing the manual-substitution step entirely:
  ```bash
  sudo bash -c "cat > /etc/wireguard/wg0.conf" << EOF
  [Interface]
  PrivateKey = $(sudo cat /etc/wireguard/server_private.key)
  ...
  EOF
  ```

### Problem 3: DNS/Internet Access Failed Through the Tunnel Despite a Successful Handshake
- **Symptom:** `ping 10.10.99.1` (the VPN server itself) succeeded from the client, but `curl ifconfig.me` failed with "The remote name could not be resolved"
- **Diagnosis:** The handshake and tunnel were working correctly (confirmed via `wg show`), and IP forwarding was enabled at the kernel level — but traffic arriving from the VPN client had no NAT rule to translate its source address (`10.10.99.x`) before being routed out the WAN-facing interface (`ens18`). Kernel-level forwarding alone doesn't handle address translation; that requires an explicit NAT rule.
- **Solution:** Added `iptables -t nat -A POSTROUTING -o ens18 -j MASQUERADE` plus explicit FORWARD accept rules for `wg0`, then moved these into the WireGuard config's `PostUp`/`PostDown` directives so they're applied automatically on every tunnel start/stop
- **Lesson:** A working handshake only proves the tunnel itself is up — it says nothing about whether traffic can actually be routed past the VPN server to the wider internet. Ping to the VPN server's own tunnel IP tests the tunnel; testing NAT requires reaching something beyond the server.

### Problem 4: PowerShell's `curl` Alias Produced Confusing Output
- **Symptom:** `curl ifconfig.me` on Windows returned a full parsed HTML object (`StatusCode`, `Content`, `ParsedHtml`, etc.) instead of a plain IP address
- **Cause:** In Windows PowerShell, `curl` is aliased to `Invoke-WebRequest`, which parses the response as a structured object rather than returning raw text like the Linux `curl` binary
- **Solution:** Used `(Invoke-WebRequest -Uri "https://ifconfig.me" -UseBasicParsing).Content` to extract just the response body, or checked the value directly in a browser instead

## 🎯 Skills Demonstrated

- WireGuard VPN configuration from scratch using native command-line tools (`wg`, `wg-quick`), without a GUI wrapper
- Public/private key pair generation and peer-based trust configuration
- Linux packet forwarding and NAT (`iptables MASQUERADE`) — and understanding the distinction between routing (kernel forwarding) and address translation (NAT)
- Router-level port forwarding configuration for self-hosted services
- End-to-end verification methodology: distinguishing "tunnel is up" from "tunnel actually routes traffic usefully," using layered tests (ping to server vs. ping/curl to the wider internet)
- Recognizing platform-specific tooling differences (PowerShell `curl` alias vs. native Linux `curl`)

## 🔜 Next Steps

- [ ] Docker + Nginx portfolio deployment
- [ ] Prometheus/Grafana monitoring

---

*See the [main repo README](../README.md), [Active Directory lab](../01-active-directory/), and [pfSense + VLAN lab](../02-pfsense-vlan/) for other components.*
