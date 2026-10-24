import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { cleanSource } from "../src/lib/attribution";

describe("cleanSource", () => {
  it("utm_source ni xavfsiz qisqa belgiga aylantiradi", () => {
    assert.equal(cleanSource("Instagram"), "instagram");
    assert.equal(cleanSource("ig_reels-01"), "ig_reels-01");
    assert.equal(cleanSource("<script>alert(1)</script>"), "scriptalert1script");
    assert.equal(cleanSource("a".repeat(100)).length, 40);
  });

  it("satr bo'lmasa — bo'sh", () => {
    assert.equal(cleanSource(undefined), "");
    assert.equal(cleanSource(42), "");
  });
});
