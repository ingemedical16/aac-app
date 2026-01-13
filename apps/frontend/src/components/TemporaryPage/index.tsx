"use client";

import { usePathname } from "next/navigation";

export default function TemporaryPage() {
  const pathname = usePathname();

  return (
    <section
      style={{
        minHeight: "70vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "2rem",
      }}
    >
      <div>
        <h1 style={{ fontSize: "1.8rem", marginBottom: "1rem" }}>
          🚧 Page under construction
        </h1>

        <p style={{ opacity: 0.7, marginBottom: "0.5rem" }}>
          This page is not ready yet.
        </p>

        <p style={{ fontSize: "0.9rem", opacity: 0.5 }}>
          Route: <code>{pathname}</code>
        </p>
      </div>
    </section>
  );
}
