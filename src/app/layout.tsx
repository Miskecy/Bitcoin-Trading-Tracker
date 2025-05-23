import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Bitcoin Trading Tracker",
	description: "Track premium trades, harvest profits, and reinvest with clarity.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased dark`}
			>
				{children}
				<footer className="text-center text-sm text-muted-foreground pb-24">
					<p>
						Made with ❤️ by{" "} Chikyuujin.
					</p>
					<Link href="/help" target="_blank" rel="noopener noreferrer" className="text-fuchsia-300">Help Guide</Link>
				</footer>
			</body>
		</html>
	);
}
