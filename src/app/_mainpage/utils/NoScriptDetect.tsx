"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function NoScriptDetect({ noscriptMode: noscriptmode }: { noscriptMode: boolean }) {
	const router = useRouter();
	useEffect(() => {
		if (noscriptmode) {
			console.log("noscript mode detected. redirecting...");
			router.replace("/");
		}
	}, [router, noscriptmode]);

	return null;
}
