import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/lib/provider";
import SuspenseLoader from "@/components/suspense-loader";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Suspense } from "react";
import NextTopLoader from "nextjs-toploader";
import { SidebarProvider } from "@/context/SidebarContext";
import { ActionProvider } from "@/context/ActionContext";
import { ThemeProvider } from "@/context/ThemeContext";

// Configure Space Grotesk font
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  weight: ["300", "400", "500", "600", "700"],
});

// Add viewport metadata for responsive design
export const metadata: Metadata = {
  title: "LACON",
  description: "LACON",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${spaceGrotesk.variable} font-sans antialiased min-h-screen bg-white`}>
        <AppProvider>
          <Suspense fallback={<SuspenseLoader />}>
            <Toaster richColors expand={true} position="top-center" />
            <TooltipProvider>
              <ThemeProvider>
                <SidebarProvider>
                  <ActionProvider>
                    {children}
                  </ActionProvider>
                </SidebarProvider>
              </ThemeProvider>
              <NextTopLoader showSpinner={false} color="#6F4E37" />
            </TooltipProvider>
          </Suspense>
        </AppProvider>
      </body>
    </html>
  );
}
