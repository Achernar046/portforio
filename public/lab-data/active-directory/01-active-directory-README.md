# Homelab Project: Active Directory Infrastructure

> Personal homelab project simulating enterprise IT infrastructure using Proxmox VE, Windows Server, and Active Directory Domain Services.

## 📋 Overview

This project sets up a small-scale enterprise network using Proxmox VE as the hypervisor, with a Windows Server 2022 Domain Controller managing centralized authentication, DNS, DHCP, and Group Policy for a domain-joined Windows client. Built to develop hands-on skills relevant to Infrastructure/System/Network Engineer roles.

## 🏗️ Architecture

```
Internet
   |
[Router/Gateway - 192.168.1.1]
   |
   ├── DC01 (Windows Server 2022)
   │   IP: 192.168.1.99 (static)
   │   Roles: AD DS, DNS, DHCP
   │   Domain: lab.local
   │   NetBIOS: LAB
   │
   └── Client01 (Windows 10/11 Enterprise Evaluation)
       IP: 192.168.1.20 (static)
       Domain-joined: LAB\Client01
       DNS points to: 192.168.1.99
```

Both VMs run on Proxmox VE with UEFI (OVMF) BIOS, SATA disk controllers, and Intel E1000 network adapters (chosen for driver compatibility — see Problems section).

## 🛠️ Tech Stack

| Component | Technology |
|---|---|
| Hypervisor | Proxmox VE |
| Domain Controller OS | Windows Server 2022 (Desktop Experience) |
| Client OS | Windows 10/11 Enterprise Evaluation |
| Directory Service | Active Directory Domain Services |
| DNS/DHCP | Windows Server built-in roles |
| Policy Management | Group Policy Objects (GPO) |
| Remote Access | RDP (for management) |

## ✅ What Was Implemented

### 1. Domain Controller Setup
- Installed Windows Server 2022 on Proxmox VM (UEFI, SATA disk, E1000 NIC)
- Configured static IP and promoted server to Domain Controller, creating new forest `lab.local`
- AD DS installation automatically included DNS role
- Configured DHCP scope for the lab network
- Verified health with `dcdiag /q` and `nslookup`

### 2. Organizational Unit Structure
```
lab.local
└── lab (OU)
    ├── IT
    ├── User
    └── Computers
```
Created via PowerShell (`New-ADOrganizationalUnit`) after initial GUI attempt produced duplicate/misnamed OUs — cleaned up using `Remove-ADOrganizationalUnit` after disabling accidental-deletion protection.

### 3. Users and Groups

| User | SamAccountName | Group Membership |
|---|---|---|
| John Doe | jdoe | Staff, IT-Admins |
| Mary Smith | msmith | Staff |
| Alex Wilson | awilson | Staff |

Created via PowerShell loop (`New-ADUser`, `New-ADGroup`, `Add-ADGroupMember`), with `-ChangePasswordAtLogon $true` enforced on all accounts.

### 4. Client Domain Join
- Joined Windows client to `lab.local` domain via Settings → System → Domain or workgroup
- Verified login using `LAB\jdoe` credentials with forced password change on first logon

### 5. Group Policy Objects (GPO)

| GPO Name | Scope | Effect | Verified |
|---|---|---|---|
| Set-Desktop-Wallpaper | User Config → OU `User` | Forces custom wallpaper (`\\lab.local\NETLOGON\wallpaper.jpg`) on login | ✅ |
| Default Domain Policy (edited) | Domain root | Minimum password length raised to 10, complexity enforced | ✅ Rejected weak password via `Set-ADAccountPassword` test |
| Restrict-ControlPanel | User Config → OU `User` | Blocks Control Panel/Settings access | ✅ Confirmed error: "This operation has been cancelled due to restrictions in effect on this computer" |

## 🐛 Problems Encountered & Solutions

### Problem 1: VirtIO Disk Driver Not Recognized During Installation
- **Symptom:** Windows Setup showed "We couldn't find any drives. To get a storage driver, click Load driver."
- **Cause:** VirtIO/SCSI disk controllers require a driver not built into stock Windows ISOs
- **Solution:** Switched the VM's disk bus from VirtIO/SCSI to **SATA**, which Windows recognizes natively — avoided the need to inject virtio-win drivers mid-install

### Problem 2: Network Adapter Not Detected
- **Symptom:** Network Connections showed "This folder is empty" — no adapters visible at all
- **Cause:** Same root cause as Problem 1 — the VirtIO network adapter model has no built-in Windows driver
- **Solution:** Changed the VM's network device model from VirtIO to **Intel E1000**, which uses a driver already included in Windows

### Problem 3: Domain Promotion Boot/Console Issues
- **Symptom:** VM showed "Press any key to boot from CD or DVD" with a very short timeout, frequently missed, causing "No bootable option or device was found"
- **Solution:** Learned to click into the console and press a key immediately on reset; verified boot order and ISO attachment in Proxmox as a fallback check

### Problem 4: Static IP Address Conflict on the Domain Controller
- **Symptom:** DNS queries from the client (`nslookup`, `Test-NetConnection` on port 53) timed out even though ICMP ping succeeded. RDP to the DC also failed intermittently.
- **Diagnosis process:**
  1. Checked Windows Firewall rules on the DC (`Get-NetFirewallRule`) — all inbound rules for DNS and RDP were already enabled, ruling out firewall as the cause
  2. Ran `netstat -an | findstr ":53"` on the DC and found the DNS service was listening on a **169.254.x.x (APIPA)** address instead of the intended static IP
  3. Ran `Get-NetIPAddress` and found the static IP was flagged with **`AddressState: Duplicate`** — Windows had detected another device on the network already using that IP, and silently fell back to an auto-assigned APIPA address instead of binding services to the conflicting IP
- **Solution:** Verified the replacement IP was unused (`ping` returned "Destination host unreachable" from the gateway, confirming no host held it), then reassigned the DC to `192.168.1.99` using `Remove-NetIPAddress` / `New-NetIPAddress`, and updated the client's DNS setting to match
- **Lesson:** `ping` succeeding is not sufficient evidence that a service is reachable — `netstat` and `Test-NetConnection` at the TCP/port level were what actually revealed the real fault

### Problem 5: Domain Join Failed on Windows 10 Home Edition
- **Symptom:** System Properties displayed: *"You cannot join a computer running this edition of Windows 10 to a domain."*
- **Cause:** Domain Join is a feature deliberately excluded from Windows Home editions (Pro/Enterprise/Education only)
- **Solution:** Confirmed edition via `Get-ComputerInfo | Select WindowsProductName, WindowsEditionId` (showed "Windows 10 Home / Core"), then rebuilt the client VM using a **Windows Enterprise Evaluation ISO**, which supports domain join and is free for lab/testing use

### Problem 6: GPO Setting Applied to Wrong Configuration Node
- **Symptom:** "Desktop Wallpaper" setting was not found under `Computer Configuration → Administrative Templates → System`
- **Cause:** Desktop Wallpaper is a **User Configuration** policy, not a Computer Configuration policy — initially searched in the wrong branch
- **Solution:** Located the correct path (`User Configuration → Policies → Administrative Templates → Desktop → Desktop`) and re-linked the GPO to an OU containing **user** accounts rather than computer accounts, since GPO scope must match the object type the policy targets

### Problem 7: Password Policy GPO Had No Effect
- **Cause:** Password Policy is a special case in Active Directory — it only takes effect when configured on **Default Domain Policy** at the domain root. Creating a new GPO and linking it to an OU has no effect on password requirements, regardless of settings configured.
- **Solution:** Edited the existing "Default Domain Policy" directly rather than creating a separate GPO

## 🎯 Skills Demonstrated

- Windows Server 2022 installation and AD DS/DNS/DHCP role configuration
- Active Directory object management via PowerShell (`New-ADUser`, `New-ADGroup`, `New-ADOrganizationalUnit`, `Move-ADObject`)
- Group Policy design, correct scoping (Computer vs. User configuration), and domain-level password policy behavior
- Network troubleshooting methodology: distinguishing ICMP reachability from actual service/port reachability, diagnosing IP address conflicts
- Proxmox VE VM hardware configuration (BIOS mode, disk bus, NIC model) and driver compatibility troubleshooting
- Understanding of Windows edition licensing constraints relevant to enterprise deployment

## 🔜 Next Steps

- [ ] pfSense firewall + VLAN segmentation
- [ ] WireGuard VPN
- [ ] Docker + Nginx portfolio deployment
- [ ] Prometheus/Grafana monitoring
