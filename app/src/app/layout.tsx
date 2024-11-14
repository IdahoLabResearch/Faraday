import type { Metadata } from "next";

// Style
import Theme from "./theme/theme";
import "./globals.css";

// Store
import StoreProvider from "./store";

export const metadata: Metadata = {
  title: "Faraday",
  description: "High temperature electrolosys visualization",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Theme>
      <html
        lang="en"
        className="animate-body bg-gradient-to-br from-black to-dark text-white"
      >
        <StoreProvider>
          <body>{children}</body>
        </StoreProvider>
      </html>
    </Theme>
  );
}
