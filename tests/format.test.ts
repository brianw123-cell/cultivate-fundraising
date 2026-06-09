import { describe, it, expect } from "vitest";
import {
  num,
  money,
  compactMoney,
  donorName,
  initials,
  titleCase,
  pct,
  dateLabel,
  capacityTier,
  affinityLabel,
} from "@/lib/format";

describe("num", () => {
  it("coerces and defaults", () => {
    expect(num(null)).toBe(0);
    expect(num(undefined)).toBe(0);
    expect(num("12.5")).toBe(12.5);
    expect(num(7)).toBe(7);
  });
});

describe("money", () => {
  it("formats whole dollars by default", () => {
    expect(money(1500)).toBe("$1,500");
    expect(money(0)).toBe("$0");
  });
  it("formats with cents when asked", () => {
    expect(money(1500.5, true)).toBe("$1,500.50");
  });
});

describe("compactMoney", () => {
  it("abbreviates thousands and millions", () => {
    expect(compactMoney(803370)).toBe("$803.4K");
    expect(compactMoney(1500000)).toBe("$1.5M");
    expect(compactMoney(500)).toBe("$500");
    expect(compactMoney(1000)).toBe("$1K");
  });
});

describe("donorName", () => {
  it("uses person name for individuals", () => {
    expect(donorName({ type: "individual", first_name: "Jane", last_name: "Doe" })).toBe("Jane Doe");
  });
  it("uses org name for organizations", () => {
    expect(donorName({ type: "organization", org_name: "Acme Foundation" })).toBe("Acme Foundation");
  });
  it("handles missing donor", () => {
    expect(donorName(null)).toBe("Unknown donor");
    expect(donorName(undefined)).toBe("Unknown donor");
  });
});

describe("initials / titleCase / pct", () => {
  it("initials", () => {
    expect(initials("Jane Doe")).toBe("JD");
    expect(initials("Riverside Community Bank")).toBe("RC");
  });
  it("titleCase", () => {
    expect(titleCase("in_honor")).toBe("In Honor");
    expect(titleCase("active")).toBe("Active");
    expect(titleCase(null)).toBe("");
  });
  it("pct", () => {
    expect(pct(1, 4)).toBe(25);
    expect(pct(1, 0)).toBe(0);
  });
});

describe("dateLabel", () => {
  it("formats ISO dates", () => {
    expect(dateLabel("2026-01-15")).toBe("Jan 15, 2026");
  });
  it("handles null", () => {
    expect(dateLabel(null)).toBe("—");
  });
});

describe("capacityTier / affinityLabel", () => {
  it("tiers", () => {
    expect(capacityTier(300000).tier).toBe("$$$$$");
    expect(capacityTier(60000).tier).toBe("$$$$");
    expect(capacityTier(20000).tier).toBe("$$$");
    expect(capacityTier(5000).tier).toBe("$$");
    expect(capacityTier(500).tier).toBe("$");
  });
  it("affinity labels", () => {
    expect(affinityLabel(80)).toBe("High");
    expect(affinityLabel(50)).toBe("Medium");
    expect(affinityLabel(10)).toBe("Low");
  });
});
