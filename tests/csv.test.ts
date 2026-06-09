import { describe, it, expect } from "vitest";
import { csvEscape, toCsv } from "@/lib/csv";
import { processingFee } from "@/lib/config";

describe("csvEscape", () => {
  it("quotes fields with commas, quotes, newlines", () => {
    expect(csvEscape("plain")).toBe("plain");
    expect(csvEscape("a,b")).toBe('"a,b"');
    expect(csvEscape('he said "hi"')).toBe('"he said ""hi"""');
    expect(csvEscape("line1\nline2")).toBe('"line1\nline2"');
    expect(csvEscape(null)).toBe("");
    expect(csvEscape(42)).toBe("42");
  });
});

describe("toCsv", () => {
  it("builds header + rows", () => {
    expect(toCsv(["A", "B"], [[1, "x,y"]])).toBe('A,B\n1,"x,y"');
  });
});

describe("processingFee", () => {
  it("applies 2.2% + $0.30 rounded to cents", () => {
    expect(processingFee(100)).toBe(2.5);
    expect(processingFee(1000)).toBe(22.3);
  });
});
