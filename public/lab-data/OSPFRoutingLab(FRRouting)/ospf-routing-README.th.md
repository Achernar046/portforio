# โปรเจกต์ Homelab: OSPF Routing Lab (FRRouting)

> โปรเจกต์ Homelab ส่วนตัวที่สร้างโทโพโลยี OSPF แบบ 3 เราเตอร์โดยใช้ FRRouting บน Proxmox VE เพื่อสาธิตการ Routing แบบ Dynamic ภายใน, การ Convergence และการตรวจจับความล้มเหลว — สร้างขึ้นเพื่อเปลี่ยนทิศทางสู่แล็บที่เน้น Network Engineering หลังจากการทำ Infrastructure Sprint 

## 📋 ภาพรวม

โปรเจกต์นี้สร้างโทโพโลยีเราเตอร์ 3 โหนด (Router-A — Router-B — Router-C) ที่รัน FRRouting ซึ่งเป็นซอฟต์แวร์ Routing แบบ Open Source ระดับ Production (ใช้งานในเครือข่ายจริง เช่น ของ Meta) เพื่อสาธิตให้ OSPF (Open Shortest Path First) เรียนรู้เส้นทางไปยังเครือข่ายที่ไม่ได้เชื่อมต่อโดยตรงได้แบบ Dynamic — โดยไม่ต้องตั้งค่า Static Route ใดๆ เลย

## 🏗️ สถาปัตยกรรม

```
                vmbr2                       vmbr3
              (Link A-B)                  (Link B-C)
Router-A ───────────────────  Router-B  ───────────────────  Router-C
10.0.12.1/30              10.0.12.2/30  10.0.23.1/30      10.0.23.2/30
(Area 0)                                                    (Area 0)

Loopback (จำลองเครือข่าย "ด้านหลัง" แต่ละเราเตอร์):
Router-A: lo → 1.1.1.1/32
Router-B: lo → 2.2.2.2/32
Router-C: lo → 3.3.3.3/32

Management (vmbr0, DHCP — ใช้สำหรับ SSH เข้าจากเครื่อง Host):
เราเตอร์ทั้ง 3 ตัวมี NIC ฝั่ง Management บนเครือข่ายบ้านด้วย
```

แต่ละ Link แบบ Point-to-Point ใช้ Subnet `/30` ตามแบบแผนวิศวกรรมเครือข่ายจริงสำหรับ Link ที่มีที่อยู่ IP ที่ใช้ได้แค่ 2 ที่ `vmbr2` และ `vmbr3` เป็น Proxmox Bridge แบบภายในเท่านั้น (ไม่มี NIC จริงต่ออยู่) ทำหน้าที่เป็น "สายเคเบิลเสมือน" ระหว่างคู่เราเตอร์ — รูปแบบเดียวกับ pfSense LAN ในแล็บก่อนหน้า

## 🛠️ เทคโนโลยีที่ใช้

| ส่วนประกอบ | เทคโนโลยี |
|---|---|
| Hypervisor | Proxmox VE |
| Router OS | Ubuntu Server (ติดตั้งแบบ Minimal) |
| Routing Software | FRRouting (FRR) — ใช้งานจริง ไม่ใช่ Simulator |
| Management CLI | `vtysh` (Syntax แบบ Cisco IOS) |

**ทำไมถึงใช้ FRR แทน Cisco Packet Tracer:** Packet Tracer เป็น Simulator ทางการศึกษาที่มี Syntax คล้าย Cisco แต่ไม่ได้รัน Logic การ Routing จริง FRR คือซอฟต์แวร์ Routing ระดับ Production ที่ใช้ในเครือข่ายจริง — การตั้งค่าที่นี่หมายความว่าทำงานกับการ Implement OSPF จริงๆ และพฤติกรรม Convergence/Failure ที่แท้จริง ไม่ใช่แบบจำลองสำหรับการสอน

## ✅ สิ่งที่ทำสำเร็จ

### 1. ตั้งค่าโทโพโลยีเครือข่าย
- สร้าง Proxmox Bridge แบบภายในเพิ่มเติม 2 อัน (`vmbr2`, `vmbr3`) โดยไม่มี NIC จริงต่ออยู่ เพื่อใช้เป็น Link แบบ Point-to-Point แบบแยกโดดระหว่างคู่เราเตอร์
- สร้าง Ubuntu VM ขนาดเล็ก 3 เครื่อง แต่ละเครื่องมี 2-3 NIC ขึ้นอยู่กับตำแหน่งในโทโพโลยี (Router-B ที่เป็นโหนดตรงกลางมี 3 อัน: สองอันสำหรับ Link ระหว่างเราเตอร์ และอีกอันสำหรับ Management)

### 2. การกำหนดที่อยู่ IP
- ตั้งค่า IP แบบ Static ผ่าน Netplan บน Interface ฝั่งเราเตอร์แต่ละตัว ตามรูปแบบ Point-to-Point `/30`
- เพิ่มที่อยู่ Loopback (`1.1.1.1`, `2.2.2.2`, `3.3.3.3`) เพื่อจำลองเครือข่ายที่ "เป็นของ" แต่ละเราเตอร์

### 3. การติดตั้ง FRR และตั้งค่า OSPF
- ติดตั้ง FRR ผ่าน `apt`, เปิดใช้งาน Daemon `ospfd` ใน `/etc/frr/daemons`
- ตั้งค่า OSPF บนแต่ละเราเตอร์ผ่าน `vtysh` โดย Advertise เครือข่ายที่เชื่อมต่อโดยตรงและ Loopback ของแต่ละเราเตอร์เข้า Area 0

### 4. การตรวจสอบ
- ยืนยันว่า OSPF Neighbor Adjacency ถึงสถานะ **Full** บนทุก Link (`show ip ospf neighbor`)
- ยืนยันว่า Routing Table ของ Router-A (`show ip route ospf`) มีเส้นทางไปยัง Loopback และ Link Subnet ของ Router-C — เครือข่ายที่ไม่มีการเชื่อมต่อโดยตรง — ที่เรียนรู้ผ่าน OSPF ทั้งหมด
- ยืนยัน Reachability แบบ End-to-End: `ping` จาก Router-A ไป Loopback ของ Router-C สำเร็จโดยไม่มีการสูญเสีย Packet

### 5. การทดสอบ Failure Detection
- ทำให้ Interface Link ของ Router-A ล่มลง (`ip link set ens18 down`) เพื่อจำลองการขาด Link
- ยืนยันว่า OSPF ตรวจจับการขัดข้องผ่าน Dead Timer และลบ Neighbor ที่ได้รับผลกระทบและเส้นทางทั้งหมดที่ขึ้นอยู่กับมันออกจาก Routing Table
- นำ Interface กลับขึ้นมาและยืนยันว่า OSPF สร้าง Neighbor ขึ้นใหม่และคืน Route โดยอัตโนมัติ — ไม่ต้องดำเนินการด้วยตนเอง

## 🐛 ปัญหาที่พบและวิธีแก้ไข

### ปัญหาที่ 1: Ping ระหว่างเราเตอร์ที่ไม่ได้เชื่อมต่อโดยตรงล้มเหลวทั้งที่ Routing Table ถูกต้อง
- **อาการ:** `show ip route ospf` บน Router-A แสดงเส้นทางไปยัง Loopback และ Link Subnet ของ Router-C อย่างถูกต้อง แต่ `ping` ไปยังที่อยู่เหล่านั้นยังคงล้มเหลวโดยสูญเสีย Packet 100%
- **การวินิจฉัย:** ตรวจสอบสถานะ OSPF Neighbor และ Routing Table บนเราเตอร์ทั้งสามตัว — ทุกอย่างถูกต้องในฝั่ง Control-Plane (Routing) ปัญหาอยู่ที่ระดับ Kernel: `sysctl net.ipv4.ip_forward` เป็น `0` (ค่าเริ่มต้นของ Ubuntu) บน VM ทั้งสามตัว ซึ่งวิกฤตอย่างยิ่งสำหรับ Router-B ที่อยู่ตรงกลางของเส้นทาง
- **วิธีแก้:** เปิดใช้งาน IP Forwarding ผ่าน `/etc/sysctl.d/99-routing.conf` บนเราเตอร์ทั้งสามตัว
- **บทเรียน:** Routing Table ที่ถูกต้องอธิบายเฉพาะ *ที่* ที่ FRR เชื่อว่า Traffic ควรไป — มันไม่ได้ทำให้ Linux Kernel ส่งต่อ Packet ระหว่าง Interface ด้วยตัวเอง Routing (Control Plane จัดการโดย FRR) และ Forwarding (Data Plane จัดการโดย Kernel) เป็นคนละเรื่องกันที่ต้องตั้งค่าให้ถูกต้องทั้งคู่ นี่เป็นปัญหาประเภทเดียวกับที่พบกับ WireGuard ที่ต้องการ NAT/MASQUERADE ในแล็บก่อนหน้า — การที่ตั้งค่า Routing/Tunnel สำเร็จไม่ได้รับประกันว่า Packet จะถูกส่งต่อ End-to-End

## 🎯 ทักษะที่ได้รับ

- การตั้งค่าและตรวจสอบ OSPF โดยใช้ซอฟต์แวร์ Routing ระดับ Production (FRR) รวมถึงการออกแบบ Area, สถานะ Neighbor และ Syntax แบบ Cisco ผ่าน `vtysh`
- รูปแบบการกำหนดที่อยู่ Link แบบ Point-to-Point (`/30` Subnet) และการจำลองเครือข่ายด้วย Loopback
- การวินิจฉัยปัญหา Routing (Control Plane) กับ Forwarding (Data Plane) แยกกัน — ตระหนักว่า Routing Table ที่ถูกต้องไม่รับประกันการส่ง Packet
- พฤติกรรมการตรวจจับความล้มเหลวและการ Self-Healing ของ Dynamic Routing Protocol ที่ตรวจสอบผ่านการทดสอบ Link Failure โดยตั้งใจ
- Proxmox Internal-Bridge Networking สำหรับสร้างโทโพโลยีแล็บหลายโหนดแบบแยกโดดโดยไม่ต้องใช้ Hardware จริง
