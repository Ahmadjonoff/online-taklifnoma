import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { dateInviteReply } from "../src/lib/telegramBot";

describe("dateInviteReply", () => {
  it("uchrashuv javobini belgilar bilan, tartibda yozadi", () => {
    const text = dateInviteReply(
      "Madina",
      "Uchrashuv: Kafe\nJoy: «Bon» kafesi\nSana: Shanba, 21-noyabr\nVaqt: 19:00",
      "https://example.uz/buyurtma/abc"
    );
    assert.equal(
      text,
      [
        "💌 Madina taklifingizga «HA» dedi!",
        "",
        "✨ Uchrashuv: Kafe",
        "📍 Joy: «Bon» kafesi",
        "📅 Sana: Shanba, 21-noyabr",
        "🕐 Vaqt: 19:00",
        "",
        "📋 Barcha javoblar: https://example.uz/buyurtma/abc",
      ].join("\n")
    );
  });

  it("noma'lum qatorlarni o'zgartirmaydi, bo'sh qatorlarni tashlaydi", () => {
    const text = dateInviteReply("Ali", "Izoh: tezroq\n\n", "u");
    assert.ok(text.includes("\nIzoh: tezroq\n"));
    assert.ok(!text.includes("\n\n\n"));
  });
});
