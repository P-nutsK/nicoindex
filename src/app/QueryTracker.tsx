"use client";
import { useSetAtom } from "jotai";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { fromUrlFrendly } from "./util";
import { filterAtom } from "./atoms";

export function QueryTracker() {
	const setFilter = useSetAtom(filterAtom);
	const searchParams = useSearchParams();
	useEffect(() => {
		console.log(...searchParams.entries());
		const tag = fromUrlFrendly(searchParams.get("tag") ?? "") as string[];
		const contain = fromUrlFrendly(searchParams.get("q") ?? "") as string[];
		const user = JSON.parse(searchParams.get("user") ?? "null") as string | null;
		setFilter({
			query: contain,
			tag,
			user,
		});
	}, [setFilter, searchParams]);
	return null;
}
