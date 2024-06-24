"use client";
import { useSetAtom } from "jotai";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { organizerAtom } from "../atoms";
import type { Organizer } from "../organizer/filter";
import { parseSearchParams } from "../util";

export function QueryTracker() {
	const setFilter = useSetAtom(organizerAtom);
	const params = useCustomParams();
	params && setFilter(params);

	return null;
}

function useCustomParams() {
	const [params, setParams] = useState<Organizer | null>(null);
	const searchParams = useSearchParams();
	const pathname = usePathname();
	// paramが増えたり減ったりする時はuseParamsは使えませんでした…?
	useEffect(() => {
		console.log(...searchParams.entries());
		const matched = pathname.match(/\/user\/([^/?]*)/);
		const user = matched ? decodeURIComponent(matched[1]) : null;
		console.log(user);
		setParams({
			...parseSearchParams({
				tag: searchParams.get("tag"),
				query: searchParams.get("q"),
				sort: searchParams.get("sort"),
			}),
			user,
		});
	}, [searchParams, pathname]);
	return params;
}
