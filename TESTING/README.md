# 🧪 Interlink Backend Testing Suite

โฟลเดอร์นี้รวบรวมการทดสอบทั้งหมดของ Interlink Backend API System

## 📁 โครงสร้างโฟลเดอร์

```
TESTING/
├── README.md                         # คู่มือการทดสอบหลัก
├── 01_Authentication/                # การทดสอบระบบ Authentication
├── 02_Authorization_RBAC/            # การทดสอบระบบ Authorization & RBAC
├── 03_API_Validation/                # การทดสอบ Input Validation
├── 04_System_Health/                 # การทดสอบสุขภาพระบบ
├── 05_Database/                      # การทดสอบ Database & Data Integrity
├── 06_Brand_Management/              # การทดสอบ Brand Management APIs
├── 07_Store_Management/              # การทดสอบ Store Management APIs
├── 08_Product_Management/            # การทดสอบ Product Management APIs
├── 09_Store_Brand_Entitlements/      # การทดสอบ Store-Brand Entitlements APIs
├── 10_Stock_Management/              # ✅ การทดสอบ Stock Management APIs (Phase 4)
├── 11_Order_Management/              # ✅ การทดสอบ Order Management APIs (Phase 4)
├── 12_File_Upload/                   # ✅ การทดสอบ File Upload System (Phase 5)
├── 13_Storefront_APIs/               # ✅ การทดสอบ Storefront APIs (Phase 5)
├── 14_Two_Factor_Auth/               # ✅ การทดสอบ Two-Factor Authentication (2FA)
├── 15_Social_Login/                  # ✅ การทดสอบ Social Login Integration
└── 99_Results/                       # ผลการทดสอบล่าสุด
```

## 🎯 วัตถุประสงค์การทดสอบ

1. **ความปลอดภัย** - ทดสอบ Authentication, Authorization, RBAC
2. **ความถูกต้อง** - ทดสอบ Input Validation, Data Integrity
3. **ประสิทธิภาพ** - ทดสอบ Response Time, Error Handling
4. **เสถียรภาพ** - ทดสอบ System Health, Database Connection

## 🚀 การเริ่มต้นทดสอบ

### ข้อกำหนดเบื้องต้น:
- ✅ Backend server running: `http://localhost:3001`
- ✅ Database connected (PostgreSQL)
- ✅ Docker services running (optional)

### ลำดับการทดสอบแนะนำ:
1. **System Health** (`04_System_Health/`) - ตรวจสอบระบบพร้อมใช้งาน
2. **Authentication** (`01_Authentication/`) - ทดสอบการ login
3. **Authorization & RBAC** (`02_Authorization_RBAC/`) - ทดสอบสิทธิ์
4. **API Validation** (`03_API_Validation/`) - ทดสอบ input validation
5. **Database** (`05_Database/`) - ทดสอบข้อมูล
6. **Brand Management** (`06_Brand_Management/`) - ทดสอบ Brand APIs
7. **Store Management** (`07_Store_Management/`) - ทดสอบ Store APIs
8. **Product Management** (`08_Product_Management/`) - ทดสอบ Product APIs
9. **Store-Brand Entitlements** (`09_Store_Brand_Entitlements/`) - ทดสอบ Entitlement APIs
10. **✅ Stock Management** (`10_Stock_Management/`) - ทดสอบ Stock & Reservation APIs (Phase 4)
11. **✅ Order Management** (`11_Order_Management/`) - ทดสอบ Order Processing APIs (Phase 4)
12. **✅ File Upload** (`12_File_Upload/`) - ทดสอบ File Upload & Storage Providers (Phase 5)
13. **✅ Storefront APIs** (`13_Storefront_APIs/`) - ทดสอบ Public E-commerce APIs (Phase 5)
14. **✅ Two-Factor Authentication** (`14_Two_Factor_Auth/`) - ทดสอบ 2FA TOTP & Backup Codes
15. **✅ Social Login** (`15_Social_Login/`) - ทดสอบ Google/Facebook Login Integration

## 📊 มาตรฐานการทดสอบ

### ✅ เกณฑ์ผ่าน:
- HTTP Status codes ถูกต้อง
- Response format ถูกต้องตาม API spec
- Security controls ทำงานได้
- Error handling เหมาะสม

### ❌ เกณฑ์ไม่ผ่าน:
- HTTP 5xx errors (server errors)
- Security vulnerabilities
- Data corruption
- Incorrect business logic

## 🛠️ เครื่องมือทดสอบ

- **cURL** - Command line HTTP testing
- **Swagger UI** - Interactive API testing
- **Prisma Studio** - Database inspection
- **Adminer** - Database management

## 📝 การบันทึกผลลัพธ์

ผลการทดสอบทั้งหมดจะถูกบันทึกใน `99_Results/` พร้อม:
- วันที่และเวลาทดสอบ
- สถานะการทดสอบแต่ละหมวด
- ปัญหาที่พบและการแก้ไข
- ข้อเสนอแนะปรับปรุง

---

## 📊 สรุปจำนวนการทดสอบ

**รวม: 140+ Test Cases**
- 🔐 Authentication: 8 tests
- 🛡️ Authorization/RBAC: 8 tests  
- ✅ API Validation: 13 tests
- 💚 System Health: 12 tests
- 🗄️ Database: 15 tests
- 🏷️ Brand Management: 10 tests
- 🏪 Store Management: 12 tests
- 📦 Product Management: 15 tests
- 🔗 Store-Brand Entitlements: 12 tests
- 📦 **✅ Stock Management**: 11+ tests (Phase 4)
- 🛒 **✅ Order Management**: 10+ tests (Phase 4)
- 📁 **✅ File Upload**: 12+ tests (Phase 5)
- 🛒 **✅ Storefront APIs**: 12+ tests (Phase 5)

---

*Last Updated: 2025-09-07*  
*Status: 🧪 Phase 5 Testing Suite Ready - 140+ Test Cases Available*