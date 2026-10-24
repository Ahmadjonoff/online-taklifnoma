import assert from "node:assert/strict";
import { afterEach, before, describe, it, mock } from "node:test";
import { checkPassword, createSessionToken, SESSION_MAX_AGE_SECONDS, verifySessionToken } from "../src/lib/adminAuth";

before(() => {
  process.env.ADMIN_PASSWORD = "maxfiy-parol";
});
afterEach(() => mock.timers.reset());

describe("adminAuth", () => {
  it("parolni tekshiradi", () => {
    assert.equal(checkPassword("maxfiy-parol"), true);
    assert.equal(checkPassword("maxfiy-paro"), false);
    assert.equal(checkPassword(""), false);
  });

  it("imzolangan token tekshiruvdan o'tadi, parol tokenda yo'q", () => {
    const token = createSessionToken();
    assert.equal(verifySessionToken(token), true);
    assert.ok(!token.includes("maxfiy-parol"));
  });

  it("o'zgartirilgan yoki buzuq token rad etiladi", () => {
    const [issuedAt, nonce, sig] = createSessionToken().split(".");
    assert.equal(verifySessionToken(`${Number(issuedAt) + 1}.${nonce}.${sig}`), false);
    assert.equal(verifySessionToken(`${issuedAt}.${nonce}.${"0".repeat(sig.length)}`), false);
    assert.equal(verifySessionToken("a.b"), false);
    assert.equal(verifySessionToken(undefined), false);
  });

  it("boshqa parol bilan imzolangan token rad etiladi", () => {
    const token = createSessionToken();
    process.env.ADMIN_PASSWORD = "yangi-parol";
    try {
      assert.equal(verifySessionToken(token), false);
    } finally {
      process.env.ADMIN_PASSWORD = "maxfiy-parol";
    }
  });

  it("muddati o'tgan token rad etiladi", () => {
    mock.timers.enable({ apis: ["Date"], now: 1_000_000 });
    const token = createSessionToken();
    mock.timers.tick(SESSION_MAX_AGE_SECONDS * 1000 - 1);
    assert.equal(verifySessionToken(token), true);
    mock.timers.tick(2);
    assert.equal(verifySessionToken(token), false);
  });
});
