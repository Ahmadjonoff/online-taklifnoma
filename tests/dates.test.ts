import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { addYears, dateLabel, eventDateRange, isoDate, isRealDate, tashkentDate } from "../src/lib/dates";
import { scriptJson } from "../src/lib/html";

describe("dates", () => {
  it("isRealDate mavjud bo'lmagan kunlarni rad etadi", () => {
    assert.equal(isRealDate("2026-12-25"), true);
    assert.equal(isRealDate("2028-02-29"), true); // kabisa yili
    assert.equal(isRealDate("2026-02-29"), false);
    assert.equal(isRealDate("2026-02-31"), false);
    assert.equal(isRealDate("2026-04-31"), false);
    assert.equal(isRealDate("2026-13-01"), false);
    assert.equal(isRealDate("25.12.2026"), false);
  });

  it("isoDate server vaqt zonasiga bog'liq emas (UTC)", () => {
    assert.equal(isoDate(new Date("2026-12-25")), "2026-12-25");
    assert.equal(dateLabel("2026-12-25"), "25.12.2026");
  });

  it("'bugun' Toshkent vaqti bo'yicha hisoblanadi", () => {
    // 24-sentabr 20:30 UTC = 25-sentabr 01:30 Toshkentda
    assert.equal(tashkentDate(new Date("2026-09-24T20:30:00Z")), "2026-09-25");
    assert.equal(tashkentDate(new Date("2026-09-24T18:59:00Z")), "2026-09-24");
  });

  it("addYears 29-fevralni to'g'ri siljitadi", () => {
    assert.equal(addYears("2028-02-29", 3), "2031-02-28");
    assert.equal(addYears("2026-09-24", 3), "2029-09-24");
    assert.deepEqual(eventDateRange(new Date("2026-09-24T10:00:00Z")), { min: "2026-09-24", max: "2029-09-24" });
  });
});

describe("scriptJson", () => {
  it("har bir '<' ni escape qiladi, qiymat o'zgarmaydi", () => {
    const value = { a: "</script><!--<script>alert(1)</script>", b: "a < b" };
    const out = scriptJson(value);
    assert.ok(!out.includes("<"));
    assert.deepEqual(JSON.parse(out), value);
  });
});
