# สรุปโปรเจค: ระบบ Point & Carbon Credit สำหรับมหาวิทยาลัย

## 1. ภาพรวมโปรเจค

ระบบสำหรับมหาวิทยาลัยเพื่อส่งเสริมการประหยัดพลังงาน โดยรับข้อมูลการใช้งานจาก App ภายนอก (แอปหมวกกันน็อค, แอป PromptGo รถไฟฟ้า) แล้ว:

- ให้ **point** แก่ user เพื่อนำไปแลกของรางวัล
- คำนวณ **carbon credit** เพื่อโชว์เป็นสถิติ dashboard (ไม่มีการแลก/ใช้ carbon credit ผ่าน smart contract โดยตรง)

**สเกลเป้าหมายปัจจุบัน**: ทดสอบที่ ~500 user/วัน จาก PromptGo (ออกแบบให้ขยายรองรับมากกว่านี้ได้ในอนาคตโดยไม่ต้อง rewrite)

---

## 2. โครงสร้างโปรเจค (Monorepo)

```
project-root/
├── apps/
│   ├── backend/                      # Node.js (Next.js API) + TypeScript — backend เดียว
│   │   ├── src/
│   │   │   ├── modules/
│   │   │   │   ├── activity/               # รับ activity, คำนวณ point/carbon credit
│   │   │   │   │   ├── activity.controller.ts
│   │   │   │   │   ├── activity.service.ts   # v1: return point คงที่ = 1
│   │   │   │   │   └── activity.schema.ts    # zod validation
│   │   │   │   ├── point/                  # เขียน point_log, ดึงยอด point ต่อ user
│   │   │   │   ├── carbon-credit/          # เขียน carbon_credit_log (status pending)
│   │   │   │   ├── wallet/                 # gen wallet_id ผูก user_id แบบ 1:1
│   │   │   │   ├── redemption/             # แลกของรางวัล ตัด point
│   │   │   │   ├── external-api/           # auth middleware: API key + HMAC + timestamp
│   │   │   │   └── admin/                  # จัดการของรางวัล, ดู log
│   │   │   ├── jobs/
│   │   │   │   └── daily-settlement.job.ts # cron/queue 18:00 รวมยอด + ยิงเข้าเชน
│   │   │   ├── blockchain/
│   │   │   │   ├── contract.client.ts      # ethers.js เชื่อม contract
│   │   │   │   └── relayer.wallet.ts       # จัดการ relayer wallet + nonce
│   │   │   ├── db/
│   │   │   │   ├── schema.prisma
│   │   │   │   └── migrations/
│   │   │   └── middleware/
│   │   │       ├── auth.ts                 # verify API key + HMAC
│   │   │       └── rate-limit.ts
│   │   └── package.json
│   │
│   ├── web-user/                     # Next.js — แลกของ, point, ประวัติ, dashboard carbon credit
│   └── web-admin/                    # Next.js — จัดการของรางวัล, ดู log/สถิติรวม
│
├── packages/
│   ├── contracts/                    # Hardhat project (Solidity)
│   │   ├── contracts/
│   │   │   └── CarbonCredit.sol
│   │   ├── test/
│   │   └── scripts/deploy.ts
│   └── shared-types/                 # type ใช้ร่วมกันทุก app (Activity, Point, CarbonCredit)
│
└── infra/
    ├── docker-compose.yml            # postgres สำหรับ local dev
    └── .env.example
```

**หมายเหตุสำคัญ**: "Activity" เป็นแค่ **module ภายใน backend เดียวกัน** ไม่ใช่ backend/service แยกต่างหาก — เพราะสเกล 500 user/วันไม่จำเป็นต้องแยก microservice ให้ทำเป็น **modular monolith** (backend เดียว แยกโค้ดเป็นส่วนๆ ชัดเจน) เผื่ออนาคตอยากแยกจริงจะทำได้ง่าย

---

## 3. Tech Stack และเวอร์ชันแนะนำ (เช็คล่าสุด ก.ค. 2026)

| ส่วน | เทคโนโลยี | เวอร์ชันแนะนำ | หมายเหตุ |
|---|---|---|---|
| Runtime | Node.js | **24.x (Active LTS)** | รองรับถึง เม.ย. 2028 — อย่าใช้ Node 26 เพราะยังเป็น "Current" ไม่ใช่ LTS จนกว่าจะถึง ต.ค. 2026 |
| Package manager | npm | 10.x (มากับ Node 24) | ไม่ต้องติดตั้งแยก |
| Backend framework | Next.js (API routes) | 16.2.x | ต้องการ Node.js >= 20.9 ขึ้นไป, ใช้ Turbopack เป็น default bundler |
| Language | TypeScript | 5.7+ | ใช้ทั้ง backend และ frontend |
| Frontend framework | Next.js (App Router) | 16.2.x | เดียวกับ backend, ใช้ React 19.2 |
| Database | PostgreSQL | 16.x หรือ 17.x | ใช้ผ่าน Prisma ORM |
| ORM | Prisma | ล่าสุด (6.x) | จัดการ schema + migration |
| Job queue | BullMQ + Redis | ล่าสุด | สำหรับ daily settlement job (แนะนำแทน cron ธรรมดา เผื่อ retry/scale) |
| Blockchain framework | Hardhat | **3.x (stable)** | Hardhat 3 เสถียรและ production-ready แล้ว, รันไทม์ใหม่เขียนด้วย Rust เร็วกว่าเดิม |
| Smart contract language | Solidity | 0.8.28 | เวอร์ชันที่ Hardhat รองรับเต็มรูปแบบ |
| Ethereum library | ethers.js | v6.x | เชื่อม backend กับ contract |
| RPC provider | Infura | - | ต่อกับ Polygon, ควรมี backup RPC (เช่น Alchemy) |
| Testnet | **Polygon Amoy** | - | Mumbai testnet เลิกใช้แล้ว ใช้ Amoy แทน |
| Mainnet (ตอน production) | Polygon (public) | - | สลับจาก testnet ตอนใช้งานจริง |

---

## 4. Data Flow หลัก

### Point
1. App (helmet/PromptGo) ยิง `POST /api/v1/activity`
2. Backend คำนวณ point (v1: return ค่าคงที่ = 1)
3. เขียนลง `point_log` **ทันที** (synchronous)
4. Frontend อ่าน point แบบ near real-time ตรงจาก DB

### Carbon Credit
1. Activity คำนวณเสร็จ → insert ลง `carbon_credit_log` สถานะ `pending` (**ไม่แตะเชนทันที**)
2. ทุกวันเวลา **18:00** → cron/queue job รวมยอด carbon credit ต่อ `wallet_id` ทั้งวัน
3. ยิง batch transaction เข้า smart contract (แบ่ง chunk ~100-150 user/tx ถ้า user เยอะ เพื่อไม่ให้ tx ใหญ่เกินไป)
4. tx confirm สำเร็จ → update สถานะเป็น `confirmed` พร้อม `tx_hash`, `batch_id`
5. Dashboard อ่านจาก DB ที่ sync แล้ว **ไม่ query เชนสด**

**เหตุผลที่ต้อง batch แทน real-time**: ประหยัด base gas cost (21,000 gas/tx จ่ายซ้ำทุกครั้งถ้ายิงทีละ tx), หลีกเลี่ยง cold storage write ที่แพง, ควบคุม gas price ได้ดีกว่า, ลดภาระ monitor MATIC balance ของ relayer wallet

---

## 5. Database Schema (แนวคิดหลัก — PostgreSQL ตัวเดียว แยก table)

```
-- Point: เขียนทันที ไม่มีสถานะรอ
point_log:
  id, user_id, activity_id, point_amount, created_at

-- Carbon credit: มี lifecycle รอ batch settlement
carbon_credit_log:
  id, user_id, wallet_id, activity_id,
  amount,
  status,        -- pending / confirmed / failed
  batch_id,      -- อ้างอิง batch ที่ถูกส่งขึ้นเชน (nullable จนกว่าจะส่ง)
  tx_hash,       -- nullable จนกว่า confirm
  created_at, settled_at

-- Wallet mapping: backend gen เอง ผูก user_id แบบ 1:1
wallet:
  wallet_id (UUID), user_id, created_at

-- External API clients
api_client:
  id, app_name,           -- "helmet" / "promptgo"
  api_key_hash, secret_hash,
  is_active, rate_limit_per_min, created_at
```

**Index ที่ควรมีตั้งแต่ต้น**: `user_id`, `status`, `created_at` บน `carbon_credit_log` เพื่อรองรับ query ตอนข้อมูลเยอะขึ้น

---

## 6. Wallet Mapping

- `wallet_id` = UUID ที่ **backend gen เอง** ผูกกับ `user_id` แบบ 1:1 ใน DB — ไม่ใช่ private key จริงของ user
- บนเชนมีแค่ **relayer wallet เดียว** ที่ backend ถือ เป็นคนเดียวที่มีสิทธิ์เขียนเข้า contract (ผ่าน Access Control) — ไม่ต้องสร้าง wallet จริงให้ทุก user ลดความซับซ้อนเรื่อง private key management ได้มาก

---

## 7. External API (สำหรับ App หมวกกันน็อค / PromptGo)

### API Contract
```
POST /api/v1/activity
Headers:
  X-API-Key: <ต่อ app>
  X-Signature: HMAC-SHA256(body, secret)
  X-Timestamp: unix timestamp

Body:
{
  "source_app": "helmet" | "promptgo",
  "user_id": "string",
  "activity_type": "helmet_use" | "ev_scooter_use",
  "occurred_at": "ISO8601",
  "request_id": "uuid"     // idempotency key กัน point ซ้ำ
}

Response 200:
{
  "point_awarded": 1,
  "carbon_credit_awarded": null,
  "status": "accepted",
  "log_id": "uuid"
}
```

### Security
- API key แยกต่อ app (helmet, PromptGo คนละ key) เก็บ hash ไม่เก็บ plain text
- HMAC signature verify ก่อนประมวลผลทุก request
- Timestamp + reject ถ้าห่างเกิน 5 นาที (กัน replay attack)
- HTTPS only + rate limit ต่อ API key
- `request_id` เป็น idempotency key กัน App ยิงซ้ำแล้วได้ point ซ้ำ

### สิ่งที่ทำได้เลยตอนนี้แม้ยังไม่มี App จริง
1. Fix endpoint + auth middleware ให้พร้อม
2. Seed `api_client` 2 แถว (helmet, promptgo) พร้อม key/secret ทดสอบ
3. เขียน mock client script จำลอง App ยิง request เข้ามา
4. เอกสาร API 1 หน้า (endpoint, header, วิธีคำนวณ signature, ตัวอย่าง request/response) ส่งให้ทีม App

---

## 8. Blockchain: กลยุทธ์ประหยัด Gas (3 ระดับ)

### ระดับ 1: Batch รายวัน (ตัดสินใจแล้ว)
รวม carbon credit ทั้งวันเป็น transaction เดียว (หรือแบ่ง chunk ถ้า user เยอะ) ยิงตอน 18:00

### ระดับ 2: ปรับ data type + gas optimization
- ใช้ `uint256` แทน string สำหรับ wallet identifier
- ใช้ `unchecked` ใน loop counter (Solidity 0.8+ เช็ค overflow ทุก operation โดย default)

```solidity
function batchAddCredit(uint256[] calldata userIds, uint256[] calldata amounts) external onlyBackend {
    require(userIds.length == amounts.length, "length mismatch");
    uint256 len = userIds.length;
    for (uint256 i = 0; i < len; ) {
        creditOf[userIds[i]] += amounts[i];
        unchecked { ++i; }
    }
}
```

### ระดับ 3: Merkle root รายวัน (ประหยัดสุด — ยังไม่ได้ตัดสินใจ)
แทนที่จะเขียน mapping ต่อ user บนเชน ให้คำนวณ Merkle tree ของยอดทั้งวัน off-chain แล้วส่งแค่ **root เดียว** (32 bytes) เข้าเชน — gas คงที่ไม่ว่าจะมี user กี่คน

```solidity
mapping(uint256 => bytes32) public dailyRoot;
function commitDaily(uint256 day, bytes32 root) external onlyBackend {
    dailyRoot[day] = root;
}
```

**เงื่อนไขการเลือก**:
| ต้องการให้ user verify ยอดตรงจาก contract เอง (ไม่ผ่าน backend)? | แนะนำ |
|---|---|
| ไม่จำเป็น — โชว์ dashboard ผ่าน backend พอ | **Merkle root** (ประหยัดสุด, scale ไม่จำกัด) |
| ต้องการ — ให้ third-party ตรวจสอบผ่าน contract ได้ตรง | Mapping ต่อคน (แพงกว่าแต่โปร่งใสกว่า) |

**สถานะ**: ยังรอการตัดสินใจสุดท้ายจากเจ้าของโปรเจค

### เปรียบเทียบ Gas
| วิธี | Gas ต่อวัน (500 user) | สเกลได้ถึงกี่คน |
|---|---|---|
| Real-time ทีละ tx | ~500 tx | แย่มาก |
| Batch mapping ต่อคน | 4-5 tx (~10M gas) | สเกลตามจำนวน user เชิงเส้น |
| Merkle root เดียว | 1 tx เล็กมาก (~50k gas) | คงที่ ไม่จำกัดจำนวน user |

---

## 9. แผนทดสอบ 500 User/วัน

1. **Amoy testnet**: ขอ test MATIC จาก faucet ให้พอสำหรับหลาย transaction ต่อรอบ
2. **Seed test user 500 คน**: สร้าง user_id + wallet_id ปลอมใน DB ล่วงหน้า
3. **Mock script**: จำลอง App ยิง 500 activity กระจายตลอดวัน
4. **ทดสอบ batch settlement**: เช็คจำนวน record `pending` → `confirmed` ครบถ้วน, วัด gas ที่ใช้จริง, ทดสอบ failure case (RPC ล่ม, MATIC ไม่พอ) ว่า retry logic ทำงานถูกต้องไม่ mint ซ้ำ
5. **ทดสอบ concurrency**: backend ต้องรองรับ concurrent write โดยไม่ชน (DB transaction + unique constraint บน `request_id`)

**ขนาด batch ที่แนะนำ**: chunk ละ 100-150 user/transaction (500 user ≈ 4-5 transaction ต่อรอบ) เพื่อไม่ให้ tx ใหญ่เกินไปจนเสี่ยง RPC timeout

---

## 10. ออกแบบเผื่ออนาคต (รองรับ user มากกว่า 500/วัน)

**ทำได้อยู่แล้วโดยไม่ต้องแก้ไขโครงสร้าง**:
- Batch chunk size ปรับผ่าน config/env ไม่ hardcode
- ใช้ BullMQ + Redis แทน cron ธรรมดา ตั้งแต่ต้น (รองรับ retry, scale เป็น multiple worker)
- Database index ตั้งแต่ต้น
- Relayer wallet abstraction แยกไฟล์ชัดเจน เผื่อขยายเป็น multi-relayer
- API versioning (`/api/v1/`) เผื่อออก v2 โดยไม่กระทบ App เดิม
- Merkle root (ถ้าเลือกใช้) scale ได้ไม่จำกัดอยู่แล้ว

**ยังไม่ต้องทำตอนนี้**: microservice แยกจริงจัง, database sharding, multi-region deployment, message broker หนักๆ (Kafka)

---

## 11. สิ่งที่ยังต้องตัดสินใจ / รอข้อมูลเพิ่ม

1. **Merkle root vs Mapping ต่อคน** — ต้องการให้ user verify ยอดตรงจาก smart contract เองไหม
2. **สูตรคำนวณ point/carbon credit จริง** — ตอนนี้ยัง fix เป็น point = 1 คงที่ รอสูตรจริงจากทีม
3. **API spec จาก App หมวกกันน็อค/PromptGo จริง** — ตอนนี้ทำ contract ฝั่งเราไว้ก่อน รอทีม App มาต่อ
4. **จำนวน user สูงสุดที่คาดว่าจะรองรับในอนาคต** — เพื่อกำหนด chunk size และตัดสินใจเรื่อง merkle root

---

## 12. ลำดับการเริ่มพัฒนาแนะนำ

1. DB schema (Prisma) + Activity API v1 (return point = 1 คงที่) — ไม่ต้องรอ blockchain
2. Mock client script + เอกสาร API สำหรับทีม App ภายนอก
3. Frontend user/admin — ทำคู่ขนานได้เลยตั้งแต่ step 1
4. Smart contract บน local Hardhat network (unit test ครบก่อน)
5. Deploy ขึ้น Polygon Amoy testnet + ต่อผ่าน job queue เต็มระบบ
6. ทดสอบ integration เต็มระบบด้วย 500 user จำลอง
7. สลับเป็น Polygon mainnet ตอน production จริง
