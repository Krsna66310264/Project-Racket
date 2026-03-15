# Racket — ระบบหาเพื่อนตีแบดมินตัน

**Racket** เป็นเว็บแอปพลิเคชันสำหรับนักกีฬาแบดมินตันที่ต้องการหาเพื่อนร่วมก๊วน ผู้ใช้สามารถโพสต์ประกาศหาคนร่วมเล่น เข้าร่วมก๊วนของคนอื่น และรับการแจ้งเตือนภายในแอปได้ทันที

---

## Tech Stack

| ฝั่ง | เทคโนโลยี |
|------|-----------|
| **Frontend** | Vue.js 3 (Composition API), Vue Router, Pinia, TailwindCSS |
| **Backend** | Node.js, Express.js |
| **Database** | MySQL + Sequelize ORM |
| **Auth** | JWT + Passport.js |
| **Security** | bcrypt |

---

## ฟีเจอร์หลัก

### ระบบผู้ใช้ (User)
- **สมัครสมาชิก** กรอกชื่อ, อีเมล, รหัสผ่าน, ระดับทักษะ, เพศ
- **เข้าสู่ระบบ** ด้วย JWT Token (บันทึกใน LocalStorage)
- **โปรไฟล์** ดูและแก้ไขข้อมูลส่วนตัว
- **Role**: `user` (ทั่วไป) และ `admin` (ผู้ดูแลระบบ)

### ระบบโพสต์ (Post)
- **สร้างโพสต์** ระบุสนาม, วันเวลา, จำนวนคน, ระดับทักษะ, รายละเอียด
- **เข้าร่วมก๊วน** กดปุ่ม "เข้าร่วมเล่น" พร้อม modal แสดงขั้นตอนเตรียมตัว
- **ยกเลิกการเข้าร่วม** ออกจากก๊วนได้
- **แก้ไข / ลบ** โพสต์ตัวเอง (Admin ลบโพสต์ใดก็ได้)
- **แสดงจำนวนที่นั่ง** พร้อม progress bar แบบ real-time

### ระบบกรองโพสต์ (Filter)
- กรองตาม **สถานะ** (ว่าง / เต็ม)
- กรองตาม **ระดับทักษะ** (มือใหม่ / กลาง / สูง)
- กรองตาม **เพศ** ของเจ้าของก๊วน
- **เรียงลำดับ**: ล่าสุด / สุดวันนี้ / ยอดนิยม / ขาดคนมากสุด

### ระบบสนาม (Court) — Admin Only
- เพิ่ม / แก้ไข / ลบ ข้อมูลสนามแบดมินตัน (ชื่อ, ที่ตั้ง)
- สนามถูกดึงมาแสดงในหน้าโพสต์โดยอัตโนมัติ

### ระบบแจ้งเตือนภายในแอป (In-App Notifications)
- แจ้งเตือนทันทีเมื่อ **มีคนเข้าร่วมก๊วน** (แจ้งเจ้าของ + สมาชิก)
- แจ้งเตือนเมื่อ **ก๊วนครบจำนวน**
- แจ้งเตือนเมื่อ **มีคนยกเลิกการเข้าร่วม**
- ไอคอนระฆังใน Sidebar พร้อม badge แสดงจำนวนที่ยังไม่ได้อ่าน
- **Mark as Read** (อ่านทั้งหมดพร้อมกัน)
- **ลบ** แต่ละ notification ได้
- Auto-refresh ทุก 30 วินาที

---

## โครงสร้างโปรเจกต์

```
racket/
├── client/                     # Frontend (Vue.js)
│   └── src/
│       ├── components/
│       │   ├── Posts/          # Index, Show, Create, Edit
│       │   ├── Courts/         # Index (Admin)
│       │   ├── Users/          # Profile
│       │   ├── NotificationBell.vue
│       │   ├── Sidebar.vue
│       │   ├── Login.vue
│       │   └── Register.vue
│       ├── services/           # axios API calls
│       ├── stores/             # Pinia (authen store)
│       └── router/             # Vue Router
│
└── server/                     # Backend (Node.js)
    └── src/
        ├── controllers/
        │   ├── PostController.js
        │   ├── UserController.js
        │   ├── CourtController.js
        │   ├── NotificationController.js
        │   └── UserAuthenController.js
        ├── models/
        │   ├── User.js
        │   ├── Post.js
        │   ├── Court.js
        │   └── Notification.js
        ├── services/
        │   └── NotificationService.js
        └── routes.js
```

---

## วิธีติดตั้งและรันโปรเจกต์

### สิ่งที่ต้องติดตั้งก่อน
- Node.js v18+
- MySQL 8+
- npm

### 1. ตั้งค่า Database
```sql
CREATE DATABASE badminton_app;
```

### 2. ตั้งค่า Backend
```bash
cd server
```
แก้ไขไฟล์ `src/config/config.js` ให้ตรงกับ MySQL ของคุณ:
```js
db: {
  database: 'badminton_app',
  user: 'root',
  password: 'YOUR_PASSWORD',
  ...
}
```
```bash
npm install
npm start
# Server จะรันที่ http://localhost:8081
# Sequelize จะสร้างตารางให้อัตโนมัติ
```

### 3. ตั้งค่า Frontend
```bash
cd client
npm install
npm run dev
# App จะรันที่ http://localhost:5173
```

---

## API Endpoints

| Method | URL | คำอธิบาย | Auth |
|--------|-----|-----------|------|
| POST | `/register` | สมัครสมาชิก | - |
| POST | `/login` | เข้าสู่ระบบ | - |
| GET | `/posts` | ดูโพสต์ทั้งหมด | - |
| POST | `/post` | สร้างโพสต์ | required |
| PUT | `/post/:id` | แก้ไขโพสต์ | required |
| DELETE | `/post/:id` | ลบโพสต์ | required |
| POST | `/post/:id/join` | เข้าร่วมก๊วน | required |
| POST | `/post/:id/leave` | ยกเลิกการเข้าร่วม | required |
| GET | `/courts` | ดูสนามทั้งหมด | - |
| POST | `/court` | เพิ่มสนาม | Admin |
| GET | `/notifications` | ดูการแจ้งเตือน | required |
| PUT | `/notifications/read` | mark อ่านทั้งหมด | required |
| DELETE | `/notification/:id` | ลบการแจ้งเตือน | required |

---

## Database Schema

```
Users         — id, name, email, password, skill_level, gender, role
Posts         — id, title, date_time, end_time, target_players, current_players,
                skill_required, status, description, user_id, joined_user_ids
Courts        — id, name, location
Notifications — id, user_id, type, message, post_id, is_read, createdAt
```

---
