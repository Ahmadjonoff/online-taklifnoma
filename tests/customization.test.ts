import assert from "node:assert/strict";
import { before, describe, it } from "node:test";
import { referencedBlobUrls } from "../src/lib/blob";
import { DEFAULT_CUSTOMIZATION, parseStoredCustomization, sanitizeCustomization } from "../src/lib/customization";

// isOwnBlobUrl store ID'ni tokendan oladi: vercel_blob_rw_<storeId>_<secret>
const STORE = "abc123";
const OWN = `https://${STORE}.public.blob.vercel-storage.com`;
before(() => {
  process.env.BLOB_READ_WRITE_TOKEN = `vercel_blob_rw_${STORE}_secret`;
});

const ctx = (tier: "standard" | "premium" | "luxury") => ({
  paletteIds: ["rose", "navy"],
  eventTypeSlugs: ["nikoh", "toy"],
  tier,
});

describe("sanitizeCustomization", () => {
  it("ruxsat etilmagan palitra, tadbir turi va rangni tashlab yuboradi", () => {
    const r = sanitizeCustomization(
      { palette: "hack", eventType: "nikoh", colors: { paper: "#FFAA00", gold: "red", wine: "#12345" } },
      ctx("standard")
    );
    assert.ok(r.ok);
    assert.equal(r.value.palette, "");
    assert.equal(r.value.eventType, "nikoh");
    assert.deepEqual(r.value.colors, { paper: "#ffaa00", gold: "", wine: "" });
  });

  it("xarita havolasi faqat Google/Yandex bo'lishi mumkin", () => {
    assert.equal(sanitizeCustomization({ googleMapsUrl: "https://evil.com/x" }, ctx("standard")).ok, false);
    assert.equal(sanitizeCustomization({ googleMapsUrl: "javascript:alert(1)" }, ctx("standard")).ok, false);
    const r = sanitizeCustomization({ googleMapsUrl: "http://maps.google.com/?q=1" }, ctx("standard"));
    assert.ok(r.ok);
    assert.equal(r.value.googleMapsUrl, "https://maps.google.com/?q=1");
    // Preview (strict=false): xato emas, shunchaki bo'sh
    const p = sanitizeCustomization({ googleMapsUrl: "https://evil.com" }, ctx("standard"), false);
    assert.ok(p.ok && p.value.googleMapsUrl === "");
  });

  it("tarifga kirmaydigan imkoniyatlar o'chiriladi", () => {
    const input = {
      langs: ["ru", "uz"],
      story: { title: "Hikoya", text: "Matn", photo: `${OWN}/photos/a.jpg` },
      gallery: [`${OWN}/photos/b.jpg`],
      calendar: true,
    };
    const std = sanitizeCustomization(input, ctx("standard"));
    assert.ok(std.ok);
    assert.deepEqual(std.value.langs, ["uz"]);
    assert.deepEqual(std.value.story, DEFAULT_CUSTOMIZATION.story);
    assert.deepEqual(std.value.gallery, []);
    assert.equal(std.value.calendar, false);

    const prem = sanitizeCustomization(input, ctx("premium"));
    assert.ok(prem.ok);
    assert.deepEqual(prem.value.langs, ["ru", "uz"]);
    assert.equal(prem.value.story.photo, `${OWN}/photos/a.jpg`);
    assert.deepEqual(prem.value.gallery, []);

    const lux = sanitizeCustomization(input, ctx("luxury"));
    assert.ok(lux.ok);
    assert.deepEqual(lux.value.gallery, [`${OWN}/photos/b.jpg`]);
    assert.equal(lux.value.calendar, true);
  });

  it("begona saytdagi surat va musiqa qabul qilinmaydi", () => {
    const r = sanitizeCustomization(
      { story: { photo: "https://evil.com/photos/a.jpg" }, gallery: [`${OWN}/music/x.mp3`] },
      ctx("luxury")
    );
    assert.ok(r.ok);
    assert.equal(r.value.story.photo, "");
    assert.deepEqual(r.value.gallery, []);
    assert.equal(sanitizeCustomization({ music: "custom", customMusicUrl: "https://evil.com/music/a.mp3" }, ctx("standard")).ok, false);
    const m = sanitizeCustomization({ music: "custom", customMusicUrl: `${OWN}/music/a.mp3` }, ctx("standard"));
    assert.ok(m.ok && m.value.customMusicUrl === `${OWN}/music/a.mp3`);
  });

  it("karta raqami 16 xonali bo'lishi kerak", () => {
    assert.equal(sanitizeCustomization({ gift: { cardNumber: "1234" } }, ctx("standard")).ok, false);
    const r = sanitizeCustomization({ gift: { cardNumber: "8600123412341234", cardHolder: "ALI" } }, ctx("standard"));
    assert.ok(r.ok);
    assert.equal(r.value.gift.cardNumber, "8600 1234 1234 1234");
  });

  it("buzilgan JSON'dan standart qiymatlar olinadi", () => {
    assert.deepEqual(parseStoredCustomization("{buzuq"), { ...DEFAULT_CUSTOMIZATION, calendar: false });
    assert.deepEqual(parseStoredCustomization(JSON.stringify({ lang: "ru" })).langs, ["ru"]);
  });
});

describe("referencedBlobUrls", () => {
  it("hikoya surati, galereya va musiqani yig'adi", () => {
    const urls = referencedBlobUrls([
      { story: { photo: "a" }, gallery: ["b", "c"], customMusicUrl: "" },
      { story: { photo: "" }, gallery: [], customMusicUrl: "d" },
    ]);
    assert.deepEqual([...urls].sort(), ["a", "b", "c", "d"]);
  });
});
