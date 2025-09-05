import { Quicksand } from "next/font/google";
import "./globals.css";
import { companyName, poweredBy } from "./cosetting";

const quicksand = Quicksand({
  subsets: ["latin"],
});

export const metadata = {
  title: `${companyName}`,
  description: `hiphoto - GESTIONALE per FOTOGRAFI e CREATIVI | ${poweredBy}`,
};

export default function RootLayout({ children }) {
  return (
    <html lang="it">
      <body className={`${quicksand.className}`}>
        {children}
      </body>
    </html>
  );
}