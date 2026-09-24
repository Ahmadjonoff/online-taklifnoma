import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  CONTENT_LIMITS,
  MAX_RSVP_GUESTS,
  validateGuestSubmission,
  validateOrderContent,
} from "../src/lib/validation";

const NOW = new Date("2026-09-24T10:00:00Z"); // Toshkentda 15:00

const order = {
  customerName: "Ali",
  phone: "+998 90 123-45-67",
  title: "Ali & Dilnoza",
  partner1: "Ali",
  partner2: "Dilnoza",
  eventDate: "2026-12-25",
  eventTime: "18:30",
  venueName: "Charx",
};

describe("validateOrderContent", () => {
  it("to'g'ri buyurtmani qabul qiladi va standart qiymatlarni to'ldiradi", () => {
    const r = validateOrderContent({ ...order, eventTime: undefined, message: "  Salom\nmehmonlar  " }, NOW);
    assert.ok(r.ok);
    assert.equal(r.value.eventTime, "18:00");
    assert.equal(r.value.message, "Salom\nmehmonlar");
    assert.equal(r.value.venueAddress, "");
  });

  it("majburiy maydon yo'q yoki satr emas — rad etadi", () => {
    assert.equal(validateOrderContent({ ...order, venueName: "" }, NOW).ok, false);
    assert.equal(validateOrderContent({ ...order, title: 123 }, NOW).ok, false);
    assert.equal(validateOrderContent(null, NOW).ok, false);
  });

  it("juda uzun matnni rad etadi", () => {
    const long = "a".repeat(CONTENT_LIMITS.message + 1);
    assert.deepEqual(validateOrderContent({ ...order, message: long }, NOW), { ok: false, error: "Matn juda uzun" });
    assert.equal(validateOrderContent({ ...order, partner1: "a".repeat(CONTENT_LIMITS.partner + 1) }, NOW).ok, false);
  });

  it("telefon, vaqt va sanani tekshiradi", () => {
    assert.equal(validateOrderContent({ ...order, phone: "12345" }, NOW).ok, false);
    assert.equal(validateOrderContent({ ...order, eventTime: "25:00" }, NOW).ok, false);
    assert.equal(validateOrderContent({ ...order, eventTime: "<script>" }, NOW).ok, false);
    assert.equal(validateOrderContent({ ...order, eventDate: "2026-01-01" }, NOW).ok, false); // o'tmish
    assert.equal(validateOrderContent({ ...order, eventDate: "2035-01-01" }, NOW).ok, false); // juda uzoq
    assert.equal(validateOrderContent({ ...order, eventDate: "25.12.2026" }, NOW).ok, false);
    assert.equal(validateOrderContent({ ...order, eventDate: "2026-02-31" }, NOW).ok, false); // mavjud emas
    assert.equal(validateOrderContent({ ...order, eventDate: "2026-09-24" }, NOW).ok, true); // bugun
  });

  it("boshqaruv belgilarini olib tashlaydi", () => {
    const r = validateOrderContent({ ...order, venueName: "Charx\u0000\nzal" }, NOW);
    assert.ok(r.ok);
    assert.equal(r.value.venueName, "Charx  zal");
  });
});

describe("validateGuestSubmission", () => {
  it("RSVP: mehmonlar sonini chegaralaydi", () => {
    const base = { kind: "rsvp", name: "Vali", attending: "keladi" };
    const ok = validateGuestSubmission({ ...base, guests: 3 });
    assert.ok(ok.ok && ok.value.kind === "rsvp" && ok.value.guestsCount === 3);
    const def = validateGuestSubmission(base);
    assert.ok(def.ok && def.value.kind === "rsvp" && def.value.guestsCount === 1);

    for (const guests of [0, -1, MAX_RSVP_GUESTS + 1, 100000, 2.5, "3", 2 ** 31]) {
      assert.equal(validateGuestSubmission({ ...base, guests }).ok, false, `guests=${guests}`);
    }
  });

  it("RSVP: kelolmasa soni 0, noto'g'ri javob rad etiladi", () => {
    const r = validateGuestSubmission({ kind: "rsvp", name: "Vali", attending: "kelolmaydi", guests: 999 });
    assert.ok(r.ok && r.value.kind === "rsvp" && r.value.guestsCount === 0 && !r.value.attending);
    assert.equal(validateGuestSubmission({ kind: "rsvp", name: "Vali", attending: "ha" }).ok, false);
  });

  it("RSVP: mehmon kodi faqat to'g'ri formatda olinadi", () => {
    const base = { kind: "rsvp", name: "Vali", attending: "keladi" };
    const good = validateGuestSubmission({ ...base, guest: "abc234xyz9" });
    assert.ok(good.ok && good.value.kind === "rsvp" && good.value.guest === "abc234xyz9");
    const bad = validateGuestSubmission({ ...base, guest: "'; drop" });
    assert.ok(bad.ok && bad.value.kind === "rsvp" && bad.value.guest === null);
  });

  it("tilak: bo'sh yoki uzun matn rad etiladi", () => {
    assert.equal(validateGuestSubmission({ kind: "wish", name: "Vali", message: "  " }).ok, false);
    assert.equal(validateGuestSubmission({ kind: "wish", name: "Vali", message: "a".repeat(501) }).ok, false);
    const r = validateGuestSubmission({ kind: "wish", name: " Vali ", message: "Baxtli bo'ling!" });
    assert.deepEqual(r, { ok: true, value: { kind: "wish", name: "Vali", message: "Baxtli bo'ling!" } });
  });

  it("noma'lum tur yoki ism yo'q — rad etiladi", () => {
    assert.equal(validateGuestSubmission({ kind: "spam", name: "Vali" }).ok, false);
    assert.equal(validateGuestSubmission({ kind: "wish", message: "salom" }).ok, false);
    assert.equal(validateGuestSubmission({ kind: "wish", name: "a".repeat(81), message: "x" }).ok, false);
  });
});
