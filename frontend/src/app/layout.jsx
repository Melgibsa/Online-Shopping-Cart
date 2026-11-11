import { Header } from "@/components/Header";
import { Providers } from "./providers";
import "./globals.css";

export const metadata = {
  title: "Online Store",
  description: "Online shopping cart demo",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col font-sans">
        <Providers>
          <Header />
          <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">{children}</main>
          <footer className="border-t border-slate-200 py-6 text-center text-xs text-slate-500">
            Online Store · Demo project
          </footer>
        </Providers>
      </body>
    </html>
  );
}
