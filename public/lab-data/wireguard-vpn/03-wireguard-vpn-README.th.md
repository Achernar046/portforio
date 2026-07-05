# โปรเจกต์โฮมแล็บ: WireGuard Remote Access VPN

> โปรเจกต์โฮมแล็บส่วนตัวที่ติดตั้ง WireGuard VPN Server สำหรับ Secure Remote Access เข้าสู่เครือข่ายบ้าน สร้างบน Ubuntu Server แบบ standalone แทนที่จะใช้ pfSense package เพื่อฝึกการตั้งค่า Native Linux VPN โดยตรง

## 📋 ภาพรวม

โปรเจกต์นี้ตั้งค่า WireGuard VPN Server บน Ubuntu VM แบบ dedicated พร้อม Port Forwarding ผ่าน Router ทำให้ Windows Client ระยะไกลสามารถเชื่อมต่อ Full-Tunnel VPN จากภายนอกเครือข่ายบ้านได้ (ทดสอบผ่านสัญญาณมือถือ) มุ่งเน้น Remote Access VPN เท่านั้น (ไม่รวม Site-to-Site เพื่อให้อยู่ในขอบเขตเวลา)

## 🏗️ สถาปัตยกรรม

```
Windows Client (ระยะไกล — บนสัญญาณมือถือ)
   │  WireGuard tunnel (UDP 51820)
   ▼
Home Router (Public IP: 182.53.180.190)
   │  Port Forward: UDP 51820 → 192.168.1.9
   ▼
WireGuard Server VM (Ubuntu, บน vmbr0 / เครือข่ายบ้าน)
   IP: 192.168.1.9
   wg0 interface: 10.10.99.1/24
   │
   └── NAT (MASQUERADE) → route traffic ของ client ออกผ่าน ens18 ไปยัง internet
```

**การตัดสินใจออกแบบ:** Deploy WireGuard เป็น Ubuntu server แบบ standalone แทน pfSense WireGuard package เพื่อทำงานกับ native `wg`/`wg-quick` tooling โดยตรง และเก็บไว้บน `vmbr0` เท่านั้น (ไม่ bridge เข้ากับเครือข่ายแล็บ pfSense) เพื่อให้แล็บนี้ self-contained

## 🛠️ เทคโนโลยีที่ใช้

| Component | เทคโนโลยี |
|---|---|
| Hypervisor | Proxmox VE |
| VPN Server OS | Ubuntu Server |
| VPN Software | WireGuard (native `wg`/`wg-quick`) |
| Client | WireGuard for Windows |
| Router | ZTE (port forwarding) |

## ✅ สิ่งที่ทำสำเร็จ

### 1. ตั้งค่า Server
- Deploy Ubuntu VM ขนาดเล็ก (1-2 core, 1-2GB RAM) บน `vmbr0`
- เปิด IPv4 forwarding ผ่าน `/etc/sysctl.d/` (ดูส่วน Problems)
- สร้าง server key pair ด้วย `wg genkey` / `wg pubkey`

### 2. ตั้งค่า WireGuard Interface

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

- เปิดใช้งานและ Start ผ่าน `systemctl enable/start wg-quick@wg0`

### 3. ตั้งค่า Client (Windows)
- สร้าง key pair แยกสำหรับ client
- Full-tunnel config (`AllowedIPs = 0.0.0.0/0`) ให้ traffic ทั้งหมดของ client ผ่าน VPN — เลือกเพื่อให้ทดสอบได้ง่าย (Public IP เปลี่ยนเป็น Home IP เห็นชัดเจน)
- Import config เข้า WireGuard for Windows โดยตรง

### 4. ตั้งค่า Port Forwarding บน Router
- Forward UDP port `51820` บน Router WAN ไปยัง WireGuard server LAN IP (`192.168.1.9`)
- ระบุ Home public IP (`182.53.180.190`) เพื่อใช้เป็น `Endpoint` ของ client

### 5. การตรวจสอบ
- ยืนยัน handshake และ active tunnel ผ่าน `wg show` บน server (endpoint, latest handshake, transfer counters มีข้อมูล)
- ยืนยัน `ping 10.10.99.1` สำเร็จจาก Windows client ผ่าน tunnel
- ยืนยัน Full-tunnel routing โดยตรวจ Public IP ของ client — แสดง Home network public IP (`182.53.180.190`) พิสูจน์ว่า traffic ทั้งหมดถูก route ผ่าน VPN และ NAT ออก internet

## 🐛 ปัญหาที่พบและวิธีแก้

### ปัญหาที่ 1: `/etc/sysctl.conf` ไม่มีอยู่จริง
- **อาการ:** คำสั่ง `sed` เพื่อเปิด IP forwarding ล้มเหลวด้วย `No such file or directory`
- **สาเหตุ:** Ubuntu install นี้ไม่มี `/etc/sysctl.conf` ที่มี content (มีแค่ README file ใน `/etc/sysctl.d/`)
- **วิธีแก้:** สร้าง config file แยกแทน — `echo 'net.ipv4.ip_forward=1' | sudo tee /etc/sysctl.d/99-wireguard.conf` แล้ว apply ด้วย `sysctl -p` โดย target ที่ไฟล์นั้นโดยตรง

### ปัญหาที่ 2: Config Files ถูกทิ้งไว้พร้อม Placeholder Values (เกิดสองครั้ง)
- **อาการ:** `wg-quick@wg0.service` ไม่สามารถ start ได้ด้วย `Key is not the correct length or format: '<SERVER_PRIVATE_KEY>'` — ความผิดพลาดเดิมเกิดขึ้นอีกครั้งใน client config file
- **สาเหตุ:** Copy-paste template config เข้า `nano` แบบ manual โดยไม่แทนที่ placeholder ด้วย key จริง
- **วิธีแก้:** เปลี่ยนไปใช้ heredoc command ที่อ่านค่าจาก key file โดยตรง และ inject เข้าไปใน config ขจัดขั้นตอน manual substitution:
  ```bash
  sudo bash -c "cat > /etc/wireguard/wg0.conf" << EOF
  [Interface]
  PrivateKey = $(sudo cat /etc/wireguard/server_private.key)
  ...
  EOF
  ```

### ปัญหาที่ 3: DNS/Internet Access ล้มเหลวผ่าน Tunnel แม้ Handshake สำเร็จ
- **อาการ:** `ping 10.10.99.1` (VPN server เอง) สำเร็จจาก client แต่ `curl ifconfig.me` ล้มเหลวด้วย "The remote name could not be resolved"
- **การวินิจฉัย:** Handshake และ tunnel ทำงานถูกต้อง (ยืนยันผ่าน `wg show`) และ IP forwarding เปิดที่ kernel level แล้ว — แต่ traffic จาก VPN client ไม่มี NAT rule ที่จะแปลง source address (`10.10.99.x`) ก่อน route ออก WAN interface (`ens18`) Kernel-level forwarding อย่างเดียวไม่จัดการ address translation
- **วิธีแก้:** เพิ่ม `iptables -t nat -A POSTROUTING -o ens18 -j MASQUERADE` พร้อม FORWARD accept rules สำหรับ `wg0` แล้วย้ายเข้าไปใน `PostUp`/`PostDown` directives ของ WireGuard config เพื่อให้ apply อัตโนมัติทุกครั้งที่ tunnel start/stop
- **บทเรียน:** Handshake ที่สำเร็จพิสูจน์แค่ว่า tunnel itself ทำงาน — ไม่ได้บอกว่า traffic จะ route ผ่าน VPN server ไปยัง internet ได้จริง การ ping ไปยัง VPN server IP ทดสอบ tunnel; การทดสอบ NAT ต้องเข้าถึงอะไรที่อยู่นอก server

### ปัญหาที่ 4: PowerShell `curl` Alias สร้างความสับสน
- **อาการ:** `curl ifconfig.me` บน Windows แสดงผลเป็น object เต็ม (`StatusCode`, `Content`, `ParsedHtml`, ฯลฯ) แทนที่จะเป็น plain IP address
- **สาเหตุ:** ใน Windows PowerShell, `curl` เป็น alias ของ `Invoke-WebRequest` ซึ่ง parse response เป็น structured object แทนที่จะ return raw text เหมือน `curl` binary ของ Linux
- **วิธีแก้:** ใช้ `(Invoke-WebRequest -Uri "https://ifconfig.me" -UseBasicParsing).Content` เพื่อดึงแค่ response body หรือตรวจสอบค่าใน browser แทน

## 🎯 ทักษะที่ได้รับ

- ตั้งค่า WireGuard VPN ตั้งแต่ต้นโดยใช้ native command-line tools (`wg`, `wg-quick`) โดยไม่ใช้ GUI
- การสร้าง Public/private key pair และการตั้งค่า peer-based trust
- Linux packet forwarding และ NAT (`iptables MASQUERADE`) รวมถึงความแตกต่างระหว่าง routing (kernel forwarding) และ address translation (NAT)
- การตั้งค่า Port forwarding บน Router สำหรับ self-hosted services
- วิธีการตรวจสอบ End-to-end: แยกแยะ "tunnel ทำงาน" จาก "tunnel route traffic ได้จริง" โดยใช้การทดสอบแบบ layered (ping ไป server vs. ping/curl ไป internet)
- ความแตกต่างของ Tooling ตาม Platform (PowerShell `curl` alias vs. native Linux `curl`)
