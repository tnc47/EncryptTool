
# Encrypt Folder Script

สคริปต์ Node.js นี้ใช้สำหรับประมวลผลไฟล์ในโฟลเดอร์ที่ระบุ โดยจะทำการ:

- Obfuscate ไฟล์ JavaScript ด้วย `javascript-obfuscator`
- Minify ไฟล์ CSS ด้วย `clean-css`
- Minify ไฟล์ HTML ด้วย `html-minifier-terser`
- คัดลอกไฟล์อื่น ๆ โดยไม่เปลี่ยนแปลง
- ข้ามไฟล์หรือโฟลเดอร์ที่ระบุใน `ignore_encrypt.json`
- มีการแสดงผล Log ด้วยสี เพื่อให้ดูง่ายและชัดเจน

---

## ฟีเจอร์ (Features)

- เดินไฟล์ในโฟลเดอร์แบบ recursive
- สนับสนุน ignore list ผ่านไฟล์ `ignore_encrypt.json`
- รับพาธ input และ output ผ่านคำสั่งใน CLI
- แสดงผลแบบสีเพื่อความเข้าใจง่าย

---

## สิ่งที่ต้องมี (Prerequisites)

- ติดตั้ง [Node.js](https://nodejs.org/) (แนะนำเวอร์ชัน 14 ขึ้นไป)
- npm (มาพร้อม Node.js)

---

## การติดตั้ง (Installation)

```bash
npm install javascript-obfuscator clean-css-cli html-minifier-terser
```

หรือถ้าต้องการติดตั้งแบบ global:

```bash
npm install -g javascript-obfuscator clean-css-cli html-minifier-terser
```

---

## วิธีใช้งาน (Usage)

เรียกใช้สคริปต์ด้วยคำสั่ง:

```bash
node encrypt.js
```

ระบบจะถาม:

1. **Enter input folder path:**  
   ระบุพาธของโฟลเดอร์ที่ต้องการประมวลผล (ต้องมีอยู่จริง)

2. **Enter output folder path:**  
   ระบุพาธของโฟลเดอร์ที่ต้องการเก็บผลลัพธ์ (ถ้าเว้นว่างจะตั้งเป็น `<inputFolder>_encrypt`)

หลังจากนั้นสคริปต์จะประมวลผลไฟล์ตามที่กำหนดและแสดงผลลัพธ์บนหน้าจอ

---

## ไฟล์ ignore_encrypt.json

สร้างไฟล์ `ignore_encrypt.json` ในโฟลเดอร์ต้นทาง (input folder) เพื่อกำหนดไฟล์หรือโฟลเดอร์ที่ไม่ต้องการให้เข้ารหัสหรือย่อขนาด

ตัวอย่างเนื้อหาไฟล์:

```json
[
  "node_modules",
  "assets/images",
  "config.js"
]
```

โดยพาธในไฟล์นี้จะนับเป็น **relative path** จากโฟลเดอร์ต้นทาง

---

## ตัวอย่างโครงสร้างโปรเจกต์

```
my-project/
├─ index.html
├─ main.js
├─ style.css
├─ ignore_encrypt.json
└─ assets/
   └─ logo.png
```

เมื่อรันสคริปต์และระบุ `my-project` เป็น input:

- `main.js` จะถูก obfuscate
- `style.css` และ `index.html` จะถูก minify
- `assets/logo.png` จะถูกคัดลอก
- ไฟล์หรือโฟลเดอร์ใน `ignore_encrypt.json` จะถูกข้าม

ผลลัพธ์จะถูกเก็บในโฟลเดอร์ `my-project_encrypt` ตามค่าเริ่มต้น

---

## การแสดงผล (Colorful Log Output)

- **สีฟ้า (Cyan):** ข้อความทั่วไป เช่น ข้ามไฟล์
- **สีเขียว (Green):** สำเร็จ เช่น obfuscate หรือ minify เสร็จ
- **สีเหลือง (Yellow):** คำเตือน เช่น ไฟล์ JSON ผิดรูปแบบ
- **สีแดง (Red):** ข้อผิดพลาด เช่น เข้ารหัสไม่สำเร็จ

---

## ข้อควรระวัง (Troubleshooting)

- ตรวจสอบให้แน่ใจว่าได้ติดตั้ง dependencies และสามารถใช้ `npx` ได้
- พาธโฟลเดอร์ input ต้องมีอยู่จริง
- โฟลเดอร์ output จะถูกสร้างขึ้นถ้ายังไม่มี
- ตรวจสอบ syntax ใน `ignore_encrypt.json` ให้ถูกต้อง

---

## ลิขสิทธิ์ (License)

MIT License

---

## ผู้พัฒนา (Author)
Tnc47 X Quitfile Production