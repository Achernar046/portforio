# pfSense → Wazuh SIEM Integration Lab

แล็บ Network Security Monitoring ที่เชื่อม pfSense Firewall Logs เข้ากับ Wazuh SIEM/XDR เพื่อวิเคราะห์ Firewall Events แบบ Real-time สร้าง Custom Detection Rules และแสดงผลบน Dashboard

## 📋 ภาพรวม

แล็บนี้สร้าง Log Pipeline แบบ Syslog เต็มรูปแบบจาก pfSense Firewall เข้าสู่ Wazuh Manager พร้อม Custom Decoders และ Rules สำหรับ Parse รูปแบบ `filterlog` ของ pfSense สร้าง Alerts ที่มีความหมาย (รวมถึงการตรวจจับ Port Scan เบื้องต้น) และแสดงผลใน Wazuh's OpenSearch Dashboards

```
pfSense Firewall ──Syslog UDP 514──► Wazuh Manager (wazuh-remoted)
                                          │
                                     Custom Decoder (pfsense-filterlog)
                                          │
                                     Custom Rules (100100 / 100101 / 100102)
                                          │
                                       Filebeat
                                          │
                                    OpenSearch Indexer
                                          │
                                   Wazuh Dashboard (Threat Hunting)
```

## 🖥️ สภาพแวดล้อม

| Component | รายละเอียด |
|---|---|
| Wazuh Manager | Ubuntu Server 22.04, Wazuh 4.14.6 (all-in-one install) |
| Wazuh Manager IP | `10.10.10.50/24` (NIC แยกต่างหากบน lab subnet) |
| pfSense | Community Edition, LAN `10.10.10.1/24` |
| Hypervisor | Proxmox VE |
| Syslog transport | UDP, port 514 |

ทั้งสอง VM รันบน Proxmox โดย Wazuh VM มี NIC ที่ 2 เพื่อเชื่อมต่อกับ `10.10.10.0/24` lab subnet โดยเฉพาะ (NIC หลักของ manager ยังคงอยู่บน home network `192.168.1.0/24` สำหรับการ manage)

## 1. ข้อกำหนดด้านเครือข่าย

Wazuh Manager ต้องการเส้นทางเครือข่ายไปยัง LAN Interface ของ pfSense ในแล็บนี้ต้องเพิ่ม NIC เสมือนตัวที่ 2 ให้ Wazuh VM ใน Proxmox โดย Bridge ไปยัง vSwitch เดียวกับ LAN Interface ของ pfSense และกำหนด Static IP ใน lab subnet

**Netplan config** (`/etc/netplan/00-installer-config.yaml`):

```yaml
network:
  version: 2
  renderer: networkd
  ethernets:
    ens18:
      dhcp4: true
    ens19:
      addresses:
        - 10.10.10.50/24
      dhcp4: false
```

> **หมายเหตุ:** `renderer: networkd` สำคัญมาก — หากไม่ระบุ บน Ubuntu บางรุ่น NetworkManager อาจแย่งจัดการ Interface กับ systemd-networkd ตอน Boot ทำให้ Static IP ถูก Revert กลับเป็น DHCP หลัง Reboot โดยไม่แสดง Error

ตรวจสอบการเชื่อมต่อก่อนดำเนินการต่อ:

```bash
ping -c 4 10.10.10.1     # จาก Wazuh ไปยัง pfSense
```

## 2. pfSense: ตั้งค่า Remote Logging

**Status > System Logs > Settings**

| การตั้งค่า | ค่า |
|---|---|
| Enable Remote Logging | ✅ |
| Remote log servers | `10.10.10.50:514` |
| Remote Syslog Contents | ✅ System Events, ✅ Firewall Events, ✅ DHCP Events |

pfSense ส่ง Syslog เป็น UDP Datagrams ธรรมดาไปยัง Port 514 บน Target — ไม่ต้องรัน Service เพิ่มเติมบนฝั่ง pfSense

## 3. Wazuh Manager: Syslog Listener

Wazuh ไม่รับ Raw Syslog โดยอัตโนมัติ — ต้องกำหนดค่าเพิ่มเติมเป็น Block `<remote>` ที่ 2 ใน `ossec.conf` (Block แรกจัดการ Agent Traffic บน Port 1514/tcp อยู่แล้ว)

**`/var/ossec/etc/ossec.conf`** — Block ที่เพิ่มเข้าไป:

```xml
<ossec_config>
  <remote>
    <connection>syslog</connection>
    <port>514</port>
    <protocol>udp</protocol>
    <allowed-ips>10.10.10.1</allowed-ips>
  </remote>
</ossec_config>
```

สำหรับ Debug ระหว่าง Setup ให้เปิด `logall`/`logall_json` ชั่วคราวใน Block `<global>` แรก เพื่อบันทึก Events ทั้งหมดที่เข้ามา (ไม่ใช่แค่ Alerts) ลงใน `archives.log`/`archives.json`:

```xml
<logall>yes</logall>
<logall_json>yes</logall_json>
```

ตรวจสอบว่า Listener ถูก Bind แล้ว:

```bash
sudo ss -ulnp | grep 514
# UNCONN 0 0 0.0.0.0:514 0.0.0.0:* users:(("wazuh-remoted",pid=...))
```

## 4. Custom Decoder

`filterlog` ของ pfSense เป็น CSV Payload แบบ Fixed-position ที่ต่อท้าย Syslog Header เช่น:

```
filterlog[70751]: 4,,,1000000103,vtnet0,match,block,in,4,0x0,,1,20027,0,none,17,udp,198,192.168.1.8,239.255.255.250,52197,1900,178
```

**`/var/ossec/etc/decoders/local_decoder.xml`:**

```xml
<decoder name="pfsense-filterlog">
  <prematch>filterlog</prematch>
</decoder>

<decoder name="pfsense-filterlog-fields">
  <parent>pfsense-filterlog</parent>
  <regex type="pcre2">filterlog\[\d+\]: \d*,[^,]*,[^,]*,\d+,([^,]+),([^,]+),([^,]+),([^,]+),\d+,[^,]*,[^,]*,\d+,\d+,\d+,[^,]*,\d+,([^,]+),\d+,([^,]+),([^,]+),(\d+),(\d+)</regex>
  <order>interface,reason,fw_action,direction,protocol,srcip,dstip,srcport,dstport</order>
</decoder>
```

Fields ที่ Extract ได้: `interface`, `reason`, `fw_action`, `direction`, `protocol`, `srcip`, `dstip`, `srcport`, `dstport`

ปัจจุบันรองรับเฉพาะ **IPv4** — รายการ `filterlog` ของ IPv6 ใช้ Field Layout ที่แตกต่างออกไป จะ Fallback ไปยัง Parent Decoder (Alert ยังคง Fire แต่ไม่มี Parsed Fields)

### ปัญหาที่พบระหว่างทาง

- **`program_name` ไม่เคย Match.** เพราะ Syslog Forwarding Path (`wazuh->10.10.10.1 ...`) ใส่ Prefix แบบ Non-standard ทำให้ Pre-decoder ของ Wazuh ไม่สามารถ Extract `program_name` ที่สะอาดได้ แก้ไขโดยเปลี่ยนจาก `<program_name>` เป็น `<prematch>filterlog</prematch>` ซึ่งเช็คเพียงว่า String `filterlog` ปรากฏในบรรทัดไหนก็ได้
- **OS_Regex vs PCRE2.** Regex Engine เริ่มต้นของ Wazuh (OS_Regex) ไม่รองรับ PCRE Character Classes หรือ Escaped Brackets (`\[`, `\]`, `[^,]`) ส่งผลให้ Syntax ที่ถูกต้องใน PCRE던ก Error `ERROR (1452): Syntax error on regex` การเปลี่ยนเป็น `<regex type="pcre2">` ช่วยแก้ปัญหานี้ได้
- **`action` เป็น Reserved Field Name.** Subsystem Active-response ของ Wazuh จอง `action` ไว้ใช้ภายใน การตั้งชื่อ Field ใน Decoder เป็น `action` ทำให้เกิด Error `Field 'action' is static.` ตอนโหลด Rules แก้ไขโดยเปลี่ยนชื่อเป็น `fw_action`
- **`use_own_name` Default เป็น `no`.** Child Decoder จะรายงานชื่อของ *Parent* สำหรับการ Match Rules โดยค่าเริ่มต้น เว้นแต่จะตั้ง `<use_own_name>yes</use_own_name>` — แม้ว่า Regex/Fields ของ Child จะถูก Apply จริง Rules ที่เขียนอ้างชื่อ Child จึงไม่เคย Match แก้ไขโดยชี้ `<decoded_as>` ไปยัง Parent Name แทน

## 5. Custom Rules

**`/var/ossec/etc/rules/local_rules.xml`:**

```xml
<group name="pfsense,firewall,">
  <rule id="100100" level="3">
    <decoded_as>pfsense-filterlog</decoded_as>
    <description>pfSense: Firewall log event</description>
  </rule>

  <rule id="100101" level="6">
    <if_sid>100100</if_sid>
    <field name="fw_action">block</field>
    <description>pfSense: Traffic blocked by firewall ($(srcip) -> $(dstip):$(dstport))</description>
  </rule>

  <rule id="100102" level="10" frequency="10" timeframe="60">
    <if_matched_sid>100101</if_matched_sid>
    <description>pfSense: Possible port scan - multiple blocked connections</description>
    <mitre>
      <id>T1046</id>
    </mitre>
  </rule>
</group>
```

| Rule ID | Level | Trigger |
|---|---|---|
| 100100 | 3 | Events `filterlog` ของ pfSense ที่ถูก Decode แล้วทุกรายการ |
| 100101 | 6 | `fw_action == block` — บันทึก Source/Destination ลงใน Description โดยตรง |
| 100102 | 10 | Blocked Events 10+ รายการจาก Source เดียวกันภายใน 60 วินาที → อาจเป็น Port Scan (MITRE T1046) |

ตรวจสอบ Config ก่อน Restart Service เสมอ:

```bash
sudo /var/ossec/bin/wazuh-analysisd -t
sudo systemctl restart wazuh-manager
```

### ทดสอบแบบ Interactive ด้วย `wazuh-logtest`

ก่อนเชื่อถือการเปลี่ยนแปลง Decoder/Rule กับ Traffic จริง ให้ทดสอบโดยตรง:

```bash
sudo /var/ossec/bin/wazuh-logtest
```

วาง Log บรรทัดจริงที่ Capture มา และยืนยันว่า 3 Phase ทำงานครบ:

```
**Phase 2: Completed decoding.
    srcip: '192.168.1.8'
    dstip: '239.255.255.250'
    srcport: '52197'
    dstport: '1900'
    fw_action: 'block'

**Phase 3: Completed filtering (rules).
    id: '100101'
    level: '6'
    description: 'pfSense: Traffic blocked by firewall (192.168.1.8 -> 239.255.255.250:1900)'
**Alert to be generated.
```

## 6. การตรวจสอบ Pipeline

การ Debug Pipeline ต้องตรวจสอบแต่ละ Hop อย่างอิสระ ไม่ใช่สมมติว่าทั้งสายทำงานได้:

```bash
# 1. ตรวจสอบการเชื่อมต่อเครือข่าย
ping -c 4 10.10.10.1

# 2. ตรวจสอบว่า Packets ถึง Manager จริง
sudo tcpdump -i any udp port 514 -n

# 3. Wazuh remoted รับและ Archive แล้ว (ก่อน Decoder/Rule Logic)
sudo tail -f /var/ossec/logs/archives/archives.log | grep -i filterlog

# 4. Decoder + Rule ทำงาน
sudo tail -f /var/ossec/logs/alerts/alerts.json | grep -i pfsense

# 5. Pipeline Filebeat → Indexer ทำงานปกติ
sudo systemctl status filebeat
sudo filebeat test output
```

> **คำเตือน: IndexerConnector warnings เป็น Red Herring.** ระหว่าง Setup `ossec.log` แสดง Warning `IndexerConnector initialization failed for index 'wazuh-states-inventory-*'` อย่างต่อเนื่อง Warning เหล่านี้เกี่ยวกับฟีเจอร์ Vulnerability-detection/Inventory แยกต่างหาก และ **ไม่กระทบ** Pipeline `wazuh-alerts-*` หลักที่ใช้โดย Threat Hunting (ซึ่งรันผ่าน Filebeat อิสระ) อย่าไล่ตาม Warning เหล่านี้เมื่อ Debug Alerts ที่หายไปใน Dashboard

## 7. Dashboard

สร้างใน **OpenSearch Dashboards → Visualize** โดยใช้ Index Pattern `wazuh-alerts-*`:

| Visualization | ประเภท | Config |
|---|---|---|
| `pfsense_top_blocked_srcip` | Bar/Pie | Terms บน `data.srcip`, size 10, filter `rule.id: 100101` |
| `pfsense_top_blocked_port` | Vertical Bar | Terms บน `data.dstport`, size 10 |
| `pfsense_alert_timeline` | Area/Line | Date Histogram บน `timestamp`, split series Terms บน `rule.id` |

รวมเป็น Dashboard เดียว: **pfSense Firewall Monitoring**

### ผลลัพธ์ที่พบ (24 ชั่วโมงแรก)

- Ports ที่ถูก Block มากที่สุดคือ `1900` (SSDP/UPnP), `5353` (mDNS/Bonjour) และ `57621` (Spotify Connect discovery) — ล้วนเป็น Broadcast Traffic ปกติของอุปกรณ์ในบ้านที่ถูกจับโดย Default Deny Rule ของ pfSense ไม่ใช่กิจกรรมที่เป็นอันตราย
- Traffic พุ่งสูงในช่วง 18:00–21:00 ซึ่งสอดคล้องกับช่วงที่มีอุปกรณ์ใช้งานมากขึ้นในเครือข่ายบ้านตอนเย็น
- นี่เป็นการเตือนใจที่ดีว่า **Volume ≠ Threat** — Frequency Threshold ของ Rule 100102 (10 events/60s) ต้องปรับแต่ง (เช่น ยกเว้น Known Discovery Ports) เพื่อหลีกเลี่ยง False-positive Alert "Port Scan" จาก Broadcast Noise ปกติ

## 🐛 บันทึกการแก้ปัญหา

บันทึกรายละเอียดและลำดับเหตุการณ์ของทุกปัญหาที่พบระหว่างแล็บนี้ — รักษาไว้สำหรับอ้างอิงในอนาคตเพราะปัญหาเหล่านี้เกิดซ้ำได้ง่าย

### ปัญหาที่ 1: `wazuh-manager.service` เริ่มไม่ติดหลังเพิ่ม Decoder

**อาการ:**
```
wazuh-analysisd: ERROR: (1452): Syntax error on regex: 'filterlog\[\d+\]: (\S+)'
wazuh-analysisd: CRITICAL: (1202): Configuration error at 'etc/decoders/local_decoder.xml'.
```

**สาเหตุ:** Regex Engine เริ่มต้นของ Wazuh (OS_Regex) ไม่รองรับ PCRE Syntax เช่น `\d`, `\S` หรือ Escaped Brackets `\[`/`\]` ทำให้เกิด Syntax Error และ Manager ไม่สามารถเริ่มทำงานได้เลย

**วิธีแก้:** เริ่มต้นทำ Regex ให้เรียบง่ายก่อนเพื่อหลีกเลี่ยง Bracket/Shorthand Classes (`: (.+)`) ภายหลังเมื่อต้องการ Parse Fields เปลี่ยนมาใช้ `<regex type="pcre2">` บน Decoder ซึ่งเปิดใช้ PCRE2 เต็มรูปแบบ

**การป้องกัน:** ตรวจสอบ Config ก่อน Restart Service เสมอ:
```bash
sudo /var/ossec/bin/wazuh-analysisd -t
```

---

### ปัญหาที่ 2: pfSense Syslog ไม่ถึง Wazuh — `192.168.1.1` ชนกับ Home Router

**อาการ:** หลัง Factory Reset pfSense LAN IP เริ่มต้น (`192.168.1.1`) ตรงกับ Home Router ทำให้เข้า Web UI ของ pfSense ผ่าน LAN ไม่ได้

**สาเหตุ:** pfSense ที่ Factory Reset จะตั้ง LAN เป็น `192.168.1.1/24` เสมอ ซึ่งตรงกับ Home Network ที่มีอยู่

**วิธีแก้:** ใช้ pfSense Console Menu (ตัวเลือก `2) Set interface(s) IP address`) เพื่อกำหนด LAN Interface ใหม่เป็น `10.10.10.1/24` โดยตรง — ข้าม Web UI ที่ยังเข้าไม่ได้

---

### ปัญหาที่ 3: Wazuh VM และ pfSense ไม่สามารถสื่อสารกันได้เลย

**อาการ:** `ping 10.10.10.1` จาก Wazuh ล้มเหลวทั้งหมด; `ip a` แสดงว่า Wazuh VM มี Interface เฉพาะบน `192.168.1.0/24` เท่านั้น

**สาเหตุ:** Wazuh VM ไม่เคยเชื่อมต่อกับ lab subnet (`10.10.10.0/24`) ที่ Layer Virtual Network — มี NIC เดียวบน Home Network เท่านั้น

**วิธีแก้:** เพิ่ม NIC เสมือนตัวที่ 2 ให้ Wazuh VM ใน Proxmox โดย Bridge ไปยัง vSwitch เดียวกับที่ pfSense LAN ใช้ จากนั้น กำหนด Static IP ผ่าน Netplan (ดู [หัวข้อ 1](#1-ข้อกำหนดด้านเครือข่าย))

---

### ปัญหาที่ 4: NIC ใหม่ขึ้นมาพร้อม DHCP IP แทน Static IP ใน Netplan

**อาการ:** `ip a` แสดง `ens19` ที่มี IP `10.10.10.103/24` พร้อม `valid_lft` นับถอยหลัง — แม้ว่า `/etc/netplan/*.yaml` ระบุ `10.10.10.50/24` พร้อม `dhcp4: false` ชัดเจน

**สาเหตุ:** ไฟล์ Netplan ถูกต้องบน Disk แต่ยังไม่ถูก Apply จริง — Interface รับ IP จาก DHCP Server บน Subnet นั้นเมื่อ Link ขึ้นมาครั้งแรก

**วิธีแก้:**
```bash
sudo netplan apply
# หากยังไม่มีผลทันที:
sudo ip addr flush dev ens19
sudo netplan apply
```

---

### ปัญหาที่ 5: Static IP กลับไปเป็น DHCP อีกครั้งหลัง VM Reboot

**อาการ:** หลัง Stop/Start VM แล้ว `ens19` กลับมาพร้อม DHCP Lease ทำให้ Syslog Path ขาดจนกว่าจะแก้ใหม่

**สาเหตุ:** ไม่ได้ระบุ `renderer` ในไฟล์ Netplan บน Ubuntu บางรุ่น NetworkManager และ systemd-networkd ที่ Generate โดย Netplan อาจแข่งกันจัดการ Interface เดียวกันตอน Boot หากไม่ระบุ Renderer ชัดเจน NetworkManager อาจชนะและ Apply DHCP แทน

**วิธีแก้:** เพิ่ม `renderer: networkd` ที่ระดับ Top-level ของ Netplan config เพื่อบังคับให้ใช้ systemd-networkd ตลอดเวลา:
```yaml
network:
  version: 2
  renderer: networkd
  ...
```

---

### ปัญหาที่ 6: `ping` จาก pfSense ไปยัง Wazuh คืน `sendto: Host is down` — ARP Entry ค้างเป็น `(incomplete)`

**อาการ:** แม้ยืนยัน Static IP ถูกต้องทั้งสองฝั่งแล้ว `arp -a` ของ pfSense แสดง `10.10.10.50` เป็น `(incomplete)` และ `expired` ในขณะที่ Host อื่นบน Subnet เดียวกัน Resolve ได้ปกติ

**สาเหตุ:** ARP Cache เก่าค้างอยู่จากก่อน VM ของ Wazuh จะ Reboot/เปลี่ยน IP — pfSense ยังไม่ Resolve MAC Address ใหม่สำหรับ Interface State ที่เปลี่ยนไป

**วิธีแก้:** ไม่ต้องทำอะไรเพิ่มนอกจากรอ/ลองใหม่ — เมื่อ VM ขึ้นมาสักพักและ ARP Request Cycle ใหม่เสร็จสิ้น `ping` ก็สำเร็จเอง ยืนยันด้วย `ping -c 4 10.10.10.50` ก่อนดำเนินการต่อ

**บทเรียน:** Error "host is down" / ARP `(incomplete)` ไม่ได้หมายความว่า Config ผิดเสมอไป — ตรวจสอบ IP ทั้งสองฝั่งก่อนสรุปว่า Misconfigured

---

### ปัญหาที่ 7: Events `filterlog` ถึง Manager แต่ "No decoder matched"

**อาการ:** `wazuh-logtest` บน Log บรรทัดจริงที่ Capture มาแสดง:
```
**Phase 2: Completed decoding.
        No decoder matched.
```

**สาเหตุ:** Decoder เขียนให้ Match บน `<program_name>filterlog</program_name>` แต่เพราะ Syslog Line มี Prefix ผิดปกติที่ `wazuh-remoted` ใส่ผ่าน Syslog Connection (`wazuh->10.10.10.1 Jul 9 ... filterlog[...]:`), Pre-decoder ของ Wazuh ไม่สามารถ Extract Field `program_name` ได้เลย

**วิธีแก้:** เปลี่ยน Decoder เป็น `<prematch>filterlog</prematch>` ซึ่งเช็คเพียงว่า String `filterlog` ปรากฏในบรรทัดไหนก็ได้ — ไม่ขึ้นกับโครงสร้าง Syslog Header

---

### ปัญหาที่ 8: Rule โหลดไม่ได้ — `Field 'action' is static`

**อาการ:**
```
wazuh-analysisd: ERROR: Failure to read rule 100101. Field 'action' is static.
```

**สาเหตุ:** `action` เป็น Reserved Field Name ใน Wazuh ที่ Active-response Subsystem ใช้ภายใน การตั้งชื่อ Custom Decoder Field เป็น `action` ทำให้ Conflict กัน

**วิธีแก้:** เปลี่ยนชื่อ Field เป็น `fw_action` ทั้งใน `<order>` ของ Decoder และ `<field name="...">` ใน Rule

---

### ปัญหาที่ 9: Rule ยังไม่ Fire แม้ Decoder Extract Fields ถูกต้องแล้ว

**อาการ:** `wazuh-logtest` Phase 2 แสดง Fields ถูก Decode ครบถ้วน (`srcip`, `dstip`, `fw_action` ฯลฯ) แต่ Phase 3 (Rule Filtering) ไม่ปรากฏใน Output เลย

**สาเหตุ:** Rule อ้าง `<decoded_as>pfsense-filterlog-fields</decoded_as>` (ชื่อ Child Decoder ที่มี Regex/Fields จริง) แต่ Decoder Inheritance ของ Wazuh ตั้ง `<use_own_name>` เป็น `no` โดยค่าเริ่มต้น — หมายความว่า Child Decoder รายงานชื่อของ *Parent* (`pfsense-filterlog`) สำหรับการ Match Rules แม้ Fields ของ Child จะถูก Apply จริง Rule จึงตรวจสอบชื่อที่ไม่เคยถูก Decode

**วิธีแก้:** เปลี่ยน Rule เป็น `<decoded_as>pfsense-filterlog</decoded_as>` (ชื่อ Parent) แทน (อีกทางเลือกคือเพิ่ม `<use_own_name>yes</use_own_name>` ใน Child Decoder แต่ไม่ได้เลือกทางนี้)

---

### ปัญหาที่ 10: Alerts ยืนยันว่า Fire ผ่าน `wazuh-logtest` แต่ Dashboard แสดง "No results match your search criteria"

**อาการ:** หน้า Threat Hunting ไม่แสดงผลสำหรับ `rule.groups: pfsense` แม้ Alerts จะ Generate บนฝั่ง Manager ชัดเจน

**สาเหตุ:** มีสองปัจจัยที่ซ้อนกัน:
1. Time Range Picker ของ Dashboard ตั้งค่าเริ่มต้นเป็นช่วงเวลาแคบ/เก่าที่ไม่ครอบคลุมเวลาที่ Alerts ถูก Generate จริง
2. ระหว่างสืบสวน Warning `IndexerConnector initialization failed` ใน `ossec.log` ถูกสงสัยว่าเป็นสาเหตุ — แต่กลายเป็น Unrelated

**วิธีแก้:** ขยาย Time Range เป็น "Last 1 day" / "Last 7 days" ใน Date Picker ของ Threat Hunting Alerts ปรากฏทันทีเมื่อกำหนด Window ถูกต้อง

**หมายเหตุสำคัญ:** Warning `IndexerConnector` อ้างถึง Index `wazuh-states-inventory-*` และ `wazuh-states-vulnerabilities-*` — เหล่านี้เป็นของฟีเจอร์ Vulnerability-detection/Inventory แยกต่างหาก **ไม่ใช่** Pipeline `wazuh-alerts-*` ที่ Threat Hunting Query (ซึ่ง Flow ผ่าน Filebeat) ตรวจสอบสุขภาพของ Filebeat อย่างอิสระ:
```bash
sudo filebeat test output   # talk to server... OK
```
อย่าเสียเวลาไล่ Warning เหล่านี้เมื่อ Debug Alerts — ตรวจสอบ Status ของ Filebeat โดยตรงแทน

---

### ปัญหาที่ 11: Visualization แสดง "No results found" ระหว่างสร้าง Dashboard

**อาการ:** Date Histogram Visualization ที่สร้างใหม่ไม่แสดงข้อมูลแม้มี Alerts อยู่

**สาเหตุ:** Time Range Picker ของ Visualization (แยกต่างหากจากที่ใช้ใน Threat Hunting ก่อนหน้า) มี Timestamp Start และ End ที่เหมือนกัน (Window เป็นศูนย์) และ End Date ค้างอยู่ที่วันก่อนหน้าในขณะที่ Alerts มีวันที่วันถัดไป

**วิธีแก้:** Reset Time Range เป็น "Last 24 hours" ใน Visualization Editor ด้วยตนเองและคลิก **Update**

---

## 🚀 แนวทางต่อยอด

- [ ] ยกเว้น Discovery Ports ทั่วไป (1900, 5353, 57621) จาก Port-scan Frequency Rule หรือแยกเป็น Rule ลำดับความสำคัญต่ำแยกต่างหาก
- [ ] ขยาย Decoder ให้รองรับ IPv6 `filterlog` Entries (Field Count/Order แตกต่างกัน)
- [ ] เพิ่ม Decoder/Rule สำหรับ pfSense DHCP Events
- [ ] Correlate Blocked Source IPs กับ AD/DNS Lab Subnets เพื่อตรวจจับ Cross-VLAN Policy Violations
- [ ] เพิ่ม Suricata เป็น Data Source ที่ 2 ที่ Feed เข้า Dashboard เดียวกัน เพื่อการ IDS Coverage ระดับ Packet ที่ลึกขึ้น

## 💡 บทเรียนสำคัญ

1. **Static IP บน Linux ต้องระบุ `renderer` ใน Netplan อย่างชัดเจน** หาก NetworkManager อยู่ด้วย — มิฉะนั้น Reboot อาจทำให้ DHCP เงียบๆ กลับมาแทนที่
2. **ARP Cache อาจเก่าค้างข้าม VM Reboot** แม้ Config IP ทั้งสองฝั่งถูกต้อง — Error "host is down" ไม่ได้หมายความว่า Misconfigured เสมอ บางครั้งแค่รอให้ Entry เก่า Expire แล้วลองใหม่
3. **Decoder/Rule Engine ของ Wazuh มี Reserved Words และค่า Default ที่ไม่ชัดเจนหลายตัว** (`action` เป็น Field Name, พฤติกรรม `use_own_name`) ที่สร้าง Error คลุมเครือหากไม่รู้ว่าต้องมองหาอะไร
4. **ทดสอบด้วย `wazuh-logtest` ก่อนแตะ Live Config เสมอ** จะจับ Decoder/Rule Mismatch ได้ทันทีโดยไม่ต้องรอ Real Traffic หรือ Restart Services ซ้ำๆ
5. **Trace Pipeline ทีละ Hop เมื่อ Debug** (เครือข่าย → รับ Syslog → Decode → Rule → Indexer → Dashboard) แทนที่จะสมมติว่ามีจุดล้มเหลวเดียว — ในแล็บนี้ปัญหาหลายจุดที่เป็นอิสระต่อกัน (IP Reset, ARP Staleness, Decoder Syntax, Reserved Field Names, Decoder Name Inheritance) ต่างบล็อก Stage ต่างกันในลำดับ
