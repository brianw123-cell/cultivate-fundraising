import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Cultivate — Grow generosity";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "linear-gradient(135deg, #1B4332 0%, #0B1A14 100%)",
          color: "#FAF8F3",
          fontFamily: "serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 18,
              background: "#FAF8F3",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 40,
            }}
          >
            🌱
          </div>
          <div style={{ fontSize: 40, fontWeight: 600 }}>Cultivate</div>
        </div>
        <div style={{ fontSize: 88, fontWeight: 700, marginTop: 40, letterSpacing: -2 }}>
          Grow generosity.
        </div>
        <div style={{ fontSize: 34, color: "#B7E4C7", marginTop: 24, maxWidth: 900 }}>
          Simple, honest fundraising software for growing nonprofits.
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 48,
            gap: 12,
          }}
        >
          {["#52B788", "#D4A017", "#B7E4C7"].map((c) => (
            <div key={c} style={{ width: 56, height: 8, borderRadius: 8, background: c }} />
          ))}
        </div>
      </div>
    ),
    { ...size }
  );
}
