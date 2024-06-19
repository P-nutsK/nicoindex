"use client";
import { useAtomValue, useSetAtom, type SetStateAction } from "jotai";
import { type Dispatch, useCallback } from "react";
import { toUrlFrendly } from "./util";
import type { Video } from "@/generate_videos";
import { filterAtom } from "./atoms";

export type Filter = {
	tag: string[];
	user: string | null;
	query: string[];
};

export function useFilterValue() {
	return useAtomValue(filterAtom);
}

export function useSetFilter(): Dispatch<SetStateAction<Filter>> {
	const setFilterValue = useSetAtom(filterAtom);
	const setFilter = useCallback(
		(setStateAction: SetStateAction<Filter>) => {
			setFilterValue(prev => {
				let incomming: Filter;
				if (typeof setStateAction === "function") {
					incomming = setStateAction(prev);
				} else {
					incomming = setStateAction;
				}
				// 同じときは副作用を起こさない
				if (prev === incomming) return prev;
				const searchParams = new URLSearchParams();
				if (incomming.tag.length > 0) {
					searchParams.set("tag", toUrlFrendly(incomming.tag));
				}
				if (incomming.query.length > 0) {
					searchParams.set("q", toUrlFrendly(incomming.query));
				}
				if (incomming.user !== null) {
					searchParams.set("user", JSON.stringify(incomming.user));
				}
				const searchString = searchParams.toString();
				window.history.pushState(null, "", `?${searchString}`);

				return incomming;
			});
		},
		[setFilterValue],
	);
	return setFilter;
}

export function isTagChecked(tag: string, filter: Filter) {
	return filter.tag.includes(tag);
}

export function filterVideos(videos: Video[], filter: Filter) {
	return videos.filter(v => {
		return (
			filter.tag.every(tag => v.tags.some(t => t.name === tag)) &&
			(filter.user ? v.ownerNickname === filter.user : true) &&
			filter.query.every(text => v.title.includes(text))
		);
	});
}
