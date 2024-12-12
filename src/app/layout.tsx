import {Navigation} from "@/components/navigation";
import {Toaster} from "@/components/ui/toaster";
import StoreProvider from "@/lib/store/store-provider";

import Fathom from "@/components/fathom-analytics";
import {Loading} from "@/components/loading";
import {ThemeProvider} from "@/components/theme-provider";
import {Viewport} from "next";
import {Open_Sans} from "next/font/google";
import "./globals.css";

const open = Open_Sans({subsets: ["latin"]});

// Simple example to get data server side and pass it to the Redux Toolkit store
const getAppState = async () => {
  return {
    isLoading: false,
  };
};

export const viewport: Viewport = {
  maximumScale: 1,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Get the app state
  const appState = await getAppState();

  return (
    <html lang="en" suppressHydrationWarning>
      <StoreProvider appState={appState}>
        <body className={`${open.className} flex h-screen flex-col`}>
          <Fathom />
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Navigation />
            {children}
            <Toaster />
          </ThemeProvider>
          <Loading />
        </body>
      </StoreProvider>
    </html>
  );
}
