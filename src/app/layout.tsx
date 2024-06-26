import { Analytics } from "@vercel/analytics/react";
import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import generateTitle from "./_mainpage/utils/title";
import "./globals.css";

const notosansJp = Noto_Sans_JP({ subsets: ["latin"], weight: "200" });

export const metadata: Metadata = {
	title: generateTitle(null),
	description: "ニコニコ動画（Re:仮）で投稿されている動画をタグやユーザーで絞り込み、高速に検索ができます。",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="ja">
			<body className={notosansJp.className}>{children}</body>
			<Analytics />
		</html>
	);
}
