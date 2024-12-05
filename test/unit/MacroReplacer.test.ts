import { MacroReplacer } from "@/core/MacroReplacer";

describe("Macro replacer", () => {
  it("オークションプライスマクロが置換される", () => {
    const sut = new MacroReplacer({
      cpm: 1,
    });
    const ad = "<div>${AUCTION_PRICE}</div>";

    const result = sut.replace(ad);

    expect(result).toEqual("<div>1</div>");
  });

  it("クリックスローマクロが置換される", () => {
    const sut = new MacroReplacer({
      clickThrough: "https://example.com/clickThrough",
      cpm: 0,
    });
    const ad = "<div>${CLICKTHROUGH}</div>";

    const result = sut.replace(ad);

    expect(result).toEqual("<div>https://example.com/clickThrough</div>");
  });

  it("複数のマクロがまとめて置換される", () => {
    const sut = new MacroReplacer({
      clickThrough: "https://example.com/clickThrough",
      cpm: 1,
    });
    const ad = "<div>${CLICKTHROUGH}, ${AUCTION_PRICE}</div>";

    const result = sut.replace(ad);

    expect(result).toEqual("<div>https://example.com/clickThrough, 1</div>");
  });

  it("マクロが配置されていない場合はプレーンな広告素材で返る", () => {
    const sut = new MacroReplacer({
      cpm: 0,
    });
    const ad = "<div>ad</div>";

    const result = sut.replace(ad);

    expect(result).toEqual("<div>ad</div>");
  });
});
