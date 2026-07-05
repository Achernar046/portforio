# โปรเจกต์โฮมแล็บ: pfSense Firewall + VLAN Segmentation

> โปรเจกต์โฮมแล็บส่วนตัวที่ติดตั้ง Firewall/Router พร้อมการแบ่งเครือข่ายด้วย VLAN โดยใช้ pfSense CE บน Proxmox VE ทำงานควบคู่กับแล็บ Active Directory ที่มีอยู่

## 📋 ภาพรวม

โปรเจกต์นี้ตั้งค่า pfSense Community Edition เป็น Virtual Firewall/Router พร้อม WAN/LAN separation, Outbound NAT และการแบ่งเครือข่ายด้วย VLAN โดยรันเป็นเครือข่ายแยกคู่ขนานกับแล็บ AD ที่มีอยู่ เพื่อไม่กระทบ Domain Controller Setup ที่ Stable แล้ว

## 🏗️ สถาปัตยกรรม

```
Home Router (192.168.1.1)
   │
   ├── vmbr0 (เครือข่ายบ้าน) ── DC01, Client01 (192.168.1.0/24) — ไม่ถูกแตะต้อง
   │
   └── pfSense VM
       ├── WAN (em0) → vmbr0 → DHCP จาก home router → 192.168.1.4/24
       └── LAN (em1) → vmbr1 (internal-only bridge, ไม่มี physical NIC) → 10.10.10.1/24
           │
           ├── OPT1 / VLAN10-Servers → 10.10.20.1/24 (tagged VLAN, id 10)
           └── OPT2 / VLAN20-Clients → 10.10.30.1/24 (tagged VLAN, id 20)

Test client: Ubuntu VM (multi-homed)
   ├── ens18 → vmbr1 (untagged LAN)     → 10.10.10.101
   ├── ens19 → vmbr0 (home network)     → 192.168.1.9
   └── ens20 → vmbr1 (VLAN10 tagged via ens20.10) → 10.10.20.50
```

**การตัดสินใจออกแบบ:** pfSense รันเป็นเครือข่ายแยกอิสระ (มี internal bridge `vmbr1` เป็นของตนเอง ไม่มี physical NIC) แทนที่จะวางหน้าแล็บ AD ที่มีอยู่ วิธีนี้ทำให้ setup ของ DC01/Client01 จากวันที่ 1-2 ไม่ถูกกระทบ ในขณะที่ยังสามารถทดลอง Firewall/VLAN ได้เต็มที่

## 🛠️ เทคโนโลยีที่ใช้

| Component | เทคโนโลยี |
|---|---|
| Hypervisor | Proxmox VE |
| Firewall/Router | pfSense CE 2.8.1 |
| Test/Jump Host | Ubuntu Server (multi-homed VM) |
| VLAN Tagging | Linux `vlan` package (802.1Q) ที่ระดับ Guest OS |
| Management Access | SSH local port forwarding (tunnel ไปยัง pfSense Web GUI) |

## ✅ สิ่งที่ทำสำเร็จ

### 1. ตั้งค่า Network Isolation
- สร้าง `vmbr1` — Proxmox Linux Bridge แบบ internal-only ที่ไม่มี physical NIC ผูกอยู่ ทำให้ pfSense LAN แยกจากเครือข่ายบ้านโดยสมบูรณ์
- pfSense WAN (`em0`) bridge กับ `vmbr0` (เครือข่ายบ้าน) สำหรับ internet access ผ่าน DHCP

### 2. ติดตั้ง pfSense
- ติดตั้ง pfSense CE 2.8.1 ผ่าน ISO บน VM ขนาดเล็ก (1-2 core, 1-2GB RAM, SATA disk, E1000 NICs)
- กำหนด WAN = em0, LAN = em1 ระหว่างการติดตั้ง
- เปลี่ยน Default LAN IP จาก `192.168.1.1` เป็น `10.10.10.1` เพื่อหลีกเลี่ยง conflict กับ home router

### 3. Firewall Rules
- ตรวจสอบ Default "allow LAN to any" rule
- สร้างและทดสอบ Block rule ชั่วคราว (LAN → 1.1.1.1:443) เพื่อยืนยัน rule ordering และการบังคับใช้ แล้วลบออก
- เรียนรู้ว่า rules ถูกประเมินจากบนลงล่าง first match wins

### 4. NAT (Outbound)
- ตรวจสอบว่า Automatic Outbound NAT (default ของ pfSense) แปลง LAN traffic (`10.10.10.0/24`) เป็น WAN address สำหรับ internet access ได้ถูกต้อง

### 5. VLAN Segmentation

| VLAN | Interface | Subnet | วัตถุประสงค์ |
|---|---|---|---|
| VLAN10 | OPT1 (em1.10) | 10.10.20.0/24 | Servers (จำลอง) |
| VLAN20 | OPT2 (em1.20) | 10.10.30.0/24 | Clients (จำลอง) |

- สร้าง VLAN ผ่าน pfSense Interfaces → VLANs แล้ว assign เป็น OPT1/OPT2
- เพิ่ม Firewall rules บน OPT1 เพื่ออนุญาต traffic (ดูส่วน Problems)
- ตรวจสอบว่า VLAN-tagged traffic ถึง pfSense gateway ที่ถูกต้อง

## 🐛 ปัญหาที่พบและวิธีแก้

### ปัญหาที่ 1: Proxmox Bridge ปฏิเสธ VLAN Tag บน VM Network Device
- **อาการ:** VM ไม่สามารถ start ได้ พร้อม error: `no physical interface on bridge 'vmbr1'... network script /usr/libexec/qemu-server/pve-bridge failed with status 65280`
- **สาเหตุ:** `vmbr1` ถูกสร้างโดยเจตนาโดยไม่มี physical NIC (เพื่อแยก Lab network ออก) การกำหนด VLAN Tag ที่ระดับ Proxmox hardware ต้องการ physical interface ที่ไม่มีอยู่บน internal-only bridge
- **วิธีแก้:** ลบ VLAN Tag ออกจาก Proxmox network device config แล้วทำ VLAN tagging ที่ระดับ **Guest OS** (ภายใน Ubuntu) โดยใช้ `vlan` package และ `ip link add ... type vlan id <N>` — Linux bridge ปล่อย tagged frames ผ่านโดยไม่แก้ไข

### ปัญหาที่ 2: pfSense CE vs Plus Subscription Prompt
- **อาการ:** Installer แสดง "This device does not have an active pfSense Plus subscription"
- **สาเหตุ:** Netgate installer ชี้ไปที่ pfSense Plus (subscription-based) เป็นค่า default — เป็นเรื่องปกติเมื่อติดตั้ง Community Edition ฟรี
- **วิธีแก้:** เลือก "Install CE" เพื่อดำเนินการต่อด้วย Community Edition

### ปัญหาที่ 3: SSH Local Port Forwarding รันผิดเครื่อง
- **อาการ:** หลังรัน `ssh -L 8443:10.10.10.1:443 user@host` บน Ubuntu jump box (ผ่าน Proxmox console) แล้ว Browser บน Windows host ไม่สามารถเข้า `https://localhost:8443` ได้
- **สาเหตุ:** SSH local port forwarding (`-L`) เปิด forwarded port **บนเครื่องที่รัน ssh command** ไม่ใช่บน remote server การรันใน Ubuntu ที่ไม่มี browser จึงเปิด tunnel บน Ubuntu ไม่ใช่บน Windows
- **วิธีแก้:** รัน `ssh -L` command เดิมจาก **Windows PowerShell** บน host machine แทน

### ปัญหาที่ 4: VLAN-Tagged Traffic หมดเวลา (Timeout) แม้ Tagging ถูกต้อง
- **อาการ:** `ping 10.10.20.1` (pfSense OPT1/VLAN10 gateway) timeout โดยสิ้นเชิง ทั้งที่ ping OPT2 และ LAN gateway ดั้งเดิมได้
- **การวินิจฉัย:** OPT interfaces ที่สร้างใหม่ใน pfSense **ไม่มี Firewall rules ใดๆ ตั้งต้น** ต่างจาก LAN interface ที่มี "Default allow LAN to any" rule ล่วงหน้า ทุก packet ที่มาจาก OPT interface ใหม่จะถูก drop โดยไม่มีการแจ้งเตือน จนกว่าจะเพิ่ม allow rule
- **วิธีแก้:** เพิ่ม Pass rule บน Firewall → Rules → OPT1 (และ OPT2) เพื่ออนุญาต traffic จาก VLAN subnet
- **บทเรียน:** pfSense ถือว่า interface ทุกตัวเป็น Security Zone อิสระแบบ deny-by-default — permissive default ของ LAN เป็นข้อยกเว้นเพื่อความสะดวก ไม่ใช่กฎทั่วไป

### ปัญหาที่ 5: SSH Tunnel IP เปลี่ยนหลัง VM Reboot
- **อาการ:** SSH tunnel command ที่เคยใช้ได้ล้มเหลวด้วย `Connection timed out` หลัง Ubuntu jump box reboot
- **สาเหตุ:** Interface ของ jump box ที่หันหน้าไปยังเครือข่ายบ้าน (`ens19`) ใช้ DHCP ไม่ใช่ Static IP ทำให้ address เปลี่ยนทุกครั้งที่ reboot
- **วิธีแก้:** ตรวจสอบ IP ปัจจุบันผ่าน Proxmox console โดยตรง แล้วอัปเดต SSH command ด้วย address ใหม่

## 🎯 ทักษะที่ได้รับ

- ติดตั้งและตั้งค่า pfSense firewall (WAN/LAN, NAT, Firewall rules)
- VLAN segmentation โดยใช้ 802.1Q tagging รวมถึงการแก้ข้อจำกัด Hypervisor-level โดย tagging ที่ระดับ Guest OS
- ความเข้าใจพฤติกรรม Default-deny vs Default-allow ใน Firewall interface zones
- SSH tunneling / local port forwarding รวมถึงการแก้ความเข้าใจผิดเรื่อง direction ของ port ที่เปิด
- การออกแบบ Network isolation (เครือข่ายแล็บคู่ขนาน vs. รวมกับโครงสร้างที่มีอยู่)
- การ Troubleshoot อย่างเป็นระบบโดยใช้ ping, การทดสอบ firewall rule ordering และการวินิจฉัยระดับ interface
