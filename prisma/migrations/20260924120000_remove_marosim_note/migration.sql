-- "Marosim haqida" eslatmasini shablonlardan olib tashlash: matnda vaqt
-- ("17:30") qattiq yozilgan edi va mijozning haqiqiy vaqtiga mos kelmasdi.
-- Seed nikoh shablonlariga faqat shu bitta eslatmani yozgan — ro'yxat
-- bo'shatiladi (bo'sh bo'lsa, taklifnomada bo'lim ko'rinmaydi).
UPDATE "Template"
SET "notes" = '[]'
WHERE "notes" LIKE '%Marosim haqida%';
