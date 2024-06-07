import type { Metadata } from "next";
import { Inter } from "next/font/google";
// import "./globals.css";
import { ThirdwebProvider } from "@/app/thirdweb";
import { client } from "./utils/client";

import "bulma";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Welcome to Dracoria",
  description: "A magical land of dragons and intrigue.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ThirdwebProvider >
          {children}
        </ThirdwebProvider>
      </body>
    </html>
  );
}
