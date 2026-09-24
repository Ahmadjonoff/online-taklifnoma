import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { CUSTOM_MUSIC_PRICE, formatPrice, orderPrice, tierOf, TIER_PRICE } from "../src/lib/pricing";

describe("pricing", () => {
  it("tierOf narxdan tarifni aniqlaydi", () => {
    assert.equal(tierOf(0), "standard");
    assert.equal(tierOf(TIER_PRICE.standard), "standard");
    assert.equal(tierOf(TIER_PRICE.premium), "premium");
    assert.equal(tierOf(TIER_PRICE.luxury - 1), "premium");
    assert.equal(tierOf(TIER_PRICE.luxury), "luxury");
  });

  it("orderPrice o'z musiqasi uchun qo'shimcha summa qo'shadi", () => {
    assert.equal(orderPrice(199_000, { music: "classic" }).total, 199_000);
    const custom = orderPrice(199_000, { music: "custom" });
    assert.equal(custom.total, 199_000 + CUSTOM_MUSIC_PRICE);
    assert.deepEqual(custom.lines.map((l) => l.key), ["template", "customMusic"]);
  });

  it("formatPrice minglikni bo'linmas bo'shliq bilan ajratadi", () => {
    // U+00A0: narx qator oxirida ikkiga bo'linib ketmasin
    assert.equal(formatPrice(1_279_000), "1\u00a0279\u00a0000");
    assert.equal(formatPrice(900), "900");
  });
});
