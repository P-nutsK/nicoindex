"use client";
import { useSetAtom } from "jotai";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { organizerAtom } from "../atoms";
import { parseSearchParams } from "../util";

export function QueryTracker() {
	const setFilter = useSetAtom(organizerAtom);
	const searchParams = useSearchParams();
	const pathname = usePathname();
	// paramが増えたり減ったりする時はuseParamsは使えませんでした…?
	useEffect(() => {
		console.log(...searchParams.entries());
		const matched = pathname.match(/\/user\/([^/?]*)/);
		const user = matched ? decodeURIComponent(matched[1]) : null;
		console.log(user);
		setFilter({
			...parseSearchParams({
				tag: searchParams.get("tag"),
				query: searchParams.get("q"),
				sort: searchParams.get("sort"),
			}),
			user,
		});
	}, [setFilter, searchParams, pathname]);
	return null;
}
