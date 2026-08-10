import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const title = searchParams.get("title") ?? "3A9AR.ma";
  const price = searchParams.get("price") ?? "";
  const city = searchParams.get("city") ?? "";

  const displayTitle = title.length > 60 ? title.slice(0, 57) + "..." : title;

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
          fontFamily: "sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            width: "400px",
            height: "400px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
            opacity: "0.15",
            top: "-100px",
            right: "-80px",
          }}
        />
        <div
          style={{
            position: "absolute",
            width: "250px",
            height: "250px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
            opacity: "0.12",
            bottom: "-60px",
            left: "-40px",
          }}
        />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            padding: "48px 64px 0",
            zIndex: 1,
          }}
        >
          <div
            style={{
              fontSize: "36px",
              fontWeight: "800",
              color: "#10b981",
              letterSpacing: "-0.5px",
            }}
          >
            3A9AR.ma
          </div>
          <div
            style={{
              marginLeft: "auto",
              fontSize: "18px",
              color: "#94a3b8",
              fontWeight: "500",
            }}
          >
            Plateforme Immobilière Marocaine
          </div>
        </div>

        <div
          style={{
            height: "2px",
            background: "linear-gradient(90deg, #10b981, #059669, transparent)",
            margin: "24px 64px 0",
            zIndex: 1,
          }}
        />

        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "0 64px",
            zIndex: 1,
          }}
        >
          <div
            style={{
              fontSize: "48px",
              fontWeight: "700",
              color: "#f1f5f9",
              lineHeight: 1.2,
              marginBottom: "24px",
              maxWidth: "900px",
            }}
          >
            {displayTitle}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
            {price && (
              <div
                style={{
                  fontSize: "32px",
                  fontWeight: "800",
                  color: "#10b981",
                  background: "rgba(16, 185, 129, 0.15)",
                  padding: "8px 24px",
                  borderRadius: "12px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {price} MAD
              </div>
            )}
            {city && (
              <div
                style={{
                  fontSize: "24px",
                  fontWeight: "600",
                  color: "#fbbf24",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                {city}
              </div>
            )}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "0 64px 48px",
            zIndex: 1,
          }}
        >
          <div
            style={{
              fontSize: "18px",
              color: "#64748b",
            }}
          >
            Immobilier Maroc — Appartements, Villas, Riads, Terrains
          </div>
          <div
            style={{
              fontSize: "16px",
              color: "#94a3b8",
              background: "rgba(148, 163, 184, 0.1)",
              padding: "6px 16px",
              borderRadius: "8px",
            }}
          >
            www.3a9ar.ma
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      headers: { "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800" },
    },
  );
}
