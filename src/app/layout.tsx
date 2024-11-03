import AddVisitCount from "@/components/layout/AddVisitCount";
import Providers from "@/components/layout/Providers";
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/utils";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Rubik } from "next/font/google";

import Confetti from "@/components/layout/Confetti";
import Footer from "@/components/layout/Footer";
import { Header } from "@/features/header/components/header";
import "@/styles/globals.css";
import VersionUpdateToast from "@/components/version/VersionUpdateToast";
import { appVersion } from "@/constants/config";
import type { Metadata } from "next";

const APP_NAME = "Teensy";
const APP_DEFAULT_TITLE = "Teensy your URLs";
const APP_TITLE_TEMPLATE = "%s - Teensy";
const APP_DESCRIPTION =
	"A Customizable URL shortener. Paste URL, give it a name, done!";

export const metadata: Metadata = {
	applicationName: APP_NAME,
	title: {
		default: APP_DEFAULT_TITLE,
		template: APP_TITLE_TEMPLATE,
	},
	description: APP_DESCRIPTION,
	appleWebApp: {
		capable: true,
		statusBarStyle: "default",
		title: APP_DEFAULT_TITLE,
	},
	formatDetection: {
		telephone: false,
	},
};

const rubik = Rubik({
	subsets: ["latin"],
});

export default function RootLayout({
	children,
	authModal,
}: {
	children: React.ReactNode;
	authModal: React.ReactNode;
}) {
	return (
		<html
			lang="en"
			className={cn("antialiased", rubik.className)}
			suppressHydrationWarning // next-themes hydration warning
		>
			<body className="flex h-screen flex-col md:overflow-x-hidden">
				<Providers>
					<Header />
					{authModal}
					<section className="mt-12 flex flex-1 flex-col items-center justify-center p-6">
						{children}
					</section>
					<Footer />
					<Confetti />
					<VersionUpdateToast backendVersion={appVersion} />
					<AddVisitCount />
					<Toaster richColors />
				</Providers>
				<Analytics />
				<SpeedInsights />
			</body>
		</html>
	);
}
