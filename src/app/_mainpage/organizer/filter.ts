"use client";
import type { Video } from "@/types";
import { type SetStateAction, useAtomValue, useSetAtom } from "jotai";
import { type Dispatch, useCallback, useRef } from "react";
import { organizerAtom } from "../atoms";
import { filterStringify } from "../util";
import { useVideos } from "../utils/VideoProvier";
export type SortAlgorithm = "views" | "likes" | "comment" | "mylist" | "upload";
export type Order = "asc" | "desc";
type WithOrder<T extends string> = `${T}_${Order}`;
export type SortType = WithOrder<SortAlgorithm>;
export type Filter = {
	tag: string[];
	user: string | null;
	query: string | null;
};
export type Organizer = Filter & {
	sort: SortType;
};

export function useOrgnizerValue() {
	return useAtomValue(organizerAtom);
}

export function useSetOrganizer(): Dispatch<SetStateAction<Organizer>> {
	const setFilterValue = useSetAtom(organizerAtom);
	const setFilter = useCallback(
		(value: SetStateAction<Organizer>) => {
			setFilterValue(prev => {
				const incomming: Organizer = typeof value === "function" ? value(prev) : value;

				// 同じときは何もしない
				if (prev === incomming) return prev;
				const pathname = filterStringify(incomming);

				window.history.pushState(null, "", pathname);

				return incomming;
			});
		},
		[setFilterValue],
	);
	return setFilter;
}

export function useFilterdVideos() {
	const filter = useAtomValue(organizerAtom);
	const videos = useVideos();
	const prev = useRef<{ videos: Video[]; filter: Organizer } | null>(null);
	if (!prev.current) {
		prev.current = {
			videos,
			filter: { tag: [], query: null, user: null, sort: /* sortの管理は別の責務 */ filter.sort },
		};
	}
	const compatible = calcFilterCompat(prev.current.filter, filter);

	switch (compatible) {
		case OrganizerCompatible.Equal:
			console.log("pass filltering");
			return prev.current.videos;
		case OrganizerCompatible.Assignable: {
			console.log("reuse prev videos");
			const filterd = filterVideos(prev.current.videos, filter);
			prev.current = { filter: filter, videos: filterd };
			return filterd;
		}
		case OrganizerCompatible.No: {
			console.log("full filter");
			const filterd = filterVideos(videos, filter);
			prev.current = { filter: filter, videos: filterd };
			return filterd;
		}
	}
}

function filterVideos(videos: Video[], filter: Filter) {
	return videos.filter(v => {
		return (
			filter.tag.every(tag => v.tags.some(t => t.name === tag)) &&
			(filter.user ? v.ownerNickname === filter.user : true) &&
			(filter.query?.split(" ") ?? []).every(
				text =>
					(v.ownerNickname && weakIncludes(v.ownerNickname, text)) ||
					weakIncludes(v.title, text) ||
					weakIncludes(v.description, text) ||
					weakIncludes(
						v.tags
							.map(({ name }) => name)
							.join(/* 入力されるはずがない文字(無幅ワードブレーク) */ "\u2063"),
						text,
					),
			)
		);
	});
}

const enum OrganizerCompatible {
	Equal,
	Assignable,
	No,
}

function calcFilterCompat(a: Organizer, b: Organizer) {
	console.log(a, b);
	const query = calcQueryCompat(a.query, b.query);
	const tag = calcTagCompat(a.tag, b.tag);
	const user = calcUserCompat(a.user, b.user);
	const sort = a.sort === b.sort ? OrganizerCompatible.Equal : OrganizerCompatible.No;
	// 全部同じ
	// console.log({ query, tag, user, sort });
	return Math.max(query, tag, user, sort) as OrganizerCompatible;
}

function calcQueryCompat(a: string | null, b: string | null) {
	// nullは実質""として考える

	// 同じなら割り当てられる
	if (a === b) return OrganizerCompatible.Equal;
	// bだけnullなら割り当てられない
	if (b === null) return OrganizerCompatible.No;
	// aだけnullなら割り当てられる
	if (a === null) return OrganizerCompatible.Assignable;
	// bがaを包括するか
	return b.includes(a) ? OrganizerCompatible.Assignable : OrganizerCompatible.No;
}

function calcTagCompat(a: string[], b: string[]) {
	// 参照先が同じ
	if (a === b) return OrganizerCompatible.Equal;
	// 前回の方が詳細度が高い
	if (a.length > b.length) {
		return OrganizerCompatible.No;
	}
	// bの全てはaに含まれているか
	return b.every(item => a.includes(item)) ? OrganizerCompatible.Assignable : OrganizerCompatible.No;
}

function calcUserCompat(a: string | null, b: string | null) {
	if (a === b) return OrganizerCompatible.Equal;
	if (b === null) return OrganizerCompatible.No;
	if (a === null) return OrganizerCompatible.Assignable;
	return OrganizerCompatible.No;
}

function weakIncludes(a: string, b: string) {
	return a.toLocaleLowerCase().includes(b.toLocaleLowerCase());
}
