# ที่มาของข้อมูลและภาพ (Third-party notices)

## คลังท่าและภาพเคลื่อนไหวหุ่นกายวิภาค — `lib.json`
- ที่มา: ExerciseDB V1 API (Free Version) โดย [AscendAPI](https://ascendapi.com) — https://oss.exercisedb.dev
- ข้อมูล 1,398 ท่าใน `lib.json` ดึงจาก API นี้ (ตัดท่าคาร์ดิโอและท่ายืดเหยียดออก) ส่วนภาพ GIF โหลดจาก `static.exercisedb.dev`
- เงื่อนไขการใช้ (ตามหน้าเอกสาร ณ ต.ค. 2026):
  - ✅ ใช้ได้กับโปรเจกต์ส่วนตัว การศึกษา และแอปที่ไม่หารายได้
  - ❌ ห้ามใช้เชิงพาณิชย์ เว้นแต่ซื้อแพ็กเกจผ่าน RapidAPI
  - 📝 ต้องให้เครดิต AscendAPI (แอปแสดงเครดิตในหน้ารายละเอียดท่าแล้ว)
- ⚠️ **ถ้าจะขายแอปหรือหารายได้ ต้องเปลี่ยนแหล่งภาพ หรือซื้อสิทธิ์ก่อน**

## รูปสำรอง (Face Pull)
- ที่มา: [yuhonas/free-exercise-db](https://github.com/yuhonas/free-exercise-db)
- สัญญาอนุญาต: The Unlicense (สาธารณสมบัติ)

## แผนที่กล้ามเนื้อหน้า-หลัง — `body.json`
- ที่มา: [HichamELBSI/react-native-body-highlighter](https://github.com/HichamELBSI/react-native-body-highlighter)
  - แปลงจากไฟล์ `assets/bodyFront.ts` และ `assets/bodyBack.ts` เป็น JSON
- สัญญาอนุญาต: MIT

```
MIT License

Copyright (c) 2022 ELABBASSI Hicham

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## วิดีโอสาธิตท่าหลัก — `demos/*.mp4` (24 ไฟล์)
- แปลงจากภาพ GIF ของ ExerciseDB (เงื่อนไขเดียวกับด้านบน: ใช้ส่วนตัวเท่านั้น ต้องให้เครดิต AscendAPI)
- วิธีแปลง: ขยาย 4 เท่าด้วย [Real-ESRGAN](https://github.com/xinntao/Real-ESRGAN) (โมเดล x4plus-anime) → ยืดช่วงเคลื่อนไหว 3.5 เท่า → สร้างเฟรมแทรกเป็น 30fps ด้วย ffmpeg (minterpolate) → MP4 640×640
