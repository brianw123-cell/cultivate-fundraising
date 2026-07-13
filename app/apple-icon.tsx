import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background:
            "linear-gradient(155deg, #2D5F3F 0%, #1B4332 55%, #14331F 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg
          width="180"
          height="180"
          viewBox="0 0 180 180"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M90 148 C90 118 90 100 90 78"
            stroke="#FAF8F3"
            strokeWidth="9"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M90 84 C102 52 140 47 155 41 C151 74 120 91 90 84 Z"
            fill="#E5B333"
          />
          <path
            d="M90 108 C77 79 43 76 28 71 C33 100 61 116 90 108 Z"
            fill="#74C69D"
          />
        </svg>
      </div>
    ),
    { ...size }
  );
}
