import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { approxMapUrls, mapsMissing, withApproxMaps } from "../src/lib/maps";
import { validateOrderContent } from "../src/lib/validation";

describe("maps", () => {
  it("joy nomi va manzildan qidiruv havolalari yasaydi", () => {
    const u = approxMapUrls(" Charx to'yxonasi ", "Toshkent, Chilonzor");
    assert.ok(u);
    assert.equal(u.google, "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent("Charx to'yxonasi, Toshkent, Chilonzor"));
    assert.ok(u.yandex.startsWith("https://yandex.uz/maps/?text="));
    assert.equal(approxMapUrls(" ", ""), null);
  });

  it("faqat tasdiqlangan va havolasi yo'q bo'lsa to'ldiradi", () => {
    const base = { googleMapsUrl: "", yandexMapsUrl: "", mapConfirmed: false };
    assert.deepEqual(withApproxMaps(base, "Charx", ""), base);
    const own = { ...base, googleMapsUrl: "https://maps.app.goo.gl/x", mapConfirmed: true };
    assert.deepEqual(withApproxMaps(own, "Charx", ""), own);
    const filled = withApproxMaps({ ...base, mapConfirmed: true }, "Charx", "");
    assert.ok(filled.googleMapsUrl.includes("Charx") && filled.yandexMapsUrl.includes("Charx"));
  });

  it("havola ham, tasdiq ham bo'lmasa — yetishmaydi", () => {
    assert.equal(mapsMissing({ googleMapsUrl: "", yandexMapsUrl: "", mapConfirmed: false }), true);
    assert.equal(mapsMissing({ googleMapsUrl: "", yandexMapsUrl: "", mapConfirmed: true }), false);
    assert.equal(mapsMissing({ googleMapsUrl: "", yandexMapsUrl: "https://yandex.uz/maps/1", mapConfirmed: false }), false);
  });
});

describe("validateOrderContent — admin tahriri", () => {
  const order = { customerName: "Ali", phone: "901234567", title: "A", partner1: "A", eventDate: "2026-01-10", venueName: "V" };
  const now = new Date("2026-09-24T10:00:00Z");
  it("o'tmishdagi sana faqat allowPastDate bilan qabul qilinadi", () => {
    assert.equal(validateOrderContent(order, now).ok, false);
    assert.equal(validateOrderContent(order, now, { allowPastDate: true }).ok, true);
    assert.equal(validateOrderContent({ ...order, eventDate: "2026-02-31" }, now, { allowPastDate: true }).ok, false);
  });
});
