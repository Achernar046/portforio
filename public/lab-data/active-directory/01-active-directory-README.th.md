# โปรเจกต์โฮมแล็บ: ระบบโครงสร้างพื้นฐาน Active Directory

> โปรเจกต์โฮมแล็บส่วนตัวที่จำลองโครงสร้างพื้นฐาน IT ระดับองค์กร โดยใช้ Proxmox VE, Windows Server และ Active Directory Domain Services

## 📋 ภาพรวม

โปรเจกต์นี้ตั้งค่าเครือข่ายองค์กรขนาดเล็กโดยใช้ Proxmox VE เป็น Hypervisor พร้อม Windows Server 2022 Domain Controller จัดการ Authentication แบบรวมศูนย์, DNS, DHCP และ Group Policy สำหรับ Windows Client ที่ join Domain เพื่อพัฒนาทักษะปฏิบัติจริงสำหรับสายงาน Infrastructure/System/Network Engineer

## 🏗️ สถาปัตยกรรม

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

VM ทั้งสองรันบน Proxmox VE ด้วย UEFI (OVMF) BIOS, SATA disk controller และ Intel E1000 network adapter (เลือกเพื่อความเข้ากันได้ของ driver — ดูส่วน Problems)

## 🛠️ เทคโนโลยีที่ใช้

| Component | เทคโนโลยี |
|---|---|
| Hypervisor | Proxmox VE |
| Domain Controller OS | Windows Server 2022 (Desktop Experience) |
| Client OS | Windows 10/11 Enterprise Evaluation |
| Directory Service | Active Directory Domain Services |
| DNS/DHCP | Windows Server built-in roles |
| Policy Management | Group Policy Objects (GPO) |
| Remote Access | RDP (สำหรับการจัดการ) |

## ✅ สิ่งที่ทำสำเร็จ

### 1. ตั้งค่า Domain Controller
- ติดตั้ง Windows Server 2022 บน Proxmox VM (UEFI, SATA disk, E1000 NIC)
- ตั้งค่า Static IP และ Promote server เป็น Domain Controller สร้าง Forest `lab.local`
- การติดตั้ง AD DS รวม DNS role ให้อัตโนมัติ
- ตั้งค่า DHCP scope สำหรับเครือข่ายในแล็บ
- ตรวจสอบสุขภาพระบบด้วย `dcdiag /q` และ `nslookup`

### 2. โครงสร้าง Organizational Unit
```
lab.local
└── lab (OU)
    ├── IT
    ├── User
    └── Computers
```
สร้างผ่าน PowerShell (`New-ADOrganizationalUnit`) หลังจากที่ลองทำผ่าน GUI แล้วได้ OU ซ้ำ/ชื่อผิด — แก้โดยใช้ `Remove-ADOrganizationalUnit` หลังปิด accidental-deletion protection

### 3. Users และ Groups

| User | SamAccountName | Group Membership |
|---|---|---|
| John Doe | jdoe | Staff, IT-Admins |
| Mary Smith | msmith | Staff |
| Alex Wilson | awilson | Staff |

สร้างผ่าน PowerShell loop (`New-ADUser`, `New-ADGroup`, `Add-ADGroupMember`) พร้อมบังคับ `-ChangePasswordAtLogon $true` ทุก account

### 4. Client Domain Join
- Join Windows client เข้า Domain `lab.local` ผ่าน Settings → System → Domain or workgroup
- ตรวจสอบการ login ด้วย `LAB\jdoe` พร้อมบังคับเปลี่ยน password ครั้งแรก

### 5. Group Policy Objects (GPO)

| GPO | ขอบเขต | ผล | ตรวจสอบแล้ว |
|---|---|---|---|
| Set-Desktop-Wallpaper | User Config → OU `User` | บังคับ Wallpaper (`\\lab.local\NETLOGON\wallpaper.jpg`) | ✅ |
| Default Domain Policy (แก้ไข) | Domain root | รหัสผ่านขั้นต่ำ 10 ตัว, บังคับ complexity | ✅ ปฏิเสธรหัสผ่านง่ายผ่าน `Set-ADAccountPassword` |
| Restrict-ControlPanel | User Config → OU `User` | บล็อก Control Panel/Settings | ✅ ยืนยันข้อความ error |

## 🐛 ปัญหาที่พบและวิธีแก้

### ปัญหาที่ 1: VirtIO Disk Driver ไม่ถูกรู้จัก
- **อาการ:** Windows Setup แสดง "We couldn't find any drives. To get a storage driver, click Load driver."
- **สาเหตุ:** VirtIO/SCSI disk controller ต้องการ driver ที่ไม่มีใน Windows ISO มาตรฐาน
- **วิธีแก้:** เปลี่ยน disk bus ของ VM จาก VirtIO/SCSI เป็น **SATA** ซึ่ง Windows รู้จักโดยไม่ต้องลง driver เพิ่ม

### ปัญหาที่ 2: Network Adapter ไม่ถูกตรวจพบ
- **อาการ:** Network Connections แสดง "This folder is empty" — ไม่มี adapter เลย
- **สาเหตุ:** VirtIO network adapter ไม่มี driver built-in ใน Windows
- **วิธีแก้:** เปลี่ยน NIC model ของ VM จาก VirtIO เป็น **Intel E1000** ที่ Windows มี driver อยู่แล้ว

### ปัญหาที่ 3: ปัญหาคอนโซลตอน Domain Promotion
- **อาการ:** VM แสดง "Press any key to boot from CD or DVD" พร้อม timeout สั้นมาก ทำให้พลาดบ่อย
- **วิธีแก้:** เรียนรู้ให้คลิกเข้าไปในคอนโซลและกดปุ่มทันทีที่ reset; ตรวจสอบ boot order และการแนบ ISO ใน Proxmox

### ปัญหาที่ 4: Static IP Conflict บน Domain Controller
- **อาการ:** DNS query จาก client (`nslookup`, `Test-NetConnection` port 53) timeout แม้ ICMP ping ผ่าน RDP ไปยัง DC ก็ล้มเหลวบางครั้ง
- **กระบวนการวินิจฉัย:**
  1. ตรวจ Windows Firewall บน DC — Inbound rules สำหรับ DNS และ RDP เปิดอยู่แล้ว ตัดปัญหา Firewall ออก
  2. รัน `netstat -an | findstr ":53"` บน DC พบว่า DNS service ผูกกับ **169.254.x.x (APIPA)** แทนที่จะเป็น Static IP ที่ตั้งไว้
  3. รัน `Get-NetIPAddress` พบ Static IP มีสถานะ **`AddressState: Duplicate`** — Windows ตรวจพบว่ามีอุปกรณ์อื่นใช้ IP นั้นอยู่
- **วิธีแก้:** ตรวจสอบว่า IP ใหม่ว่างจริง (`ping` ตอบ "Destination host unreachable") แล้วกำหนด DC ใหม่ที่ `192.168.1.99` โดยใช้ `Remove-NetIPAddress` / `New-NetIPAddress` และอัปเดต DNS บน client
- **บทเรียน:** `ping` สำเร็จไม่ได้หมายความว่า service ทำงานได้ — `netstat` และ `Test-NetConnection` ระดับ TCP/port ต่างหากที่เผยให้เห็นปัญหาจริง

### ปัญหาที่ 5: Domain Join ล้มเหลวบน Windows 10 Home
- **อาการ:** System Properties แสดง "You cannot join a computer running this edition of Windows 10 to a domain."
- **สาเหตุ:** Domain Join เป็น feature ที่ตัดออกโดยเจตนาใน Windows Home Edition (รองรับเฉพาะ Pro/Enterprise/Education)
- **วิธีแก้:** ตรวจสอบ Edition ด้วย `Get-ComputerInfo | Select WindowsProductName, WindowsEditionId` แล้วสร้าง client VM ใหม่ด้วย **Windows Enterprise Evaluation ISO**

### ปัญหาที่ 6: GPO Setting ถูก Apply ผิด Node
- **อาการ:** ไม่พบ "Desktop Wallpaper" setting ใต้ `Computer Configuration → Administrative Templates → System`
- **สาเหตุ:** Desktop Wallpaper เป็น **User Configuration** policy ไม่ใช่ Computer Configuration — ค้นหาผิด branch
- **วิธีแก้:** เจอ path ที่ถูก (`User Configuration → Policies → Administrative Templates → Desktop → Desktop`) และ link GPO ใหม่ไปยัง OU ที่มี **user** accounts

### ปัญหาที่ 7: Password Policy GPO ไม่มีผล
- **สาเหตุ:** Password Policy เป็น special case ใน Active Directory — มีผลเฉพาะเมื่อตั้งค่าบน **Default Domain Policy** ที่ domain root เท่านั้น การสร้าง GPO ใหม่และ link ไปยัง OU ไม่มีผลต่อ password requirements
- **วิธีแก้:** แก้ไข "Default Domain Policy" ที่มีอยู่โดยตรง แทนที่จะสร้าง GPO แยก

## 🎯 ทักษะที่ได้รับ

- ติดตั้งและตั้งค่า Windows Server 2022 roles (AD DS, DNS, DHCP)
- จัดการ Active Directory objects ผ่าน PowerShell (`New-ADUser`, `New-ADGroup`, `New-ADOrganizationalUnit`, `Move-ADObject`)
- ออกแบบ Group Policy, scoping (Computer vs. User configuration) และพฤติกรรม password policy ระดับ domain
- วิธีการ troubleshoot เครือข่าย: แยกแยะ ICMP reachability จาก service/port reachability จริง, วินิจฉัย IP address conflict
- ตั้งค่าฮาร์ดแวร์ VM บน Proxmox VE (BIOS mode, disk bus, NIC model) และแก้ปัญหา driver compatibility
- ความเข้าใจข้อจำกัด Windows edition licensing ที่เกี่ยวข้องกับ enterprise deployment
