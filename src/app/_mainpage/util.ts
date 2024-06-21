import { sort_default } from "./atoms";
import type { Organizer, SortType } from "./organizer/filter";

export function toUrlFrendly(arr: string[]) {
	return JSON.stringify(arr).slice(1, -1);
}
export function fromUrlFrendly(str: string): unknown {
	try {
		return JSON.parse(`[${str}]`);
	} catch (error) {
		console.error(error);
		return [];
	}
}
type Nullish = null | undefined;
export function parseSearchParams(searchParams: {
	tag: string | Nullish;
	query: string | Nullish;
	sort: string | Nullish;
}): Omit<Organizer, "user"> {
	const tag = fromUrlFrendly(searchParams.tag ?? "") as string[];
	const query = JSON.parse(searchParams.query ?? "null") as string | null;
	const sort = (searchParams.sort ?? "views_desc") as SortType;
	return { tag, query, sort };
}

export function formatDate(date: Date) {
	const year = date.getFullYear().toString().substring(2, 4);
	const month = date.getMonth().toString().padStart(2, "0");
	const date_ = date.getDate().toString().padStart(2, "0");
	const hour = date.getHours().toString().padStart(2, "0");
	const minute = date.getMinutes().toString().padStart(2, "0");
	return `${year}/${month}/${date_} ${hour}:${minute}`;
}

export function formatDuration(duration: number) {
	const hour = Math.floor(duration / 3600);
	const minute = Math.floor(duration / 60) % 60;
	const seconds = duration % 60;
	const minutestr = minute.toString().padStart(2, "0");
	const secondsstr = seconds.toString().padStart(2, "0");
	if (hour > 0) {
		return `${hour}:${minutestr}:${secondsstr}`;
	} else {
		return `${minutestr}:${secondsstr}`;
	}
}
export function filterStringify(filter: Organizer, baseSearchParams: Iterable<string[]> = []) {
	const searchParams = new URLSearchParams([...baseSearchParams]);
	if (filter.tag.length > 0) {
		searchParams.set("tag", toUrlFrendly(filter.tag));
	}
	if (filter.query !== null) {
		searchParams.set("q", JSON.stringify(filter.query));
	}
	if (filter.sort !== sort_default) {
		searchParams.set("sort", filter.sort);
	}
	const searchParamsString = searchParams.toString();
	let path = "/";
	if (filter.user !== null) {
		path += `user/${encodeURIComponent(filter.user)}`;
	}
	if (searchParamsString === "") {
		return path;
	}
	return path + `?${searchParamsString}`;
}
