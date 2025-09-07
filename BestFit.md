สถาปัตยกรรมแนะนำ (Best Fit)


1) โครงสร้างระบบ (Modular Monolith)

- Frontend: Next.js (App Router)
	- Storefront (หน้าร้าน) ใช้ ISR/SSR
	- Admin/Store Dashboard ใช้ CSR + API
- Backend: NestJS (แยกเป็นโมดูล)
	- auth, users, stores, brands, products, entitlements,
	  stocks, orders, reservations, billing (subscription),
	  payments (เตรียม interface), reporting, notifications
- Database: PostgreSQL (1 instance)
	- แยกตารางด้วย store_id/tenant_id, ใส่ index สำคัญ
	- วางโครง RLS incremental (เริ่มบังคับที่ service layer + เตรียม policy)
- Background jobs: เริ่มแบบ in‑process scheduler (node‑cron)
	- งาน: expire/rescue reservation, ส่งอีเมล/ไลน์
	- อนาคตค่อยเพิ่ม Redis + BullMQ เมื่อมีทราฟฟิก
- File/Object storage: เก็บรูปสินค้า (S3‑compatible หรือ local + Cloudflare proxy)
- Caching/Search:
	- Cache: Next.js ISR + API-level cache (in‑memory/Redis หลังจากโต)
	- Search: เริ่มใช้ Postgres full‑text → โตค่อย Meilisearch/OpenSearch

ทำไมไม่มี Redis ตอนแรก? — เพื่อลดต้นทุน/ซับซ้อน เริ่มจาก DB+Cron พอ (สเกลได้จริงถ้าดีไซน์ atomic)

---

2) โมเดลข้อมูล (แกนหลัก)

ตารางสำคัญ (คีย์ ๆ + อินเด็กซ์จำเป็น)
- stores(id, name, status, subscription_status, ... )
- brands(id, name, status, ...)
- store_brand_entitlements(id, store_id, brand_id, pricing_mode /*'CENTRAL'|'STORE'*/, effective_from, effective_to, UNIQUE(store_id, brand_id))
- products(id, brand_id, name, sku, status, has_variants, ...)
  INDEX (brand_id, status)
- product_variants(id, product_id, variant_sku, attrs_json /*สี/ไซต์*/, status)
  UNIQUE (product_id, variant_sku)
- store_stock(id, store_id, product_id, variant_id NULLABLE, available_qty, reserved_qty, sold_qty, price_central, price_store, last_changed_at)
  INDEX (store_id, product_id, COALESCE(variant_id,'0000...'))
- orders(id, store_id, customer_id, status, cancel_reason, created_at, confirmed_at, ...)
  INDEX (store_id, status, created_at)
- order_items(id, order_id, product_id, variant_id, qty, unit_price)
- reservations(id, store_id, order_id, product_id, variant_id, qty, expires_at, status /*ACTIVE|RELEASED|APPLIED*/)
  INDEX (store_id, expires_at, status)
- customers(id, phone, email, name, address_json, ...) (guest allowed)
- payments(id, order_id, provider, status, amount, intent_ref, ...) (เตรียมไว้)
- subscriptions(id, store_id, plan, cycle, status, next_due_at, ...)
- events_audit(id, entity, entity_id, action, actor_id, meta_json, created_at) (tracking ทุกจุดสำคัญ)

ราคา: ถ้า pricing_mode='CENTRAL' → ใช้ price_central, ถ้า 'STORE' → ใช้ price_store

---

3) การจองสต๊อก & ความถูกต้อง (รองรับ peak 100–200 rps)

หลักการ: Atomic update + Idempotency + TTL
- จอง (เมื่อสั่งซื้อ):
	- บันทึก reservations (ACTIVE, expires_at = now()+60m)
	- ใช้ idempotency_key ที่ฝั่ง API ต่อ 1 checkout (กันกดย้ำ)
- ยืนยันออเดอร์:
	- เซ็ต orders.status=CONFIRMED
	- reservations → APPLIED
	- อัปเดต sold_qty = sold_qty + :q (ไม่แตะ available/reserved อีก)
- ยกเลิก/หมดเวลา:
	- reservations → RELEASED
	- ทำงานผ่าน scheduler ทุก 1–5 นาที โดย index (store_id, expires_at, status)
- ระดับ Isolation: ใช้ READ COMMITTED + atomic update เงื่อนไข (available_qty >= :q) เพียงพอต่อ throughput สูง และง่ายกว่าการ lock row ยาว ๆ
---

4) สถานะออเดอร์ (รอบแรก)

- PENDING (สร้าง/จองสต๊อก) → CONFIRMED (ยืนยัน/ตัดสต๊อกแล้ว) → CANCELLED (คืนสต๊อก)
- เก็บ cancel_reason (code + free text) เพื่อรายงานคุณภาพร้าน/แคมเปญ

อนาคต: PAID,PACKING,SHIPPED,DELIVERED,REFUNDED

---

5) AuthN/AuthZ/OTP/SSO

- JWT (access+refresh), RBAC: ADMIN, STORE_ADMIN, STORE_STAFF, SALE, CUSTOMER_GUEST
- OTP: เริ่ม Email OTP (ส่งโค้ด 6 หลัก, rate‑limit ต่ออีเมล/IP) → ภายหลังเพิ่ม SMS
- SSO (ต้นทุนต่ำ):
	- เริ่มจาก Google Sign-In (ฟรี) สำหรับ Admin/Store/Sale
	- Apple Sign‑in ต้องมีค่า dev program → ไว้อนาคต
- RLS (phase‑in):
	- ระยะต้น: บังคับ filter store_id ทุก query ที่ service layer + integration test หนัก ๆ
	- ระยะถัดไป: เปิด Postgres RLS policy โดยเซ็ต SET LOCAL app.current_store_id ต่อ connection แล้ว policy แบบ USING (store_id = current_setting('app.current_store_id')::uuid)
---

6) ชำระเงิน & Subscription

- ช่วงแรก: แนบสลิป/โอน/COD
	- แบบฟอร์มอัปโหลดสลิป → payments.status='SUBMITTED' → ร้าน/แอดมินตรวจสอบ → PAID
- เตรียม payments interface รองรับ provider (Stripe/Omise/2C2P/PromptPay) แต่ ยังไม่เปิดใช้
- Subscription:
	- เกณฑ์รอบแรก: manual (แนบสลิป/ติดต่อ Line/Email)
	- มี subscriptions.next_due_at ให้ระบบเตือน/ปิดสิทธิ์อัตโนมัติเมื่อหมดอายุ
---

7) ความปลอดภัย & PDPA

- แยกสิทธิ์ตาม role + ตรวจ store_id ทุก endpoint
- เข้ารหัสข้อมูลอ่อนไหวที่จำเป็น (เช่น เบอร์โทร) ระดับแอป/DB
- reCAPTCHA (หรือเทียบเท่า) ที่ฟอร์มสำคัญ (OTP/checkout)
- สำรองข้อมูล: Nightly pg_dump + เก็บไว้ object storage 7–30 วัน
---

8) โครงสร้างโฮสติ้ง

เป้าคือ “เล็กแต่มั่นคง”
- 1 VPS ขนาดเล็ก‑กลาง (เช่น 2 vCPU / 4GB RAM) รัน Docker Compose:
	- nginx (reverse proxy, TLS), web (Next.js), api (NestJS), db (Postgres), scheduler (cron worker), mailhog (dev only)
	- เปิด HTTP/2, gzip/brotli, และ cache static ผ่าน nginx
- DNS/SSL/CDN: ใช้โซลูชัน ฟรี สำหรับ DNS/SSL proxy/CDN เบื้องต้น
- Backup: pg_dump คืนละ 1 ครั้ง → เก็บสู่ object storage (free/low‑cost tier)
- Observability:
	- เริ่มจาก structured JSON logs + healthcheck + Uptime monitor (free tier)
	- Error tracking ใช้บริการที่มี free plan (เช่น Sentry free)

ต้องการรองรับโปรพีค 100–200 rps: ช่วงต้นใช้เทคนิค atomic SQL + ISR + คิวงานเบา ๆ พอไหว ถ้าเริ่มชน: scale VPS เป็น 4–8GB, แยก DB ออกเป็น managed instance, ค่อยเพิ่ม Redis/BullMQ

---

9) Index สำคัญ (ยกตัวอย่าง)

- store_stock(store_id, product_id, COALESCE(variant_id,'000...'))
- reservations(store_id, status, expires_at)
- orders(store_id, status, created_at)
- products(brand_id, status), full‑text (name, sku)
- order_items(order_id)
---

10) แผนพัฒนา (ลำดับงานที่แนะนำ)

1. ตั้งโปรเจกต์ Next.js + NestJS + Prisma + Postgres + Docker Compose
2. ทำโมดูล auth, stores, brands, products(+variants), entitlements
3. ทำ store_stock + endpoint import สินค้าจาก catalog
4. ทำ orders + reservations (atomic flow + idempotency) + cancel reason
5. ทำ OTP email + Google SSO (สำหรับผู้ใช้แอดมิน/ร้าน)
6. ทำ dashboard ร้าน (ออเดอร์/สต๊อก/รายงานเบื้องต้น) + storefront + checkout (guest)
7. ทำ subscription manual + ปิดสิทธิ์ร้านที่หมดอายุ
8. เพิ่ม cron expire reservation + รายงานรวมฝั่ง admin
9. เขียน integration test สำหรับ multi‑tenant isolation + stock correctness
10. เตรียม interface payments (ยังไม่ผูก) + seed data + deploy