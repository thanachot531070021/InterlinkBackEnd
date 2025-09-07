# Setup Without Docker

สำหรับเครื่องที่ยังไม่ได้ติดตั้ง Docker หรือ Docker Desktop ยังไม่ทำงาน

## 🎯 เริ่มทำงานกับ Backend ทันที (ไม่ต้องมี Database)

### 1. ปรับแต่ง Environment Variable
แก้ไขไฟล์ `.env` ให้ comment DATABASE_URL:

```bash
# Database (comment this line to work without database)
# DATABASE_URL="postgresql://postgres:postgres123@localhost:5432/interlink"

# แทนที่ด้วย mock URL
DATABASE_URL="file:./dev.db"
```

### 2. แก้ไข Database Service ให้ทำงานแบบ Mock
```bash
cd interlink-backend
```

### 3. เริ่ม Development Server
```bash
npm run start:dev
```

Server จะเริ่มที่ http://localhost:3001 แม้ไม่มี database!

### 4. ทดสอบ APIs
- **Health Check**: http://localhost:3001/api/health
- **API Docs**: http://localhost:3001/api/docs
- **Main**: http://localhost:3001/api

---

## 📊 วิธีติดตั้ง Database (ทางเลือก)

### ทางเลือก 1: PostgreSQL บน Windows
1. ดาวน์โหลดจาก https://www.postgresql.org/download/windows/
2. ติดตั้งด้วย default settings
3. สร้าง database: `interlink`
4. แก้ไข `.env`:
   ```
   DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/interlink"
   ```

### ทางเลือก 2: ใช้ SQLite (ง่ายที่สุด)
1. แก้ไข `.env`:
   ```
   DATABASE_URL="file:./dev.db"
   ```
2. แก้ไข `prisma/schema.prisma`:
   ```prisma
   datasource db {
     provider = "sqlite"
     url      = env("DATABASE_URL")
   }
   ```

### ทางเลือก 3: Online Database (Free)
ใช้บริการ free PostgreSQL online:
- **Supabase**: https://supabase.com (Free tier)
- **Railway**: https://railway.app (Free tier)
- **Neon**: https://neon.tech (Free tier)

---

## 🔧 ขั้นตอนพัฒนาต่อ (ไม่ต้องมี Database)

### Phase 2: Authentication Development
```bash
# สร้าง Auth module
npm run nest g module auth
npm run nest g service auth
npm run nest g controller auth

# สร้าง User module  
npm run nest g module users
npm run nest g service users
npm run nest g controller users
```

### ทดสอบ APIs ด้วย Mock Data
- ใช้ Mock data ใน memory
- ทดสอบ Authentication logic
- ทดสอบ API endpoints
- เขียน Unit tests

### เมื่อพร้อมแล้วค่อยเชื่อม Database
- ติดตั้ง Docker Desktop หรือ
- ใช้ PostgreSQL local หรือ  
- ใช้ online database service

---

## 🚀 Quick Start (No Database Required)

```bash
cd interlink-backend
npm install
npm run build  
npm run start:dev
```

**เว็บเบราว์เซอร์**: http://localhost:3001/api/health

จะได้ผลลัพธ์:
```json
{
  "status": "ok",
  "timestamp": "2025-09-07T05:15:00.000Z", 
  "service": "Interlink Backend API",
  "version": "1.0.0",
  "environment": "development"
}
```

**พร้อมพัฒนา Phase 2 ได้เลย!** 🎉